from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.exceptions import ValidationError
from datetime import timezone
import re
from .managers import CustomUserManager

def validate_cpf(value):
    """Valida se o CPF está no formato correto"""
    cpf = re.sub(r'[^0-9]', '', value)
    if len(cpf) != 11 or cpf == cpf[0] * 11:
        raise ValidationError('CPF inválido.')

class CustomUser(AbstractBaseUser, PermissionsMixin):
    nome_completo = models.CharField(max_length=250, help_text="Nome completo do usuário")
    cpf = models.CharField(max_length=14, unique=True, validators=[validate_cpf], help_text="CPF no formato 000.000.000-00")
    email = models.EmailField(unique=True, help_text="Email único do usuário")
    data_nascimento = models.DateField(help_text="Data de nascimento")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'cpf'
    REQUIRED_FIELDS = ['email', 'data_nascimento', 'nome_completo']
    
    def clean(self):
        super().clean()
        if self.data_nascimento:
            from datetime import date
            today = date.today()
            age = today.year - self.data_nascimento.year - ((today.month, today.day) < (self.data_nascimento.month, self.data_nascimento.day))
            if age < 18:
                raise ValidationError({'data_nascimento': 'Usuário deve ter pelo menos 18 anos.'})
    
    def save(self, *args, **kwargs):
        self.full_clean()
        if self.cpf:
            self.cpf = re.sub(r'[^0-9]', '', self.cpf)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.nome_completo} ({self.cpf})"
    
    def calcular_idade(self):
        hoje = timezone.now().date()
        idade = hoje.year - self.data_nascimento.year
        if (hoje.month, hoje.day) < (self.data_nascimento.month, self.data_nascimento.day):
            idade -= 1
        return idade
    
class UserPerfil(models.Model):
    GENERO_CHOICE = {
        'M':"Masculino",
        'F':"Feminino",
    }
    
    user = models.OneToOneField(
        CustomUser, 
        on_delete=models.CASCADE, 
        related_name='perfil'
    )

    logradouro = models.CharField(max_length=255, null=True, blank=True)
    numero = models.CharField(max_length=10, null=True, blank=True)
    complemento = models.CharField(max_length=100, blank=True, null=True)
    bairro = models.CharField(max_length=100, null=True, blank=True)
    cidade = models.CharField(max_length=100, null=True, blank=True)
    estado = models.CharField(max_length=2, null=True, blank=True)  # Ex: SP, RJ, MG
    cep = models.CharField(max_length=8, null=True, blank=True)     # Formato: 00000000

    telefone = models.CharField(max_length=20, blank=True, null=True)
    genero = models.CharField(max_length=1, choices=GENERO_CHOICE, null=True, blank=True)
    foto = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'Perfil de {self.user.nome_completo}'
    