from django.db import models
from django.contrib.auth.models import User

class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='account')
    nome_completo = models.CharField("Nome Completo", max_length=255, null=False)
    idade = models.PositiveIntegerField("Idade", null=False)
    bio = models.TextField("Biografia", null=False)
    data_nascimento = models.DateField(null=False)
    criado_at = models.DateTimeField("Data de Cadastro", auto_now_add=True)
    atualizado_at = models.DateTimeField("Data de Atualização", null=True, blank=True)
    ativo = models.BooleanField("Ativo", default=True)

    def __str__(self):
        return self.nome_completo