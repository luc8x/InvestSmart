from django.urls import path
from .views import BancoView, BancoDetalhesView, BancoCadastrarView

urlpatterns = [
    path('', BancoView.as_view(), name='bancos-list-update'),
    path('cadastrar/', BancoCadastrarView.as_view(), name='banco-cadastrar'),
    path('<int:pk>/', BancoDetalhesView.as_view(), name='banco-detalhes'),
]
