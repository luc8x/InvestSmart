export interface Gasto {
  id: string
  valor: number
  categoria: string
  descricao: string
  data: Date
  tipo: 'fixo' | 'variavel'
}

export interface CategoriaGasto {
  nome: string
  cor: string
  icone: string
  orcamento?: number
}

export interface NovoGasto {
  valor: string
  categoria: string
  descricao: string
  data: Date
  tipo: 'fixo' | 'variavel'
}

export interface InsightData {
  tipo: 'alerta' | 'economia'
  titulo: string
  descricao: string
  icone: any
  cor: string
}

export interface MetricaGasto {
  titulo: string
  valor: string | number
  icone: any
  cor: string
  indicador: string
}

export const CATEGORIAS: CategoriaGasto[] = [
  { nome: 'Alimentação', cor: 'bg-orange-500', icone: '🍽️', orcamento: 800 },
  { nome: 'Transporte', cor: 'bg-blue-500', icone: '🚗', orcamento: 400 },
  { nome: 'Moradia', cor: 'bg-green-500', icone: '🏠', orcamento: 1200 },
  { nome: 'Saúde', cor: 'bg-red-500', icone: '🏥', orcamento: 300 },
  { nome: 'Educação', cor: 'bg-purple-500', icone: '📚', orcamento: 200 },
  { nome: 'Lazer', cor: 'bg-pink-500', icone: '🎮', orcamento: 300 },
  { nome: 'Roupas', cor: 'bg-yellow-500', icone: '👕', orcamento: 200 },
  { nome: 'Outros', cor: 'bg-gray-500', icone: '📦' }
]