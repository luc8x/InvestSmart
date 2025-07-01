"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Bancos = {
  id: string
  nome: string
  cnpj: number
  tipo: string
}

export const columns: ColumnDef<Bancos>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "cnpj",
    header: "CNPJ",
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
  },
]