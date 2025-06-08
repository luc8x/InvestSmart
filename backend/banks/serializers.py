from rest_framework import serializers
from .models import Bank

class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = ['id', 'nome', 'valor', 'tipo']

    def validate_name(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("O nome do banco deve ter pelo menos 3 caracteres.")
        return value

    def validate_balance(self, value):
        if value < 0:
            raise serializers.ValidationError("O valor não pode ser negativo.")
        return value

    def validate_type(self, value):
        valid_types = ['corrente', 'poupanca', 'outro']
        if value not in valid_types:
            raise serializers.ValidationError("Tipo de conta inválido.")
        return value
