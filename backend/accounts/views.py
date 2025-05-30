from backend import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Account
from datetime import datetime, date
from django.db import transaction

class ApiLogin(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            response = Response({'message': 'Login realizado com sucesso'})
            response.set_cookie(
                key='access_token',
                value=str(refresh.access_token),
                httponly=True,
                samesite='Lax',
                secure=not settings.DEBUG
            )
            return response
        return Response({'error': 'Credenciais inválidas'}, status=401)
    
class ApiRegister(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        nome_completo = request.data.get('nome_completo')
        nascimento = request.data.get('nascimento')

        try:
            nascimento = datetime.fromisoformat(nascimento.replace('Z', '+00:00')).date()
            hoje = date.today()
            idade = hoje.year - nascimento.year - ((hoje.month, hoje.day) < (nascimento.month, nascimento.day))
        except (TypeError, ValueError):
            return Response({'error': 'Data de nascimento inválida'}, status=400)

        if not all([username, email, password, nome_completo, idade]):
            return Response({'error': 'Todos os campos obrigatórios devem ser preenchidos'}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Usuário já existe'}, status=400)
        try:
            with transaction.atomic():
                user = User.objects.create_user(username=username, email=email, password=password)

                Account.objects.create(
                    user=user,
                    nome_completo=nome_completo,
                    idade=idade,
                    data_nascimento=nascimento,
                )

                refresh = RefreshToken.for_user(user)
                response = Response({'message': 'Usuário registrado com sucesso'})
                response.set_cookie(
                    key='access_token',
                    value=str(refresh.access_token),
                    httponly=True,
                    samesite='Lax',
                    secure=not settings.DEBUG
                )
        except Exception as e:
            return Response({'error': f'Erro ao registrar usuário {e}'}, status=500)

        return response
    
class MeAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({"username": request.user.username})