import base64

from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import AccessToken
from .serializers import UserSerializer, RegisterUserSerializer, LoginUserSerializer, UserSerializer, UserPerfilSerializer
from .models import CustomUser
    
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
            
            return Response({
                'access_token': str(access_token),
                'user': {
                    'id': user.id,
                    'cpf': user.cpf,
                    'nome_completo': user.nome_completo,
                    'email': user.email,
                    'data_nascimento': user.data_nascimento,
                },
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
            
            print(user_serializer.data)

            return Response({
                'user': {
                    'id': user_serializer.data['id'],
                    'cpf': user_serializer.data['cpf'],
                    'nome_completo': user_serializer.data['nome_completo'],
                    'email': user_serializer.data['email'],
                    'data_nascimento': user_serializer.data['data_nascimento'],
                },
                'perfil': {
                    'logradouro':perfil_serializer.data['logradouro'],
                    'numero':perfil_serializer.data['numero'],
                    'complemento':perfil_serializer.data['complemento'],
                    'bairro':perfil_serializer.data['bairro'],
                    'cidade':perfil_serializer.data['cidade'],
                    'estado':perfil_serializer.data['estado'],
                    'cep':perfil_serializer.data['cep'],
                    'telefone':perfil_serializer.data['telefone'],
                    'genero':perfil_serializer.data['genero'],
                    'foto':perfil_serializer.data['foto'],
                },
            })

        return Response({
            'errors': user_serializer.errors or perfil_serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)