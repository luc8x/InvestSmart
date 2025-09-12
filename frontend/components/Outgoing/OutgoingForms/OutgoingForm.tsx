"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { NovoGasto, Gasto, CATEGORIAS } from "../types"

interface GastoFormProps {
  onAdicionarGasto: (gasto: Omit<Gasto, 'id'>) => void
}

export function OutgoingForm({ onAdicionarGasto }: GastoFormProps) {
  const [novoGasto, setNovoGasto] = useState<NovoGasto>({
    valor: '',
    categoria: '',
    descricao: '',
    data: new Date(),
    tipo: 'variavel'
  })
  const [dialogAberto, setDialogAberto] = useState(false)

  const adicionarGasto = () => {
    if (!novoGasto.valor || !novoGasto.categoria) return

    const gasto: Omit<Gasto, 'id'> = {
      valor: parseFloat(novoGasto.valor),
      categoria: novoGasto.categoria,
      descricao: novoGasto.descricao,
      data: novoGasto.data,
      tipo: novoGasto.tipo
    }

    onAdicionarGasto(gasto)
    setNovoGasto({
      valor: '',
      categoria: '',
      descricao: '',
      data: new Date(),
      tipo: 'variavel'
    })
    setDialogAberto(false)
  }

  return (
    <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="">
          <Plus className="h-4 w-4" />
          Novo Gasto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Gasto</DialogTitle>
          <DialogDescription>
            Preencha as informações do seu gasto
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={novoGasto.valor}
              onChange={(e) => setNovoGasto({...novoGasto, valor: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={novoGasto.categoria} onValueChange={(value) => setNovoGasto({...novoGasto, categoria: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS.map(categoria => (
                  <SelectItem key={categoria.nome} value={categoria.nome}>
                    <div className="flex items-center gap-2">
                      <span>{categoria.icone}</span>
                      {categoria.nome}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select value={novoGasto.tipo} onValueChange={(value: 'fixo' | 'variavel') => setNovoGasto({...novoGasto, tipo: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="variavel">Variável</SelectItem>
                <SelectItem value="fixo">Fixo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva o gasto..."
              value={novoGasto.descricao}
              onChange={(e) => setNovoGasto({...novoGasto, descricao: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(novoGasto.data, "PPP", { locale: ptBR })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={novoGasto.data}
                  onSelect={(date) => date && setNovoGasto({...novoGasto, data: date})}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDialogAberto(false)}>
            Cancelar
          </Button>
          <Button onClick={adicionarGasto}>
            Adicionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}