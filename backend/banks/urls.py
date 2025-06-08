from django.urls import path
from .views import *

urlpatterns = [
    path('adicionar/', BankCreateView.as_view(), name='adicionar_bank'),
]