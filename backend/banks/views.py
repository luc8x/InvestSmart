from rest_framework import generics, permissions
from .models import Bank
from .serializers import BankSerializer

class BankCreateView(generics.CreateAPIView):
    serializer_class = BankSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)