import yfinance as yf
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, F
from decimal import Decimal
import logging
import time
from django.core.cache import cache
from datetime import datetime, timedelta
import requests

from .models import Acao, PortfolioUsuario
from .serializers import (
    AcaoSerializer, AcaoTopSerializer, PortfolioUsuarioSerializer, 
    PortfolioResumoSerializer
)

logger = logging.getLogger(__name__)

# Configuração da API brapi.dev como fallback
BRAPI_TOKEN = 'gATve2q7V6QDcD74o1smZf'
BRAPI_BASE_URL = 'https://brapi.dev/api'

# Lista das principais ações brasileiras por market cap
TOP_BRAZILIAN_STOCKS = [
    'PETR4.SA',  # Petrobras
    'VALE3.SA',  # Vale
    'ITUB4.SA',  # Itaú Unibanco
    'BBDC4.SA',  # Bradesco
    'ABEV3.SA',  # Ambev
    'B3SA3.SA',  # B3
    'WEGE3.SA',  # WEG
    'RENT3.SA',  # Localiza
    'LREN3.SA',  # Lojas Renner
    'MGLU3.SA',  # Magazine Luiza
    'JBSS3.SA',  # JBS
    'SUZB3.SA',  # Suzano
    'RAIL3.SA',  # Rumo
    'CCRO3.SA',  # CCR
    'GGBR4.SA',  # Gerdau
]

# Mapeamento de tickers para brapi.dev (sem .SA)
TOP_BRAZILIAN_STOCKS_BRAPI = [
    'PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'ABEV3',
    'B3SA3', 'WEGE3', 'RENT3', 'LREN3', 'MGLU3',
    'JBSS3', 'SUZB3', 'RAIL3', 'CCRO3', 'GGBR4'
]

def fetch_stock_data_brapi(ticker_brapi):
    """
    Busca dados de uma ação usando a API brapi.dev como fallback
    """
    try:
        url = f"{BRAPI_BASE_URL}/quote/{ticker_brapi}"
        headers = {
            'Authorization': f'Bearer {BRAPI_TOKEN}'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        if data.get('results') and len(data['results']) > 0:
            stock_data = data['results'][0]
            
            # Calcula variação percentual
            current_price = stock_data.get('regularMarketPrice', 0)
            previous_close = stock_data.get('regularMarketPreviousClose', current_price)
            
            if previous_close and previous_close > 0:
                variacao = ((current_price - previous_close) / previous_close) * 100
            else:
                variacao = 0
            
            return {
                'ticker': f"{ticker_brapi}.SA",
                'nome': stock_data.get('longName', stock_data.get('shortName', ticker_brapi)),
                'preco_atual': round(float(current_price), 2),
                'variacao_percentual': round(float(variacao), 2),
                'market_cap': stock_data.get('marketCap', 0),
                'volume': stock_data.get('regularMarketVolume', 0),
                'setor': stock_data.get('sector', 'N/A')
            }
        
        return None
        
    except Exception as e:
        logger.error(f"Erro ao buscar dados do brapi.dev para {ticker_brapi}: {str(e)}")
        return None

def fetch_stock_data_yfinance(ticker):
    """
    Busca dados de uma ação usando yfinance
    """
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        hist = stock.history(period="1d")
        
        if not hist.empty and info:
            current_price = hist['Close'].iloc[-1]
            previous_close = info.get('previousClose', current_price)
            
            # Calcula variação percentual
            if previous_close and previous_close > 0:
                variacao = ((current_price - previous_close) / previous_close) * 100
            else:
                variacao = 0
            
            return {
                'ticker': ticker,
                'nome': info.get('longName', info.get('shortName', ticker.replace('.SA', ''))),
                'preco_atual': round(float(current_price), 2),
                'variacao_percentual': round(float(variacao), 2),
                'market_cap': info.get('marketCap', 0),
                'volume': info.get('volume', 0),
                'setor': info.get('sector', 'N/A')
            }
        
        return None
        
    except Exception as e:
        logger.error(f"Erro ao buscar dados do yfinance para {ticker}: {str(e)}")
        return None

@api_view(['GET'])
def top_acoes_brasil(request):
    """
    Busca as top 10 ações brasileiras usando yfinance com rate limiting e cache
    """
    try:
        # Verifica cache primeiro (cache por 5 minutos)
        cache_key = 'top_acoes_brasil_data'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            logger.info("Retornando dados do cache")
            return Response({
                'success': True,
                'data': cached_data,
                'total': len(cached_data),
                'message': 'Top 10 ações brasileiras (dados em cache)',
                'cached': True
            })
        
        acoes_data = []
        
        # Busca informações das ações com fallback yfinance -> brapi.dev
        yfinance_failed = False
        
        for i, (ticker, ticker_brapi) in enumerate(zip(TOP_BRAZILIAN_STOCKS[:12], TOP_BRAZILIAN_STOCKS_BRAPI[:12])):
            # Rate limiting: delay de 0.5 segundos entre requisições
            if i > 0:
                time.sleep(0.5)
            
            acao_info = None
            
            # Tenta primeiro com yfinance (se não falhou antes)
            if not yfinance_failed:
                logger.info(f"Tentando yfinance para {ticker}...")
                acao_info = fetch_stock_data_yfinance(ticker)
                
                # Se yfinance falhou com rate limit, marca como falhou
                if acao_info is None:
                    logger.warning(f"yfinance falhou para {ticker}, tentando brapi.dev...")
                    # Se falhou por rate limit, não tenta mais yfinance
                    yfinance_failed = True
            
            # Se yfinance falhou ou não conseguiu dados, tenta brapi.dev
            if acao_info is None:
                logger.info(f"Tentando brapi.dev para {ticker_brapi}...")
                acao_info = fetch_stock_data_brapi(ticker_brapi)
            
            # Se conseguiu dados de alguma fonte
            if acao_info:
                acoes_data.append(acao_info)
                
                # Atualiza ou cria no banco de dados
                acao, created = Acao.objects.update_or_create(
                    ticker=acao_info['ticker'],
                    defaults={
                        'nome': acao_info['nome'],
                        'preco_atual': acao_info['preco_atual'],
                        'variacao_percentual': acao_info['variacao_percentual'],
                        'market_cap': acao_info['market_cap'],
                        'volume': acao_info['volume'],
                        'setor': acao_info['setor']
                    }
                )
                
                logger.info(f"Dados obtidos para {acao_info['ticker']} - Preço: R$ {acao_info['preco_atual']}")
            else:
                logger.error(f"Falha ao obter dados para {ticker} em ambas as APIs")
        
        # Ordena por market cap e pega os top 10
        acoes_data.sort(key=lambda x: x.get('market_cap', 0), reverse=True)
        top_10 = acoes_data[:10]
        
        # Salva no cache por 5 minutos (300 segundos)
        if top_10:
            cache.set(cache_key, top_10, 300)
            logger.info(f"Dados salvos no cache: {len(top_10)} ações")
        
        return Response({
            'success': True,
            'data': top_10,
            'total': len(top_10),
            'message': 'Top 10 ações brasileiras atualizadas com sucesso',
            'cached': False
        })
        
    except Exception as e:
        logger.error(f"Erro geral ao buscar top ações: {str(e)}")
        return Response({
            'success': False,
            'error': 'Erro interno do servidor',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def acoes_salvas(request):
    """
    Retorna as ações salvas no banco de dados
    """
    acoes = Acao.objects.all()[:10]
    serializer = AcaoTopSerializer(acoes, many=True)
    return Response({
        'success': True,
        'data': serializer.data,
        'total': len(serializer.data)
    })

@api_view(['GET'])
def detalhes_acao(request, ticker):
    """
    Busca detalhes específicos de uma ação
    """
    try:
        # Adiciona .SA se não estiver presente
        if not ticker.endswith('.SA'):
            ticker += '.SA'
            
        stock = yf.Ticker(ticker)
        info = stock.info
        hist = stock.history(period="5d")
        
        if info and not hist.empty:
            current_price = hist['Close'].iloc[-1]
            previous_close = info.get('previousClose', current_price)
            
            if previous_close and previous_close > 0:
                variacao = ((current_price - previous_close) / previous_close) * 100
            else:
                variacao = 0
            
            dados = {
                'ticker': ticker,
                'nome': info.get('longName', info.get('shortName', ticker)),
                'preco_atual': round(float(current_price), 2),
                'variacao_percentual': round(float(variacao), 2),
                'market_cap': info.get('marketCap', 0),
                'volume': info.get('volume', 0),
                'setor': info.get('sector', 'N/A'),
                'pe_ratio': info.get('trailingPE', 0),
                'dividend_yield': info.get('dividendYield', 0),
                'historico_5d': [
                    {
                        'data': date.strftime('%Y-%m-%d'),
                        'preco': round(float(price), 2)
                    }
                    for date, price in hist['Close'].items()
                ]
            }
            
            return Response({
                'success': True,
                'data': dados
            })
        else:
            return Response({
                'success': False,
                'error': 'Ação não encontrada'
            }, status=status.HTTP_404_NOT_FOUND)
            
    except Exception as e:
        logger.error(f"Erro ao buscar detalhes da ação {ticker}: {str(e)}")
        return Response({
            'success': False,
            'error': 'Erro ao buscar dados da ação',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Views para Portfolio (requer autenticação)
class PortfolioListCreateView(generics.ListCreateAPIView):
    """
    Lista e cria itens do portfólio do usuário
    """
    serializer_class = PortfolioUsuarioSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return PortfolioUsuario.objects.filter(usuario=self.request.user)

class PortfolioDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Detalhes, atualização e exclusão de item do portfólio
    """
    serializer_class = PortfolioUsuarioSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return PortfolioUsuario.objects.filter(usuario=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def portfolio_resumo(request):
    """
    Retorna resumo do portfólio do usuário
    """
    portfolio = PortfolioUsuario.objects.filter(usuario=request.user)
    
    if not portfolio.exists():
        return Response({
            'success': True,
            'data': {
                'total_investido': 0,
                'valor_atual': 0,
                'lucro_prejuizo_total': 0,
                'percentual_retorno': 0,
                'quantidade_acoes': 0
            }
        })
    
    total_investido = sum([item.valor_total_investido for item in portfolio])
    valor_atual = sum([item.valor_atual for item in portfolio])
    lucro_prejuizo = valor_atual - total_investido
    
    if total_investido > 0:
        percentual_retorno = (lucro_prejuizo / total_investido) * 100
    else:
        percentual_retorno = 0
    
    resumo = {
        'total_investido': total_investido,
        'valor_atual': valor_atual,
        'lucro_prejuizo_total': lucro_prejuizo,
        'percentual_retorno': round(percentual_retorno, 2),
        'quantidade_acoes': portfolio.count()
    }
    
    serializer = PortfolioResumoSerializer(resumo)
    return Response({
        'success': True,
        'data': serializer.data
    })
