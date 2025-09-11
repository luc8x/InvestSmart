from rest_framework import serializers
from .models import Acao, PortfolioUsuario

class AcaoSerializer(serializers.ModelSerializer):
    """Serializer para o modelo Acao"""
    
    class Meta:
        model = Acao
        fields = [
            'id', 'ticker', 'nome', 'preco_atual', 'variacao_percentual',
            'volume', 'market_cap', 'setor', 'ultima_atualizacao', 'criado_em'
        ]
        read_only_fields = ['id', 'ultima_atualizacao', 'criado_em']

class AcaoTopSerializer(serializers.ModelSerializer):
    """Serializer simplificado para o top 10 ações"""
    
    class Meta:
        model = Acao
        fields = [
            'ticker', 'nome', 'preco_atual', 'variacao_percentual', 'market_cap'
        ]

class PortfolioUsuarioSerializer(serializers.ModelSerializer):
    """Serializer para o modelo PortfolioUsuario"""
    acao = AcaoSerializer(read_only=True)
    acao_id = serializers.IntegerField(write_only=True)
    valor_total_investido = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    valor_atual = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    lucro_prejuizo = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    
    class Meta:
        model = PortfolioUsuario
        fields = [
            'id', 'acao', 'acao_id', 'quantidade', 'preco_compra', 'data_compra',
            'valor_total_investido', 'valor_atual', 'lucro_prejuizo'
        ]
        read_only_fields = ['id', 'data_compra']
    
    def create(self, validated_data):
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)

class PortfolioResumoSerializer(serializers.Serializer):
    """Serializer para resumo do portfólio"""
    total_investido = serializers.DecimalField(max_digits=15, decimal_places=2)
    valor_atual = serializers.DecimalField(max_digits=15, decimal_places=2)
    lucro_prejuizo_total = serializers.DecimalField(max_digits=15, decimal_places=2)
    percentual_retorno = serializers.DecimalField(max_digits=5, decimal_places=2)
    quantidade_acoes = serializers.IntegerField()