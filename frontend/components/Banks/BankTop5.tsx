"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function BankTop5() {
  const top10Bancos = [
    { posicao: 1, banco: "Itaú Unibanco", valorMercado: "R$ 312,5 bi" },
    { posicao: 2, banco: "Banco do Brasil", valorMercado: "R$ 198,7 bi" },
    { posicao: 3, banco: "Bradesco", valorMercado: "R$ 187,3 bi" },
    { posicao: 4, banco: "Santander Brasil", valorMercado: "R$ 156,2 bi" },
    { posicao: 5, banco: "BTG Pactual", valorMercado: "R$ 89,4 bi" },
  ]

  return (
    <Card className="gap-2 h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Top 5 Bancos do Mercado</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <hr className="mb-4 border-gray-200" />
        <div className="space-y-3 max-h-95 overflow-y-auto">
          {top10Bancos.map((banco, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-300/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600">#{banco.posicao}</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-[#0F172A]">{banco.banco}</span>
                  <div className="text-xs text-[#475569]">{banco.valorMercado}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
