"use client"

import { useState, useEffect } from "react"
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
import { PlusCircle, Edit } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utilities/utils"

interface Banco {
  nome: string
  codigo: string
  agencia: string
  conta: string
  tipoConta: string
  saldo: number
}

interface BankFormProps {
  onAdd?: (banco: Banco) => void
  onEdit?: (banco: Banco, index: number) => void
  editingBank?: Banco | null
  editingIndex?: number
  trigger?: React.ReactNode
}

export function BankForm({ onAdd, onEdit, editingBank, editingIndex, trigger }: BankFormProps) {
  const [open, setOpen] = useState(false)
  const [novoBanco, setNovoBanco] = useState<Banco>({
    nome: "",
    codigo: "",
    agencia: "",
    conta: "",
    tipoConta: "",
    saldo: 0,
  })
  const [bancos, setBancos] = useState<{codigo: string, nome: string}[]>([])
  const [openCombobox, setOpenCombobox] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingBank) {
      setNovoBanco(editingBank)
      setSearchValue(editingBank.nome)
    } else {
      setNovoBanco({ nome: "", codigo: "", agencia: "", conta: "", tipoConta: "", saldo: 0 })
      setSearchValue("")
    }
  }, [editingBank])

  // Buscar bancos na API
  const searchBancos = async (search: string) => {
    if (!search || search.length < 2) {
      setBancos([])
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch(`/api/banks?search=${encodeURIComponent(search)}`)
      const data = await response.json()
      
      if (data.success) {
        setBancos(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar bancos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      searchBancos(searchValue)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchValue])

  const handleBankSelect = (banco: {codigo: string, nome: string}) => {
    setNovoBanco(prev => ({
      ...prev,
      nome: banco.nome,
      codigo: banco.codigo
    }))
    setSearchValue(banco.nome)
    setOpenCombobox(false)
  }

  const handleSave = () => {
    if (!novoBanco.nome.trim()) return
    
    if (editingBank && onEdit && editingIndex !== undefined) {
      onEdit(novoBanco, editingIndex)
    } else if (onAdd) {
      onAdd(novoBanco)
    }
    
    setNovoBanco({ nome: "", codigo: "", agencia: "", conta: "", tipoConta: "", saldo: 0 })
    setSearchValue("")
    setOpen(false)
  }

  const handleCancel = () => {
    setNovoBanco({ nome: "", codigo: "", agencia: "", conta: "", tipoConta: "", saldo: 0 })
    setSearchValue("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={'outlined'} className="flex gap-1 cursor-pointer hover:bg-gray-50 border border-white hover:border-gray-200/80">
            <PlusCircle className="w-4 h-4" />
            Novo Banco
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingBank ? 'Editar Banco' : 'Cadastrar Banco'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {/* Busca de Banco */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Banco</label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                >
                  {searchValue || "Buscar banco..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Digite o nome do banco..." 
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandEmpty>
                    {loading ? "Buscando..." : "Nenhum banco encontrado."}
                  </CommandEmpty>
                  <CommandGroup>
                    {bancos.map((banco) => (
                      <CommandItem
                        key={banco.codigo}
                        value={banco.nome}
                        onSelect={() => handleBankSelect(banco)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            searchValue === banco.nome ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{banco.nome}</span>
                          <span className="text-xs text-gray-500">Código: {banco.codigo}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Input
            placeholder="Código do banco"
            value={novoBanco.codigo}
            onChange={(e) => setNovoBanco({ ...novoBanco, codigo: e.target.value })}
            disabled={!!searchValue && bancos.some(b => b.nome === searchValue)}
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Saldo Inicial</label>
            <Input
              type="number"
              placeholder="0,00"
              value={novoBanco.saldo}
              onChange={(e) => setNovoBanco({ ...novoBanco, saldo: parseFloat(e.target.value) || 0 })}
              step="0.01"
              min="0"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {editingBank ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
