"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SYMBOLS = ["PETR4", "VALE3", "ITUB4", "BBDC4", "BBAS3", "ABEV3", "WEGE3", "SUZB3", "ELET3", "CSNA3"];

interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    percentChange: number;
}

export function TopStocksCard() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const results: Stock[] = [];

                for (const symbol of SYMBOLS) {
                    const res = await fetch(
                        `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=a6e694d90690402fb29f0de8215814a7`
                    );
                    const data = await res.json();

                    if (!data.code) {
                        results.push({
                            symbol: data.symbol,
                            name: data.name,
                            price: parseFloat(data.close),
                            change: parseFloat(data.change),
                            percentChange: parseFloat(data.percent_change),
                        });
                    }
                }

                setStocks(results);
            } catch (err) {
                console.error("Erro ao buscar dados do Twelve Data:", err);
            }
        }

        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const filtered = stocks.filter(
        (s) =>
            s.symbol.toLowerCase().includes(filter.toLowerCase()) ||
            s.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <Card className="gap-2">
            <CardHeader>
                <div className="flex justify-between items-center mb-0">
                    <CardTitle>Top 10 Ações</CardTitle>
                    <div className="relative group">
                        <Input
                            type="text"
                            placeholder="Procurar..."
                            className="pr-9 w-48 focus:w-56 border border-gray-200 backdrop-blur-sm rounded-full text-black placeholder:text-gray-900/60 focus:shadow-none focus:border-white/40 transition-all duration-300"
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        />
                        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-colors duration-200" />

                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <hr className="mb-4 border-gray-200" />
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-400">
                                <th className="px-4 py-2 text-gray-500 font-medium">Símbolo</th>
                                <th className="px-4 py-2 text-gray-500 font-medium text-center">Preço</th>
                                <th className="px-4 py-2 text-gray-500 font-medium text-end">Porcentagem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s, idx) => (
                                <tr
                                    key={idx}
                                    className="hover:bg-white/5 transition border-b border-gray-200"
                                >
                                    <td className="px-4 py-2 text-black font-medium">{s.symbol}</td>
                                    <td className="px-4 py-2 text-black font-medium text-center">R$ {s.price.toFixed(2)}</td>
                                    <td
                                        className={`px-4 py-2 text-sm text-end ${s.percentChange >= 0 ? "text-green-400" : "text-red-400"
                                            }`}
                                    >
                                        {s.percentChange.toFixed(2)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
