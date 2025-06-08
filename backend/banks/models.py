from django.db import models
from accounts.models import Account

class Bank(models.Model):
    BANK_TYPES = [
        ('corrente', 'Conta Corrente'),
        ('poupanca', 'Poupança'),
        ('outro', 'Outro'),
    ]
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    nome = models.CharField(max_length=100)
    valor = models.DecimalField(max_digits=12, decimal_places=2)
    tipo = models.CharField(max_length=20, choices=BANK_TYPES)
    criado_at = models.DateTimeField(auto_now_add=True)