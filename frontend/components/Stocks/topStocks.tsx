"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, TrendingUp, TrendingDown, AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";

const CACHE_EXPIRY_TIME = 15 * 60 * 1000; // 15 minutos

// Dados de fallback para quando a API falhar
const FALLBACK_DATA: Stock[] = [
    { symbol: "PETR4", name: "Petrobras PN", price: 38.45, change: 0.85, percentChange: 2.26 },
    { symbol: "VALE3", name: "Vale ON", price: 65.20, change: -1.30, percentChange: -1.95 },
    { symbol: "ITUB4", name: "Itaú Unibanco PN", price: 32.18, change: 0.42, percentChange: 1.32 },
    { symbol: "BBDC4", name: "Bradesco PN", price: 14.85, change: -0.15, percentChange: -1.00 },
    { symbol: "BBAS3", name: "Banco do Brasil ON", price: 26.90, change: 0.60, percentChange: 2.28 },
    { symbol: "ABEV3", name: "Ambev ON", price: 11.25, change: 0.05, percentChange: 0.45 },
    { symbol: "WEGE3", name: "WEG ON", price: 42.80, change: 1.20, percentChange: 2.89 },
    { symbol: "SUZB3", name: "Suzano ON", price: 55.30, change: -0.70, percentChange: -1.25 },
    { symbol: "ELET3", name: "Eletrobras ON", price: 41.60, change: 0.90, percentChange: 2.21 },
    { symbol: "CSNA3", name: "CSN ON", price: 18.45, change: -0.25, percentChange: -1.34 }
];

interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    percentChange: number;
    lastUpdated?: number;
}

interface ApiStock {
    ticker: string;
    nome: string;
    preco_atual: number;
    variacao_percentual: number;
    market_cap: number;
    volume: number;
    setor: string;
}

interface ApiResponse {
    success: boolean;
    data: ApiStock[];
    message?: string;
}

interface CachedData {
    data: Stock[];
    timestamp: number;
}

export function TopStocksCard() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [filter, setFilter] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Function to fetch data with caching and rate limiting
    const fetchStockData = useCallback(async (forceRefresh = false) => {
        setIsLoading(true);
        setError(null);

        try {
            // Check cache first if not forcing refresh
            if (!forceRefresh) {
                const cachedData = localStorage.getItem("stocksCache");
                if (cachedData) {
                    const { data, timestamp }: CachedData = JSON.parse(cachedData);
                    const now = Date.now();
                    
                    // Use cached data if it's still valid
                    if (now - timestamp < CACHE_EXPIRY_TIME) {
                        setStocks(data);
                        setLastUpdated(new Date(timestamp));
                        setIsLoading(false);
                        return;
                    }
                }
            }

            // Check rate limiting - prevent requests more frequent than every 30 seconds
            const lastRequestTime = localStorage.getItem("lastStockRequest");
            const now = Date.now();
            if (lastRequestTime && !forceRefresh) {
                const timeSinceLastRequest = now - parseInt(lastRequestTime);
                if (timeSinceLastRequest < 30000) { // 30 seconds
                    console.log('Rate limited: waiting before next request');
                    // Use cached data if available
                    const cachedData = localStorage.getItem("stocksCache");
                    if (cachedData) {
                        const { data, timestamp }: CachedData = JSON.parse(cachedData);
                        setStocks(data);
                        setLastUpdated(new Date(timestamp));
                        setIsLoading(false);
                        setError("Aguardando para evitar muitas requisições...");
                        return;
                    }
                }
            }

            // Store request timestamp
            localStorage.setItem("lastStockRequest", now.toString());

            // Fetch fresh data from our backend API
            const res = await fetch(
                `http://localhost:8000/api/investimentos/top-acoes-brasil/`
            );
            
            if (!res.ok) {
                throw new Error(`API request failed with status ${res.status}`);
            }
            
            const apiResponse: ApiResponse = await res.json();
            console.log('API Response:', apiResponse);

            if (!apiResponse.success || !apiResponse.data) {
                throw new Error(apiResponse.message || 'API returned unsuccessful response');
            }

            // Transform API data to our Stock interface
            const results: Stock[] = apiResponse.data.map((apiStock: ApiStock) => ({
                symbol: apiStock.ticker,
                name: apiStock.nome,
                price: apiStock.preco_atual,
                change: 0, // Calculamos a variação baseada no percentual
                percentChange: apiStock.variacao_percentual,
                lastUpdated: Date.now()
            }));

            // Calcular a variação em valor absoluto baseada no percentual
            results.forEach(stock => {
                stock.change = (stock.price * stock.percentChange) / 100;
            });

            // Update state and cache
            if (results.length > 0) {
                setStocks(results);
                setLastUpdated(new Date());
                
                // Save to cache
                const cacheData: CachedData = {
                    data: results,
                    timestamp: Date.now()
                };
                localStorage.setItem("stocksCache", JSON.stringify(cacheData));
            } else {
                console.warn("API falhou para todas as ações, usando dados de fallback");
                // Use fallback data when API fails
                setStocks(FALLBACK_DATA.map(stock => ({
                    ...stock,
                    lastUpdated: Date.now()
                })));
                setLastUpdated(new Date());
                setError("Usando dados de demonstração - API temporariamente indisponível");
            }
        } catch (err) {
            console.error("Erro ao buscar dados do Twelve Data:", err);
            
            // Use fallback data when there's a complete API failure
            console.warn("Erro completo na API, usando dados de fallback");
            setStocks(FALLBACK_DATA.map(stock => ({
                ...stock,
                lastUpdated: Date.now()
            })));
            setLastUpdated(new Date());
            setError("Usando dados de demonstração - Erro na conexão com a API");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStockData();
        
        // Set up interval for periodic updates (increased to 5 minutes to avoid rate limiting)
        const interval = setInterval(() => fetchStockData(), 5 * 60 * 1000); // 5 minutes
        return () => clearInterval(interval);
    }, [fetchStockData]);

    // Filter stocks based on search input
    const filtered = useMemo(() => {
        return stocks.filter(
            (s) =>
                s.symbol.toLowerCase().includes(filter.toLowerCase()) ||
                s.name.toLowerCase().includes(filter.toLowerCase())
        );
    }, [stocks, filter]);

    // Format the last updated time
    const formattedLastUpdated = useMemo(() => {
        if (!lastUpdated) return "";
        return lastUpdated.toLocaleTimeString();
    }, [lastUpdated]);

    return (
        <TooltipProvider>
            <Card className="gap-2">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                            <CardTitle>Top 10 Ações</CardTitle>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info size={16} className="text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Dados das principais ações do mercado brasileiro</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="relative w-full sm:w-auto group">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Procurar ação..."
                                className="pl-9 pr-3 w-full sm:w-48 focus:w-full sm:focus:w-56 transition-all duration-300 rounded-full"
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                            />
                        </div>
                    </div>
                    {lastUpdated && !isLoading && !error && (
                        <div className="text-xs text-muted-foreground mt-1">
                            Última atualização: {formattedLastUpdated}
                            <button 
                                onClick={() => fetchStockData(true)} 
                                className="ml-2 text-primary hover:underline"
                            >
                                Atualizar
                            </button>
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <hr className="mb-4 border-gray-200" />
                    <div className="space-y-4">
                        {error && stocks.length > 0 && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                <div className="flex items-center">
                                    <Info className="h-5 w-5 text-yellow-400 mr-2" />
                                    <p className="text-sm text-yellow-700">{error}</p>
                                    <button 
                                        onClick={() => fetchStockData(true)} 
                                        className="ml-auto text-xs text-yellow-600 hover:text-yellow-800 underline"
                                    >
                                        Tentar atualizar
                                    </button>
                                </div>
                            </div>
                        )}
                        <ScrollArea className={`${isLoading || !error ? 'h-94' : 'h-78'}`}>
                            {error && stocks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 text-center">
                                    <AlertCircle className="h-10 w-10 text-destructive mb-2" />
                                    <p className="text-destructive font-medium">{error}</p>
                                    <button 
                                        onClick={() => fetchStockData(true)} 
                                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                    >
                                        Tentar novamente
                                    </button>
                                </div>
                                ) : (
                                    <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-muted/50">
                                                    <th className="px-4 py-3 text-muted-foreground font-medium">Símbolo</th>
                                                    <th className="px-4 py-3 text-muted-foreground font-medium">Nome</th>
                                                    <th className="px-4 py-3 text-muted-foreground font-medium text-center">Preço</th>
                                                    <th className="px-4 py-3 text-muted-foreground font-medium text-end">Variação</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isLoading ? (
                                                    Array(10).fill(0).map((_, idx) => (
                                                        <tr key={idx} className="border-b border-border">
                                                            <td className="px-4 py-3">
                                                                <Skeleton className="h-5 w-16" />
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <Skeleton className="h-5 w-32" />
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <Skeleton className="h-5 w-20 mx-auto" />
                                                            </td>
                                                            <td className="px-4 py-3 text-end">
                                                                <Skeleton className="h-5 w-16 ml-auto" />
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : filtered.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                                            Nenhuma ação encontrada com o termo "{filter}"
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filtered.map((stock, idx) => (
                                                        <tr
                                                            key={idx}
                                                            className="border-b border-border hover:bg-muted/30 transition-colors"
                                                        >
                                                            <td className="px-4 py-3 font-medium">{stock.symbol}</td>
                                                            <td className="px-4 py-3 text-muted-foreground">{stock.name}</td>
                                                            <td className="px-4 py-3 font-medium text-center">
                                                                <span>R$ {stock.price.toFixed(2)}</span>
                                                            </td>
                                                            <td className="px-4 py-3 text-end">
                                                                <Badge
                                                                    className={`font-medium gap-1 ${stock.percentChange >= 0 ? "bg-purple-700 text-white" : "bg-gray-200 text-gray-700"}`}
                                                                >
                                                                    {stock.percentChange >= 0 ? (
                                                                        <TrendingUp className="h-3 w-3" />
                                                                    ) : (
                                                                        <TrendingDown className="h-3 w-3" />
                                                                    )}
                                                                    {stock.percentChange.toFixed(2)}%
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    </>
                                )}
                        </ScrollArea>
                     </div>
                 </CardContent>
            </Card>
        </TooltipProvider>
     );
}

export default TopStocksCard;
