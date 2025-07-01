from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import UsuarioBanco, Banco
from .serializers import UsuarioBancoSerializer, BancoSerializer

class BancoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bancos = UsuarioBanco.objects.filter(user=request.user)
        serializer = UsuarioBancoSerializer(bancos, many=True)
        print(serializer.data)
        return Response(serializer.data)

    def post(self, request):
        serializer = UsuarioBancoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class BancoCadastrarView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BancoSerializer(data=request.data)
        if serializer.is_valid():
            banco = serializer.save()
            return Response(BancoSerializer(banco).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BancoDetalhesView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            banco_usuario = UsuarioBanco.objects.get(pk=pk, user=user)
            return banco_usuario
        except UsuarioBanco.DoesNotExist:
            return None

    def put(self, request, pk):
        instance = self.get_object(pk, request.user)
        if not instance:
            return Response({'detail': 'Não encontrado ou não autorizado.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UsuarioBancoSerializer(instance, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        instance = self.get_object(pk, request.user)
        if not instance:
            return Response({'detail': 'Não encontrado ou não autorizado.'}, status=status.HTTP_404_NOT_FOUND)
        
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
