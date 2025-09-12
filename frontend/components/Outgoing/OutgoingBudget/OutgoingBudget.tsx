"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Budget } from "./Budget"
import { 
  Target, 
  Plus, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react"

const mockCategories = [
  "Alimentação",
  "Transporte", 
  "Entretenimento",
  "Saúde",
  "Educação",
  "Compras",
  "Outros"
]

export function OutgoingBudget() {
  const [activeTab, setActiveTab] = useState("visualizar")

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col gap-7">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visualizar" className="text-xs">
            <Target className="w-3 h-3 mr-1" />
            Visualizar Metas
          </TabsTrigger>
          <TabsTrigger value="cadastrar" className="text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Nova Meta
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="visualizar" className="space-y-4">
          <Budget/>
        </TabsContent>
        
        <TabsContent value="cadastrar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nova Meta de Gastos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Meta</Label>
                  <Input 
                    id="title" 
                    placeholder="Ex: Reduzir gastos com alimentação"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="current">Gasto Atual Mensal</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="current" 
                      type="number" 
                      placeholder="0,00"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="target">Meta de Gasto</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="target" 
                      type="number" 
                      placeholder="0,00"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline">Prazo para Atingir a Meta</Label>
                <Input 
                  id="deadline" 
                  type="date"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <Textarea 
                  id="description" 
                  placeholder="Descreva sua estratégia para atingir esta meta..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">
                  <Target className="w-4 h-4 mr-2" />
                  Criar Meta
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("visualizar")}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}