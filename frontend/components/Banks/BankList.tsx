"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Trash2, Building2 } from "lucide-react"
import { BancoForm } from "./BankForm"

interface Banco {
  nome: string
  codigo: string
  agencia: string
  conta: string
  tipoConta: string
}

export default function BankList() {
  const [bancos, setBancos] = useState<Banco[]>([
    { nome: "Banco do Brasil", codigo: "001", agencia: "1234", conta: "56789-0", tipoConta: "Corrente" },
    { nome: "Itaú", codigo: "341", agencia: "4321", conta: "98765-0", tipoConta: "Poupança" },
  ])

  const handleAdd = (novoBanco: Banco) => {
    setBancos([...bancos, novoBanco])
  }

  const handleDelete = (index: number) => {
    setBancos(bancos.filter((_, i) => i !== index))
  }

  return (
    <Card className="gap-2 h-full shadow-lg">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>
          Bancos Cadastrados
        </CardTitle>
        <BancoForm onAdd={handleAdd} />
      </CardHeader>

      <CardContent>
        <hr className="mb-4 border-gray-200" />
        <ul className="grid grid-cols-2 gap-2">
          {bancos.map((banco, index) => (
            <li
              key={index}
              className="p-3 rounded-lg border text-sm font-medium flex flex-col gap-1"
            >
              <div className="flex justify-between items-center">
                <span>{banco.nome}</span>
                <Trash2
                  onClick={() => handleDelete(index)}
                  className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
                />
              </div>
              <span className="text-xs text-gray-500">
                {banco.codigo} • Ag. {banco.agencia} • Conta {banco.conta} • {banco.tipoConta}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
