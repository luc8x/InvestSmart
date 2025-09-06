from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import Http404
from django.db import IntegrityError
import logging

logger = logging.getLogger(__name__)


class APIException(Exception):
    """
    Exceção base para a API.
    """
    default_message = "Erro interno do servidor."
    default_code = "internal_error"
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    
    def __init__(self, message=None, code=None, status_code=None):
        self.message = message or self.default_message
        self.code = code or self.default_code
        if status_code:
            self.status_code = status_code
        super().__init__(self.message)


class ValidationException(APIException):
    """
    Exceção para erros de validação.
    """
    default_message = "Dados inválidos fornecidos."
    default_code = "validation_error"
    status_code = status.HTTP_400_BAD_REQUEST


class AuthenticationException(APIException):
    """
    Exceção para erros de autenticação.
    """
    default_message = "Credenciais inválidas."
    default_code = "authentication_error"
    status_code = status.HTTP_401_UNAUTHORIZED


class PermissionException(APIException):
    """
    Exceção para erros de permissão.
    """
    default_message = "Você não tem permissão para realizar esta ação."
    default_code = "permission_error"
    status_code = status.HTTP_403_FORBIDDEN


class NotFoundException(APIException):
    """
    Exceção para recursos não encontrados.
    """
    default_message = "Recurso não encontrado."
    default_code = "not_found"
    status_code = status.HTTP_404_NOT_FOUND


def custom_exception_handler(exc, context):
    """
    Handler customizado para exceções da API.
    """
    # Chama o handler padrão primeiro
    response = exception_handler(exc, context)
    
    # Se o handler padrão não conseguiu tratar, tratamos aqui
    if response is None:
        if isinstance(exc, APIException):
            response = Response(
                {
                    'error': {
                        'code': exc.code,
                        'message': exc.message,
                        'details': None
                    },
                    'success': False
                },
                status=exc.status_code
            )
        elif isinstance(exc, DjangoValidationError):
            response = Response(
                {
                    'error': {
                        'code': 'validation_error',
                        'message': 'Dados inválidos.',
                        'details': exc.message_dict if hasattr(exc, 'message_dict') else list(exc.messages)
                    },
                    'success': False
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        elif isinstance(exc, Http404):
            response = Response(
                {
                    'error': {
                        'code': 'not_found',
                        'message': 'Recurso não encontrado.',
                        'details': None
                    },
                    'success': False
                },
                status=status.HTTP_404_NOT_FOUND
            )
        elif isinstance(exc, IntegrityError):
            response = Response(
                {
                    'error': {
                        'code': 'integrity_error',
                        'message': 'Violação de integridade dos dados.',
                        'details': None
                    },
                    'success': False
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        else:
            # Log do erro não tratado
            logger.error(f"Erro não tratado: {type(exc).__name__}: {str(exc)}", exc_info=True)
            response = Response(
                {
                    'error': {
                        'code': 'internal_error',
                        'message': 'Erro interno do servidor.',
                        'details': None
                    },
                    'success': False
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    # Padroniza a resposta de erro
    if response is not None:
        custom_response_data = {
            'success': False,
            'error': {
                'code': 'api_error',
                'message': 'Ocorreu um erro.',
                'details': response.data
            }
        }
        
        # Se já temos uma estrutura customizada, mantemos
        if isinstance(response.data, dict) and 'error' in response.data:
            custom_response_data = response.data
        else:
            # Trata diferentes tipos de erro do DRF
            if isinstance(response.data, dict):
                if 'detail' in response.data:
                    custom_response_data['error']['message'] = response.data['detail']
                    custom_response_data['error']['code'] = 'detail_error'
                else:
                    custom_response_data['error']['details'] = response.data
                    custom_response_data['error']['message'] = 'Erro de validação.'
                    custom_response_data['error']['code'] = 'validation_error'
            elif isinstance(response.data, list):
                custom_response_data['error']['details'] = response.data
                custom_response_data['error']['message'] = 'Erro de validação.'
                custom_response_data['error']['code'] = 'validation_error'
        
        response.data = custom_response_data
    
    return response