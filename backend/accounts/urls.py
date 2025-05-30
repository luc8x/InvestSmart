from django.urls import path
from .views import *

urlpatterns = [
    path('login/', ApiLogin.as_view(), name='token_obtain_pair'),
    path('cadastre-se/', ApiRegister.as_view(), name='cadastre_se'),
]