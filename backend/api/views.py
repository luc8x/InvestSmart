from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        data = response.data

        access_token = data.get("access")
        refresh_token = data.get("refresh")

        if access_token:
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                path='/',
                max_age=3600  # 1 hora
            )

        if refresh_token:
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                path='/',
                max_age=7 * 24 * 3600  # 7 dias
            )

        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.user

        response.set_cookie(
            key='username',
            value=user.username,
            httponly=False,
            secure=not settings.DEBUG,
            samesite='Lax',
            path='/',
            max_age=7 * 24 * 3600  # 7 dias
        )

        return response
    
class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({'detail': 'Token de refresh não encontrado.'}, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)

            response = Response({'access': new_access})
            response.set_cookie(
                key='access_token',
                value=new_access,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                path='/',
                max_age=3600  # 1 hora
            )
            return response

        except TokenError:
            return Response({'detail': 'Token de refresh inválido ou expirado.'}, status=401)
    
@api_view(['POST'])
def logout_view(request):
    response = Response({'message': 'Logout realizado com sucesso.'}, status=status.HTTP_200_OK)
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response
