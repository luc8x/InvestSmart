'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

export default function AddBankForm() {
  const [nome, setName] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access='))
      ?.split('=')[1];

    if (!token) {
      console.error('Token não encontrado!');
      return;
    }

    const response = await fetch('http://127.0.0.1:8001/api/banks/adicionar/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        balance: parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.')),
        tipo,
      })
    })
  }

  return (


    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            placeholder="Nome do banco"
            value={nome}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="valor">Valor no banco</Label>
          <Input
            id="valor"
            name="valor"
            placeholder="R$ 0,00"
            value={valor}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '')
              const formatted = (Number(raw) / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })
              setValor(formatted)
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="tipo">Tipo</Label>
          <Select onValueChange={(val) => setTipo(val)}>
            <SelectTrigger className="w-full bg-accent-foreground">
              <SelectValue placeholder="Selecione o tipo de conta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="corrente">Conta Corrente</SelectItem>
              <SelectItem value="poupanca">Poupança</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>


  )
}
