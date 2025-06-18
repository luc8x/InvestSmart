from rest_framework.serializers import ModelSerializer, Serializer
from rest_framework import serializers
from .models import CustomUser, UserPerfil
from django.contrib.auth import authenticate

class UserPerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPerfil
        fields = '__all__'
        read_only_fields = ['user']


class UserSerializer(serializers.ModelSerializer):
    perfil = UserPerfilSerializer()

    class Meta:
        model = CustomUser
        fields = ['id', 'nome_completo', 'email', 'cpf', 'data_nascimento', 'perfil']

    def update(self, instance, validated_data):
        perfil_data = validated_data.pop('perfil', {})
        perfil, created = UserPerfil.objects.get_or_create(user=instance)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        for attr, value in perfil_data.items():
            setattr(perfil, attr, value)
        perfil.save()

        return instance
        
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
        return user
    
class LoginUserSerializer(serializers.Serializer):
    cpf = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(cpf=data.get('cpf'), password=data.get('password'))

        if user and user.is_active:
            data['user'] = user
            return data

        raise serializers.ValidationError("Credenciais inválidas.")