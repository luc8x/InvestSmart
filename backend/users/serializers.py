from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import CustomUser, UserPerfil
from django.contrib.auth import authenticate,login

class UserPerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPerfil
        fields = [
            'user', 'telefone', 'genero', 'logradouro', 'numero', 'complemento',
            'bairro', 'cidade', 'estado', 'cep', 'foto'
        ]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'nome_completo', 'email', 'cpf', 'data_nascimento']
        
class RegisterUserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('cpf', 'email', 'data_nascimento', 'nome_completo', 'password')
        extra_kwargs = {"password":{"write_only":True}}
        
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        UserPerfil.objects.create(user=user)
        return user
    

class LoginUserSerializer(serializers.Serializer):
    cpf = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(cpf=data.get('cpf'), password=data.get('password'))
        if not user or not user.is_active:
            raise serializers.ValidationError("Credenciais inválidas.")
        data['user'] = user
        print('data',data)
        return data