import logging
import time
import uuid
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from rest_framework.response import Response

logger = logging.getLogger(__name__)


class LogRequestMiddleware:
    """
    Middleware para logging de requisições.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log básico das headers (mantendo funcionalidade original)
        logger.debug('HEADERS: %s', dict(request.headers))
        response = self.get_response(request)
        return response


class APIResponseMiddleware(MiddlewareMixin):
    """
    Middleware para padronizar respostas da API e adicionar logging avançado.
    """
    
    def process_request(self, request):
        """
        Processa a requisição antes de chegar à view.
        """
        # Gera um ID único para a requisição
        request.request_id = str(uuid.uuid4())
        request.start_time = time.time()
        
        logger.info(
            f"[{request.request_id}] {request.method} {request.path} - "
            f"IP: {self.get_client_ip(request)} - "
            f"User-Agent: {request.META.get('HTTP_USER_AGENT', 'N/A')[:100]}"
        )
        
        return None
    
    def process_response(self, request, response):
        """
        Processa a resposta e adiciona informações de timing.
        """
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            
            # Log da resposta
            logger.info(
                f"[{getattr(request, 'request_id', 'N/A')}] "
                f"Response: {response.status_code} - "
                f"Duration: {duration:.3f}s"
            )
            
            # Adiciona headers de timing
            response['X-Response-Time'] = f"{duration:.3f}s"
            response['X-Request-ID'] = getattr(request, 'request_id', 'N/A')
        
        # Adiciona headers de segurança
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        
        return response
    
    def get_client_ip(self, request):
        """
        Obtém o IP real do cliente.
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
