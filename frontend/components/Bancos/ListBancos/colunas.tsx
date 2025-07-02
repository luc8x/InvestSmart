"use client"

import { Button } from "@/components/ui/index"
import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash } from "lucide-react"

export type Banco = {
  id: string
  nome: string
  tipo: string
  acoes: string
}

export type UsuarioBanco = {
  id: number;
  banco: Banco;
};

export const columns: ColumnDef<Banco>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
  },
  {
    id: "acoes",
    header: "Ações",
    cell: ({ row }) => {
      const banco = row.original;

      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Editar", banco)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => console.log("Excluir", banco)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];