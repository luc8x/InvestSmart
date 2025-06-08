from django.urls import path
from .views import *

urlpatterns = [
    path('cadastre-se/', ApiRegister.as_view(), name='register'),
]