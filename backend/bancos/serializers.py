from rest_framework import serializers
from .models import Banco, UsuarioBanco
from users.models import CustomUser

class BancoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banco
        fields = [
            'id',
            'cnpj',
            'nome',
            'tipo',
            'email',
            'recurso',
            'url_dados',
            'url_consulta',
        ]
        read_only_fields = ['id']

class UsuarioBancoSerializer(serializers.ModelSerializer):
    banco = BancoSerializer(read_only=True)
    banco_id = serializers.PrimaryKeyRelatedField(
        queryset=Banco.objects.all(),
        source='banco',
        write_only=True
    )

    class Meta:
        model = UsuarioBanco
        fields = ['id', 'banco', 'banco_id']
        read_only_fields = ['id']

    def validate(self, data):
        user = self.context['request'].user
        banco = data['banco']
        if UsuarioBanco.objects.filter(user=user, banco=banco).exists():
            raise serializers.ValidationError("Este banco já está vinculado ao usuário.")
        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
