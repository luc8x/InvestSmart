"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { PlusCircle } from "lucide-react"

interface Banco {
  nome: string
  codigo: string
  agencia: string
  conta: string
  tipoConta: string
}

interface BancoFormProps {
  onAdd: (banco: Banco) => void
}

export function BancoForm({ onAdd }: BancoFormProps) {
  const [open, setOpen] = useState(false)
  const [novoBanco, setNovoBanco] = useState<Banco>({
    nome: "",
    codigo: "",
    agencia: "",
    conta: "",
    tipoConta: "",
  })

  const handleSave = () => {
    if (!novoBanco.nome.trim()) return
    onAdd(novoBanco)
    setNovoBanco({ nome: "", codigo: "", agencia: "", conta: "", tipoConta: "" })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-1">
          <PlusCircle className="w-4 h-4" />
          Novo Banco
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Banco</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Input
            placeholder="Nome do banco"
            value={novoBanco.nome}
            onChange={(e) => setNovoBanco({ ...novoBanco, nome: e.target.value })}
          />
          <Input
            placeholder="Código do banco"
            value={novoBanco.codigo}
            onChange={(e) => setNovoBanco({ ...novoBanco, codigo: e.target.value })}
          />
          <Input
            placeholder="Agência"
            value={novoBanco.agencia}
            onChange={(e) => setNovoBanco({ ...novoBanco, agencia: e.target.value })}
          />
          <Input
            placeholder="Conta"
            value={novoBanco.conta}
            onChange={(e) => setNovoBanco({ ...novoBanco, conta: e.target.value })}
          />
          <Select
            onValueChange={(val) => setNovoBanco({ ...novoBanco, tipoConta: val })}
            value={novoBanco.tipoConta}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Conta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Corrente">Corrente</SelectItem>
              <SelectItem value="Poupança">Poupança</SelectItem>
              <SelectItem value="PJ">PJ</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
