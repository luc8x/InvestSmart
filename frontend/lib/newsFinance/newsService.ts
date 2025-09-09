export interface NewsItem {
  id: string
  titulo: string
  resumo: string
  tempo: string
  fonte: string
  url: string
}

export interface NewsResponse {
  noticias: NewsItem[]
  hasMore: boolean
  nextPage: number
}

const API_KEY = "g0BfhMIRkVOYp6Pm5HYUb6HwN3UplGJfIpPceG6n"

export const fetchFinancialNews = async (
  page: number = 1,
  pageSize: number = 5
): Promise<NewsResponse> => {
  const searchQuery = "finanças, bancos"

  const url = `https://api.marketaux.com/v1/news/all?` +
    `api_token=${API_KEY}` +
    `&language=pt` + 
    `&search=${encodeURIComponent(searchQuery)}` +
    `&page=${page}` +
    `&limit=${pageSize}` +
    `&sort=published_at`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: Falha ao buscar notícias`)
  }

  const data = await response.json()

  const noticias: NewsItem[] = (data.data || []).map((article: any, index: number) => ({
    id: `${page}-${index}`,
    titulo: article.title || "Título não disponível",
    resumo: article.description || "Descrição não disponível",
    tempo: article.published_at
      ? new Date(article.published_at).toLocaleString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
      })
      : "Data não informada",
    fonte: article.source || "Fonte desconhecida",
    url: article.url || "#",
  }))

  const totalFound = data.meta?.found || 0
  const currentPage = data.meta?.page || page
  const hasMorePages = totalFound > currentPage * pageSize

  return {
    noticias,
    hasMore: hasMorePages,
    nextPage: page + 1,
  }
}
