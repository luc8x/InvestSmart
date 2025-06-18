from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework_simplejwt.tokens import AccessToken
from .serializers import UserSerializer, RegisterUserSerializer, LoginUserSerializer, UserSerializer
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
            print(access_token)

            return Response({
                'access_token': str(access_token),
                'user': {
                    'id': user.id,
                    'cpf': user.cpf,
                    'nome_completo': user.nome_completo,
                    'email': user.email,
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
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UploadPhotoView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        print(request.FILES.get('foto'))
        perfil = request.user.perfil
        foto = request.FILES.get('foto')

        if not foto:
            return Response({'detail': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        perfil.foto = foto
        perfil.save()

        foto_url = request.build_absolute_uri(perfil.foto.url)
        return Response({'foto_url': foto_url}, status=status.HTTP_200_OK)