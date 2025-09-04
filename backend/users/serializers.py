from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, UserPerfil
from datetime import date, datetime
import re
import logging

logger = logging.getLogger(__name__)

class UserPerfilSerializer(serializers.ModelSerializer):
    """
    Serializer para o perfil do usuário com validações robustas.
    
    Campos:
    - cep: CEP do usuário (8 dígitos)
    - endereco: Endereço completo
    - bairro: Bairro de residência
    - cidade: Cidade de residência
    - estado: Estado (UF)
    - telefone: Telefone (10 ou 11 dígitos)
    - genero: Gênero (M/F/O)
    - foto: Foto do perfil (opcional)
    """
    
    class Meta:
        model = UserPerfil
        fields = '__all__'
        extra_kwargs = {
            'user': {'read_only': True},
            'cep': {'help_text': 'Formato: 00000-000'},
            'telefone': {'help_text': 'Formato: (00) 00000-0000'},
        }
    
    def validate_cep(self, value):
        """
        Valida formato do CEP.
        """
        if value:
            # Remove caracteres não numéricos
            cep_clean = re.sub(r'\D', '', value)
            if len(cep_clean) != 8:
                raise serializers.ValidationError(
                    "CEP deve conter exatamente 8 dígitos."
                )
            # Formata CEP
            return f"{cep_clean[:5]}-{cep_clean[5:]}"
        return value
    
    def validate_telefone(self, value):
        """
        Valida formato do telefone.
        """
        if value:
            # Remove caracteres não numéricos
            phone_clean = re.sub(r'\D', '', value)
            if len(phone_clean) not in [10, 11]:
                raise serializers.ValidationError(
                    "Telefone deve conter 10 ou 11 dígitos."
                )
            # Formata telefone
            if len(phone_clean) == 11:
                return f"({phone_clean[:2]}) {phone_clean[2:7]}-{phone_clean[7:]}"
            else:
                return f"({phone_clean[:2]}) {phone_clean[2:6]}-{phone_clean[6:]}"
        return value
    
    def validate_genero(self, value):
        """
        Valida opções de gênero.
        """
        valid_choices = ['M', 'F', 'O']
        if value and value not in valid_choices:
            raise serializers.ValidationError(
                f"Gênero deve ser uma das opções: {', '.join(valid_choices)}"
            )
        return value

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer básico para usuário com validações essenciais.
    """
    
    class Meta:
        model = CustomUser
        fields = ['id', 'nome_completo', 'email', 'cpf', 'data_nascimento']
        extra_kwargs = {
            'cpf': {'read_only': True},
            'id': {'read_only': True},
            'email': {'help_text': 'Email válido é obrigatório'},
            'nome_completo': {'help_text': 'Nome completo do usuário'},
        }
    
    def validate_email(self, value):
        """
        Valida unicidade do email (exceto para o próprio usuário).
        """
        if value:
            queryset = CustomUser.objects.filter(email=value)
            if self.instance:
                queryset = queryset.exclude(pk=self.instance.pk)
            if queryset.exists():
                raise serializers.ValidationError(
                    "Este email já está em uso por outro usuário."
                )
        return value
    
    def validate_nome_completo(self, value):
        """
        Valida nome completo.
        """
        if value:
            if len(value.strip()) < 3:
                raise serializers.ValidationError(
                    "Nome completo deve ter pelo menos 3 caracteres."
                )
            # Verifica se contém pelo menos nome e sobrenome
            parts = value.strip().split()
            if len(parts) < 2:
                raise serializers.ValidationError(
                    "Informe nome e sobrenome."
                )
        return value.strip().title() if value else value
        
class RegisterUserSerializer(ModelSerializer):
    """
    Serializer para registro de novos usuários com validações completas.
    """
    password_confirm = serializers.CharField(
        write_only=True,
        help_text="Confirmação da senha"
    )
    
    class Meta:
        model = CustomUser
        fields = [
            'nome_completo', 'email', 'cpf', 'data_nascimento', 
            'password', 'password_confirm'
        ]
        extra_kwargs = {
            'password': {
                'write_only': True,
                'help_text': 'Senha deve ter pelo menos 8 caracteres'
            },
            'cpf': {'help_text': 'CPF com 11 dígitos'},
            'email': {'help_text': 'Email válido e único'},
            'nome_completo': {'help_text': 'Nome completo do usuário'},
            'data_nascimento': {'help_text': 'Usuário deve ter pelo menos 18 anos'},
        }
    
    def validate_cpf(self, value):
        """
        Valida CPF: deve ter 11 dígitos, não pode ser sequência repetida e deve ser único.
        """
        if not value:
            raise serializers.ValidationError("CPF é obrigatório.")
        
        # Remove caracteres não numéricos
        cpf_clean = re.sub(r'\D', '', value)
        
        # Verifica se tem 11 dígitos
        if len(cpf_clean) != 11:
            raise serializers.ValidationError(
                "CPF deve conter exatamente 11 dígitos."
            )
        
        # Verifica se não é sequência de números iguais
        if cpf_clean == cpf_clean[0] * 11:
            raise serializers.ValidationError(
                "CPF não pode ser uma sequência de números iguais."
            )
        
        # Verifica unicidade
        if CustomUser.objects.filter(cpf=cpf_clean).exists():
            raise serializers.ValidationError(
                "Este CPF já está cadastrado."
            )
        
        return cpf_clean
    
    def validate_email(self, value):
        """
        Valida email: deve ser único.
        """
        if not value:
            raise serializers.ValidationError("Email é obrigatório.")
        
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Este email já está cadastrado."
            )
        
        return value.lower()
    
    def validate_nome_completo(self, value):
        """
        Valida nome completo.
        """
        if not value:
            raise serializers.ValidationError("Nome completo é obrigatório.")
        
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError(
                "Nome completo deve ter pelo menos 3 caracteres."
            )
        
        # Verifica se contém pelo menos nome e sobrenome
        parts = value.split()
        if len(parts) < 2:
            raise serializers.ValidationError(
                "Informe nome e sobrenome."
            )
        
        return value.title()
    
    def validate_data_nascimento(self, value):
        """
        Valida data de nascimento: usuário deve ter pelo menos 18 anos.
        """
        if not value:
            raise serializers.ValidationError("Data de nascimento é obrigatória.")
        
        today = date.today()
        
        # Verifica se não é data futura
        if value > today:
            raise serializers.ValidationError(
                "Data de nascimento não pode ser no futuro."
            )
        
        # Calcula idade
        age = today.year - value.year - (
            (today.month, today.day) < (value.month, value.day)
        )
        
        if age < 18:
            raise serializers.ValidationError(
                "Usuário deve ter pelo menos 18 anos."
            )
        
        # Verifica idade máxima razoável
        if age > 120:
            raise serializers.ValidationError(
                "Data de nascimento inválida."
            )
        
        return value
    
    def validate_password(self, value):
        """
        Valida senha usando validadores do Django.
        """
        if not value:
            raise serializers.ValidationError("Senha é obrigatória.")
        
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        
        return value
    
    def validate(self, attrs):
        """
        Validações gerais do formulário.
        """
        # Verifica se as senhas coincidem
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')
        
        if password != password_confirm:
            raise serializers.ValidationError({
                'password_confirm': 'As senhas não coincidem.'
            })
        
        return attrs
    
    def create(self, validated_data):
        """
        Cria usuário e perfil associado.
        """
        try:
            # Remove password_confirm dos dados validados
            validated_data.pop('password_confirm', None)
            
            # Cria o usuário (o manager já cria o perfil automaticamente)
            user = CustomUser.objects.create_user(**validated_data)
            
            logger.info(f"Usuário criado com sucesso: {user.email}")
            return user
            
        except Exception as e:
            logger.error(f"Erro ao criar usuário: {str(e)}")
            raise serializers.ValidationError(
                "Erro interno. Tente novamente mais tarde."
            )
    

class UserDetailSerializer(serializers.ModelSerializer):
    """
    Serializer para retornar dados completos do usuário incluindo perfil.
    """
    perfil = UserPerfilSerializer(read_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'nome_completo', 'email', 'cpf', 'data_nascimento', 'perfil']
        read_only_fields = ['id', 'cpf']


class LoginUserSerializer(serializers.Serializer):
    """
    Serializer para login de usuários com validações robustas.
    """
    cpf = serializers.CharField(
        required=True,
        help_text="CPF do usuário (apenas números)"
    )
    password = serializers.CharField(
        required=True, 
        write_only=True,
        help_text="Senha do usuário"
    )

    def validate_cpf(self, value):
        """
        Valida e limpa o CPF.
        """
        if not value:
            raise serializers.ValidationError("CPF é obrigatório.")
        
        # Remove caracteres não numéricos
        cpf_clean = re.sub(r'\D', '', value)
        
        if len(cpf_clean) != 11:
            raise serializers.ValidationError(
                "CPF deve conter 11 dígitos."
            )
        
        return cpf_clean
    
    def validate_password(self, value):
        """
        Valida senha.
        """
        if not value:
            raise serializers.ValidationError("Senha é obrigatória.")
        
        if len(value) < 8:
            raise serializers.ValidationError(
                "Senha deve ter pelo menos 8 caracteres."
            )
        
        return value

    def validate(self, attrs):
        """
        Valida credenciais do usuário.
        """
        cpf = attrs.get('cpf')
        password = attrs.get('password')

        if not cpf or not password:
            raise serializers.ValidationError(
                "CPF e senha são obrigatórios."
            )
        
        try:
            # Tenta autenticar o usuário
            user = authenticate(cpf=cpf, password=password)
            
            if not user:
                logger.warning(f"Tentativa de login falhada para CPF: {cpf[:3]}***")
                raise serializers.ValidationError(
                    "CPF ou senha incorretos."
                )
            
            if not user.is_active:
                logger.warning(f"Tentativa de login com conta inativa: {user.email}")
                raise serializers.ValidationError(
                    "Conta de usuário desativada. Entre em contato com o suporte."
                )
            
            attrs['user'] = user
            logger.info(f"Login realizado com sucesso: {user.email}")
            return attrs
            
        except serializers.ValidationError:
            raise
        except Exception as e:
            logger.error(f"Erro durante autenticação: {str(e)}")
            raise serializers.ValidationError(
                "Erro interno. Tente novamente mais tarde."
            )