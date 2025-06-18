from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, nome_completo, cpf, email, data_nascimento, password=None, **extra_fields):
        if not cpf:
            raise ValueError("Email é obrigatório.")
        
        if not email:
            raise ValueError("Email é obrigatório.")
        
        if not data_nascimento:
            raise ValueError("Data de Nascimento é obrigatório.")
        
        if not nome_completo:
            raise ValueError("Nome Completo é obrigatório.")
        
        from .models import UserPerfil
        
        email = self.normalize_email(email)
        cpf = cpf.replace('.', '').replace('-', '')
        
        user = self.model(nome_completo=nome_completo, cpf=cpf, email=email, data_nascimento=data_nascimento, **extra_fields)
        user.set_password(password)
        user.save()
        
        UserPerfil.objects.create(user=user)
        
        return user
    
    def create_superuser(self, nome_completo, cpf, email, data_nascimento, password=None, **extra_fields):
        extra_fields.setdefault("is_staff",True)
        extra_fields.setdefault("is_superuser",True)
        
        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser precisa ter is_staff=True.")
        
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser precisa ter is_superuser=True.")
        
        from .models import UserPerfil
        
        user = self.model(nome_completo=nome_completo, cpf=cpf, email=email, data_nascimento=data_nascimento, **extra_fields)
        user.set_password(password)
        user.save()
        
        UserPerfil.objects.create(user=user)
        
        return user
        