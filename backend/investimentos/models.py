from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Acao(models.Model):
    """Modelo para armazenar informações das ações"""
    ticker = models.CharField(max_length=10, unique=True, help_text="Código da ação (ex: PETR4.SA)")
    nome = models.CharField(max_length=200, help_text="Nome da empresa")
    preco_atual = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    variacao_percentual = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    volume = models.BigIntegerField(null=True, blank=True)
    market_cap = models.BigIntegerField(null=True, blank=True, help_text="Valor de mercado")
    setor = models.CharField(max_length=100, null=True, blank=True)
    ultima_atualizacao = models.DateTimeField(auto_now=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Ação"
        verbose_name_plural = "Ações"
        ordering = ['-market_cap']
    
    def __str__(self):
        return f"{self.ticker} - {self.nome}"

class PortfolioUsuario(models.Model):
    """Modelo para o portfólio de investimentos do usuário"""
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='portfolio')
    acao = models.ForeignKey(Acao, on_delete=models.CASCADE)
    quantidade = models.IntegerField(help_text="Quantidade de ações")
    preco_compra = models.DecimalField(max_digits=10, decimal_places=2, help_text="Preço médio de compra")
    data_compra = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Portfólio do Usuário"
        verbose_name_plural = "Portfólios dos Usuários"
        unique_together = ['usuario', 'acao']
    
    def __str__(self):
        return f"{self.usuario.username} - {self.acao.ticker}"
    
    @property
    def valor_total_investido(self):
        return self.quantidade * self.preco_compra
    
    @property
    def valor_atual(self):
        if self.acao.preco_atual:
            return self.quantidade * self.acao.preco_atual
        return 0
    
    @property
    def lucro_prejuizo(self):
        return self.valor_atual - self.valor_total_investido
