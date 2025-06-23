import base64

from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from rest_framework_simplejwt.tokens import AccessToken
from .serializers import UserSerializer, RegisterUserSerializer, LoginUserSerializer, UserSerializer, UserPerfilSerializer
from .models import CustomUser, UserPerfil
    
class UserRegistrationView(CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterUserSerializer
    
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginUserSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']

            access_token = AccessToken.for_user(user)

            print(user.perfil)
            
            return Response({
                'access_token': str(access_token),
                'user': {
                    'id': user.id,
                    'cpf': user.cpf,
                    'nome_completo': user.nome_completo,
                    'email': user.email,
                    'data_nascimento': user.data_nascimento,
                    'perfil': {
                        'logradouro':user.perfil.logradouro,
                        'numero':user.perfil.numero,
                        'complemento':user.perfil.complemento,
                        'bairro':user.perfil.bairro,
                        'cidade':user.perfil.cidade,
                        'estado':user.perfil.estado,
                        'cep':user.perfil.cep,
                        'telefone':user.perfil.telefone,
                        'genero':user.perfil.genero,
                        'foto':user.perfil.foto,
                    },
                }
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutView(APIView):
    def post(self, request):
        response.delete_cookie("access_token")
        
        response = Response({ "message": "Deslogado com sucesso!" }, status=status.HTTP_200_OK)
        
        return response

class UserPerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_serializer = UserSerializer(request.user)
        perfil_serializer = UserPerfilSerializer(request.user.perfil)
        return Response({
            'user': user_serializer.data,
            'perfil': perfil_serializer.data,
        })

    def put(self, request):
        user_serializer = UserSerializer(
            request.user, data=request.data, partial=True
        )
        perfil_serializer = UserPerfilSerializer(
            request.user.perfil, data=request.data, partial=True
        )

        if user_serializer.is_valid() and perfil_serializer.is_valid():
            user_serializer.save()
            perfil_serializer.save()

            return Response({
                'user': user_serializer.data,
                'perfil': perfil_serializer.data,
            })

        return Response({
            'user_errors': user_serializer.errors,
            'perfil_errors': perfil_serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)