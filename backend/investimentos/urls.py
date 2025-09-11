from django.urls import path
from . import views

app_name = 'investimentos'

urlpatterns = [
    # Rotas públicas para ações
    path('top-acoes-brasil/', views.top_acoes_brasil, name='top_acoes_brasil'),
    path('acoes-salvas/', views.acoes_salvas, name='acoes_salvas'),
    path('acao/<str:ticker>/', views.detalhes_acao, name='detalhes_acao'),
    
    # Rotas do portfólio (requer autenticação)
    path('portfolio/', views.PortfolioListCreateView.as_view(), name='portfolio_list_create'),
    path('portfolio/<int:pk>/', views.PortfolioDetailView.as_view(), name='portfolio_detail'),
    path('portfolio/resumo/', views.portfolio_resumo, name='portfolio_resumo'),
]