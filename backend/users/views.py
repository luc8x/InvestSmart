from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging

from .models import CustomUser, UserPerfil, PasswordResetToken
from .serializers import (
    UserSerializer, 
    RegisterUserSerializer, 
    LoginUserSerializer, 
    UserPerfilSerializer,
    UserDetailSerializer
)
from .exceptions import (
    ValidationException,
    AuthenticationException,
    NotFoundException
)

logger = logging.getLogger(__name__)


class UserPagination(PageNumberPagination):
    """
    Paginação customizada para usuários.
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento completo de usuários.
    
    Fornece endpoints RESTful para operações CRUD de usuários,
    além de funcionalidades de autenticação e gerenciamento de perfil.
    
    Endpoints:
    - GET /users/ - Lista usuários (admin only)
    - POST /users/ - Criar usuário (registro)
    - GET /users/{id}/ - Detalhes do usuário
    - PUT/PATCH /users/{id}/ - Atualizar usuário
    - DELETE /users/{id}/ - Deletar usuário
    - POST /users/login/ - Login
    - POST /users/logout/ - Logout
    - GET /users/me/ - Perfil do usuário logado
    - PUT /users/me/ - Atualizar perfil do usuário logado
    
    Filtros disponíveis:
    - ?search=termo - Busca por nome, email ou CPF
    - ?ordering=campo - Ordena por campo (nome_completo, email, data_nascimento)
    - ?page=1&page_size=20 - Paginação
    """
    queryset = CustomUser.objects.select_related('perfil').all()
    serializer_class = UserSerializer
    pagination_class = UserPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Campos para busca
    search_fields = ['nome_completo', 'email', 'cpf']
    
    # Campos para ordenação
    ordering_fields = ['nome_completo', 'email', 'data_nascimento', 'date_joined']
    ordering = ['-date_joined']  # Ordenação padrão
    
    # Campos para filtro
    filterset_fields = ['perfil__genero', 'perfil__estado', 'perfil__cidade']
    
    def get_permissions(self):
        """
        Define permissões baseadas na action.
        """
        if self.action in ['create', 'login', 'esqueceu_a_senha', 'reset_password']:
            permission_classes = [AllowAny]
        elif self.action in ['me', 'logout', 'update_profile']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]  # Admin only para list, retrieve, etc
        
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        """
        Retorna o serializer apropriado baseado na action.
        """
        if self.action == 'create':
            return RegisterUserSerializer
        elif self.action == 'login':
            return LoginUserSerializer
        elif self.action in ['retrieve', 'me']:
            return UserDetailSerializer
        return UserSerializer
    
    @swagger_auto_schema(
        operation_description="Registra um novo usuário no sistema",
        operation_summary="Registro de usuário",
        request_body=RegisterUserSerializer,
        responses={
            201: openapi.Response(
                description="Usuário criado com sucesso",
                examples={
                    "application/json": {
                        "success": True,
                        "data": {
                            "user": {
                                "id": 1,
                                "nome_completo": "João Silva",
                                "email": "joao@email.com",
                                "cpf": "12345678901",
                                "data_nascimento": "1990-01-01"
                            }
                        },
                        "message": "Usuário criado com sucesso!"
                    }
                }
            ),
            400: openapi.Response(
                description="Dados inválidos",
                examples={
                    "application/json": {
                        "success": False,
                        "error": {
                            "code": "invalid_registration_data",
                            "message": "Dados de registro inválidos.",
                            "details": None
                        }
                    }
                }
            )
        },
        tags=['Usuários']
    )
    def create(self, request, *args, **kwargs):
        """
        Endpoint para registro de usuário.
        POST /users/
        """
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                with transaction.atomic():
                    user = serializer.save()
                    
                logger.info(f"Usuário criado com sucesso: {user.cpf}")
                user_serializer = UserDetailSerializer(user)
                
                return Response({
                    'success': True,
                    'data': {
                        'user': user_serializer.data
                    },
                    'message': 'Usuário criado com sucesso!'
                }, status=status.HTTP_201_CREATED)
            else:
                logger.warning(f"Tentativa de registro com dados inválidos: {request.data.get('cpf', 'N/A')}")
                raise ValidationException(
                    message="Dados de registro inválidos.",
                    code="invalid_registration_data"
                )
        except ValidationException:
            raise
        except Exception as e:
            logger.error(f"Erro inesperado no registro: {str(e)}", exc_info=True)
            raise ValidationException(
                message="Erro interno durante o registro.",
                code="registration_internal_error"
            )
    
    @swagger_auto_schema(
        method='post',
        operation_description="Realiza login do usuário",
        operation_summary="Login de usuário",
        request_body=LoginUserSerializer,
        responses={
            200: openapi.Response(
                description="Login realizado com sucesso",
                examples={
                    "application/json": {
                        "success": True,
                        "data": {
                            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                            "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                            "user": {
                                "id": 1,
                                "nome_completo": "João Silva",
                                "email": "joao@email.com",
                                "cpf": "12345678901"
                            }
                        },
                        "message": "Login realizado com sucesso."
                    }
                }
            ),
            400: openapi.Response(
                description="Dados inválidos",
                examples={
                    "application/json": {
                        "success": False,
                        "error": {
                            "code": "invalid_login_data",
                            "message": "Dados de login inválidos.",
                            "details": None
                        }
                    }
                }
            )
        },
        tags=['Autenticação']
    )
    @method_decorator(csrf_exempt)
    @action(detail=False, methods=['post'])
    def login(self, request):
        """
        Login do usuário.
        POST /users/login/
        """
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data['user']
                refresh = RefreshToken.for_user(user)
                
                logger.info(f"Login realizado com sucesso para usuário: {user.cpf}")
                
                return Response({
                    'success': True,
                    'data': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'user': UserDetailSerializer(user).data
                    },
                    'message': 'Login realizado com sucesso.'
                }, status=status.HTTP_200_OK)
            else:
                logger.warning(f"Tentativa de login com dados inválidos: {request.data.get('cpf', 'N/A')}")
                raise ValidationException(
                    message="Dados de login inválidos.",
                    code="invalid_login_data"
                )
        except ValidationException:
            raise
        except Exception as e:
            logger.error(f"Erro inesperado no login: {str(e)}", exc_info=True)
            raise AuthenticationException(
                message="Erro interno durante o login.",
                code="login_internal_error"
            )
    
    @swagger_auto_schema(
        method='post',
        operation_description="Solicita reset de senha por email",
        operation_summary="Esqueceu a senha",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email do usuário')
            },
            required=['email']
        ),
        responses={
            200: openapi.Response(
                description="Email de reset enviado com sucesso",
                examples={
                    "application/json": {
                        "success": True,
                        "message": "Se o email estiver cadastrado, você receberá as instruções para redefinir sua senha."
                    }
                }
            )
        },
        tags=['Autenticação']
    )
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def esqueceu_a_senha(self, request):
        """
        Endpoint para solicitar reset de senha.
        Envia email com token para redefinir senha.
        """
        try:
            email = request.data.get('email')
            
            if not email:
                raise ValidationException(
                    "Email é obrigatório.",
                    "missing_email"
                )
            
            try:
                user = CustomUser.objects.get(email=email)
                
                # Invalidar tokens anteriores
                PasswordResetToken.objects.filter(
                    user=user, 
                    used=False
                ).update(used=True)
                
                # Criar novo token
                reset_token = PasswordResetToken.objects.create(user=user)
                
                # Enviar email
                reset_url = f"http://localhost:3000/redefinir-senha?token={reset_token.token}"
                
                subject = 'Redefinir senha - InvestSmart'
                message = f"""
                Olá {user.nome_completo},
                
                Você solicitou a redefinição de sua senha no InvestSmart.
                
                Clique no link abaixo para redefinir sua senha:
                {reset_url}
                
                Este link é válido por 1 hora.
                
                Se você não solicitou esta redefinição, ignore este email.
                
                Atenciosamente,
                Equipe InvestSmart
                """
                
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
                
                logger.info(f"Password reset email sent to {email}")
                
            except CustomUser.DoesNotExist:
                # Por segurança, não revelamos se o email existe ou não
                logger.warning(f"Password reset attempted for non-existent email: {email}")
            
            return Response({
                'success': True,
                'message': 'Se o email estiver cadastrado, você receberá as instruções para redefinir sua senha.'
            })
            
        except ValidationException as e:
            logger.error(f"Validation error in forgot password: {e}")
            return Response(
                {
                    'success': False,
                    'error': {
                        'code': e.error_code,
                        'message': str(e),
                        'details': e.details
                    }
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error in forgot password: {e}")
            return Response(
                {
                    'success': False,
                    'error': {
                        'code': 'forgot_password_error',
                        'message': 'Erro interno do servidor.',
                        'details': None
                    }
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @swagger_auto_schema(
        method='post',
        operation_description="Redefine senha usando token",
        operation_summary="Redefinir senha",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING, description='Token de reset'),
                'new_password': openapi.Schema(type=openapi.TYPE_STRING, description='Nova senha')
            },
            required=['token', 'new_password']
        ),
        responses={
            200: openapi.Response(
                description="Senha redefinida com sucesso",
                examples={
                    "application/json": {
                        "success": True,
                        "message": "Senha redefinida com sucesso."
                    }
                }
            ),
            400: openapi.Response(
                description="Token inválido ou expirado",
                examples={
                    "application/json": {
                        "success": False,
                        "error": {
                            "code": "invalid_token",
                            "message": "Token inválido ou expirado."
                        }
                    }
                }
            )
        },
        tags=['Autenticação']
    )
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def reset_password(self, request):
        """
        Endpoint para redefinir senha usando token.
        """
        try:
            token = request.data.get('token')
            new_password = request.data.get('new_password')
            
            if not token or not new_password:
                raise ValidationException(
                    "Token e nova senha são obrigatórios.",
                    "missing_fields"
                )
            
            try:
                reset_token = PasswordResetToken.objects.get(token=token)
                
                if not reset_token.is_valid():
                    raise ValidationException(
                        "Token inválido ou expirado.",
                        "invalid_token"
                    )
                
                # Redefinir senha
                user = reset_token.user
                user.set_password(new_password)
                user.save()
                
                # Marcar token como usado
                reset_token.mark_as_used()
                
                # Invalidar outros tokens do usuário
                PasswordResetToken.objects.filter(
                    user=user,
                    used=False
                ).update(used=True)
                
                logger.info(f"Password reset successful for user {user.email}")
                
                return Response({
                    'success': True,
                    'message': 'Senha redefinida com sucesso.'
                })
                
            except PasswordResetToken.DoesNotExist:
                raise ValidationException(
                    "Token inválido.",
                    "invalid_token"
                )
            
        except ValidationException as e:
            logger.error(f"Validation error in reset password: {e}")
            return Response(
                {
                    'success': False,
                    'error': {
                        'code': e.error_code,
                        'message': str(e),
                        'details': e.details
                    }
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error in reset password: {e}")
            return Response(
                {
                    'success': False,
                    'error': {
                        'code': 'reset_password_error',
                        'message': 'Erro interno do servidor.',
                        'details': None
                    }
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def logout(self, request):
        """
        Endpoint para logout do usuário.
        Invalida o refresh token fornecido.
        """
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                raise ValidationException(
                    message="Token de refresh é obrigatório.",
                    code="missing_refresh_token"
                )
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            logger.info(f"Logout realizado com sucesso para usuário: {request.user.cpf if request.user.is_authenticated else 'N/A'}")
            
            return Response({
                'success': True,
                'message': 'Logout realizado com sucesso!'
            }, status=status.HTTP_200_OK)
            
        except ValidationException:
            raise
        except Exception as e:
            logger.warning(f"Tentativa de logout com token inválido: {str(e)}")
            raise ValidationException(
                message="Token inválido ou expirado.",
                code="invalid_refresh_token"
            )
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """
        Perfil do usuário logado.
        GET /users/me/ - Obter perfil
        PUT/PATCH /users/me/ - Atualizar perfil
        """
        try:
            if request.method == 'GET':
                serializer = UserDetailSerializer(request.user)
                return Response({
                    'success': True,
                    'data': {
                        'user': serializer.data
                    }
                }, status=status.HTTP_200_OK)
            
            elif request.method in ['PUT', 'PATCH']:
                # Atualizar dados do usuário
                user_serializer = UserSerializer(
                    request.user, 
                    data=request.data, 
                    partial=request.method == 'PATCH'
                )
                
                # Atualizar dados do perfil
                perfil_serializer = UserPerfilSerializer(
                    request.user.perfil, 
                    data=request.data, 
                    partial=request.method == 'PATCH'
                )
                
                if user_serializer.is_valid() and perfil_serializer.is_valid():
                    with transaction.atomic():
                        user_serializer.save()
                        perfil_serializer.save()
                    
                    logger.info(f"Perfil atualizado com sucesso para usuário: {request.user.cpf}")
                    
                    # Retorna dados atualizados
                    response_serializer = UserDetailSerializer(request.user)
                    return Response({
                        'success': True,
                        'data': {
                            'user': response_serializer.data
                        },
                        'message': 'Perfil atualizado com sucesso!'
                    }, status=status.HTTP_200_OK)
                else:
                    logger.warning(f"Tentativa de atualização de perfil com dados inválidos: {request.user.cpf}")
                    raise ValidationException(
                        message="Dados de perfil inválidos.",
                        code="invalid_profile_data"
                    )
        except ValidationException:
            raise
        except Exception as e:
            logger.error(f"Erro inesperado na atualização do perfil: {str(e)}", exc_info=True)
            raise ValidationException(
                message="Erro interno durante a atualização do perfil.",
                code="profile_internal_error"
            )