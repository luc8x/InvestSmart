from django.db import models
from users.models import CustomUser

class Banco(models.Model):
    TIPO_CHOICES = [
        ('conta_corrente', 'Conta Corrente'),
        ('conta_poupanca', 'Conta Poupança'),
        ('conta_investimentos', 'Conta de Investimentos'),
    ]
    cnpj = models.CharField(max_length=18, unique=True)
    nome = models.CharField(max_length=255)
    tipo = models.CharField(max_length=50, choices=TIPO_CHOICES)
    email = models.EmailField(blank=True, null=True)
    recurso = models.CharField(max_length=255)
    url_dados = models.URLField(blank=True, null=True)
    url_consulta = models.URLField(blank=True, null=True)

    class Meta:
        verbose_name = "Banco"
        verbose_name_plural = "Bancos"
        ordering = ['nome']

    def __str__(self):
        return f"{self.nome} ({self.cnpj})"
    
class UsuarioBanco(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="bancos")
    banco = models.ForeignKey(Banco, on_delete=models.CASCADE, related_name="usuarios")

    class Meta:
        unique_together = ('user', 'banco')
        verbose_name = "Banco do Usuário"
        verbose_name_plural = "Bancos do Usuário"

    def __str__(self):
        return f"{self.user.username} - {self.banco.nome}"