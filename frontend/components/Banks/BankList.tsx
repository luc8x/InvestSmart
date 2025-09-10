"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Trash2, PieChart, Edit } from "lucide-react"
import { BankForm } from "./BankForm"
import BankPieChart from './BankPieChart'
import BankMetricsCards from './BankMetrics'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "../ui/scroll-area"

interface Banco {
  nome: string
  codigo: string
  agencia: string
  conta: string
  tipoConta: string
  saldo: number
}

export default function BankList() {
  const [bancos, setBancos] = useState<Banco[]>([
    { nome: "Banco do Brasil S.A.", codigo: "001", agencia: "1234", conta: "56789-0", tipoConta: "Corrente", saldo: 15000 },
    { nome: "Itaú Unibanco S.A.", codigo: "341", agencia: "4321", conta: "98765-0", tipoConta: "Poupança", saldo: 8500 },
    { nome: "Nu Pagamentos S.A. (Nubank)", codigo: "260", agencia: "0001", conta: "12345-6", tipoConta: "PJ", saldo: 100056 },
  ])

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [editingBank, setEditingBank] = useState<Banco | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | undefined>(undefined)

  const COLORS = [
    "#7E22CE", // roxo intenso
    "#6B21A8", // roxo profundo
    "#C084FC", // roxo médio
    "#E9D5FF", // lilás bem claro
    "#A855F7", // roxo vibrante
    "#9333EA", // roxo forte
  ]

  const chartData = bancos.map((banco, index) => ({
    name: banco.nome,
    value: banco.saldo,
    color: COLORS[index % COLORS.length]
  }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const handleAdd = (novoBanco: Banco) => {
    setBancos([...bancos, novoBanco])
  }

  const handleEdit = (bancoAtualizado: Banco, index: number) => {
    const novosBancos = [...bancos]
    novosBancos[index] = bancoAtualizado
    setBancos(novosBancos)
    setEditingBank(null)
    setEditingIndex(undefined)
  }

  const handleStartEdit = (banco: Banco, index: number) => {
    setEditingBank(banco)
    setEditingIndex(index)
  }

  const handleDelete = (index: number) => {
    setBancos(bancos.filter((_, i) => i !== index))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 h-full">
      <Card className="gap-2 shadow-lg">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>
            Bancos Cadastrados
          </CardTitle>
          <div className="flex gap-2">
            <BankForm onAdd={handleAdd} />
            {editingBank && (
              <BankForm 
                onEdit={handleEdit}
                editingBank={editingBank}
                editingIndex={editingIndex}
                trigger={
                  <Button variant="ghost" size="sm" className="hidden">
                    <Edit className="w-4 h-4" />
                  </Button>
                }
              />
            )}
          </div>
        </CardHeader>

        <CardContent>
          <hr className="mb-4 border-gray-200" />
          <ScrollArea className="h-82">
            <ul className="grid grid-cols-1 gap-3">
              {bancos.map((banco, index) => (
                <li
                  key={index}
                  className="p-4 rounded-lg border text-sm font-medium flex flex-col gap-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                      <div className="font-semibold text-gray-900 text-base">{banco.nome}</div>
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                          {banco.tipoConta}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Código: {banco.codigo} • Ag. {banco.agencia} • Conta {banco.conta}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <div className="font-bold text-lg text-purple-600">
                          {formatCurrency(banco.saldo)}
                        </div>
                        <div className="text-xs text-gray-500">Saldo atual</div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(banco, index)}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-purple-800 hover:bg-purple-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(index)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="gap-2 shadow-lg">
        <CardHeader>
          <CardTitle>
            Distribuição de Saldos
          </CardTitle>
        </CardHeader>

        <CardContent>
          <hr className="mb-4 border-gray-200" />
          {bancos.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <BankPieChart 
                  chartData={chartData}
                  hoveredIndex={hoveredIndex}
                  setHoveredIndex={setHoveredIndex}
                  formatCurrency={formatCurrency}
                />

                <BankMetricsCards 
                  chartData={chartData}
                  hoveredIndex={hoveredIndex}
                  formatCurrency={formatCurrency}
                />
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="relative">
                  <PieChart className="w-16 h-16 mx-auto text-gray-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-600">Nenhum banco cadastrado</p>
                  <p className="text-sm text-gray-400">Adicione um banco para visualizar os dados</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
