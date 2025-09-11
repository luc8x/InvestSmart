import { Package, House, Shirt, Gamepad2, GraduationCap, HeartPulse, Car, Beef } from "lucide-react"

export const CATEGORIAS = [
  { nome: "Alimentação", icone: <Beef />, cor: "bg-orange-500" },
  { nome: "Transporte", icone: <Car />, cor: "bg-blue-500" },
  { nome: "Saúde", icone: <HeartPulse />, cor: "bg-red-500" },
  { nome: "Educação", icone: <GraduationCap />, cor: "bg-green-500" },
  { nome: "Lazer", icone: <Gamepad2 />, cor: "bg-purple-500" },
  { nome: "Casa", icone: <House />, cor: "bg-yellow-500" },
  { nome: "Roupas", icone: <Shirt />, cor: "bg-pink-500" },
  { nome: "Outros", icone: <Package />, cor: "bg-gray-500" }
]

export type Ordenacao = 'data-desc' | 'data-asc' | 'valor-desc' | 'valor-asc' | 'categoria'

export interface Filtros {
  categoria: string
  mes: number
  ano: number
  busca: string
  ordenacao: Ordenacao
  mostrarDuplicatas: boolean
}

export interface FiltrosCallbacks {
  setCategoria: (categoria: string) => void
  setMes: (mes: number) => void
  setAno: (ano: number) => void
  setBusca: (busca: string) => void
  setOrdenacao: (ordenacao: Ordenacao) => void
  setMostrarDuplicatas: (mostrar: boolean) => void
}