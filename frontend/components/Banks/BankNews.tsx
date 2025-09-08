"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect, useCallback, useRef } from "react"
import { fetchFinancialNews, NewsItem } from "@/lib/newsFinance/newsService"
import { Loader2, Newspaper } from "lucide-react"

export function BankNews() {
  const [noticias, setNoticias] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  const loadNews = useCallback(async (pageNum: number, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true)
        setError(null)
      } else {
        setLoadingMore(true)
      }

      const response = await fetchFinancialNews(pageNum)
      
      if (isInitial) {
        setNoticias(response.noticias)
      } else {
        setNoticias(prev => [...prev, ...response.noticias])
      }
      
      setHasMore(response.hasMore)
      setPage(response.nextPage)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar notícias'
      setError(errorMessage)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    loadNews(1, true)
  }, [])

  useEffect(() => {
    if (!hasMore || loadingMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          loadNews(page, false)
        }
      },
      { threshold: 0.1 }
    )

    observerRef.current = observer

    if (loadingRef.current) {
      observer.observe(loadingRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loadingMore, loading, page, loadNews])

  if (loading) {
    return (
      <Card className="gap-2 h-full">
        <CardHeader>
            <CardTitle>Notícias</CardTitle>
        </CardHeader>
        <CardContent>
          <hr className="mb-4 border-gray-200" />
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              <p className="text-sm text-gray-600">Carregando notícias...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="gap-2 h-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#334155]" />
            <CardTitle>Notícias</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <hr className="mb-4 border-gray-200" />
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-sm text-red-600">{error}</p>
              <button 
                onClick={() => loadNews(1, true)}
                className="px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="gap-2 h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-[#334155]" />
          <CardTitle>Notícias</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <hr className="mb-4 border-gray-200" />
        <ScrollArea className="h-96" ref={scrollAreaRef}>
          <div className="flex flex-col gap-3 pr-4">
            {noticias.map((noticia) => (
              <div key={noticia.id} className="border-l-4 border-purple-500 px-4 py-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer" onClick={() => window.open(noticia.url, '_blank')}>
                <h4 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">{noticia.titulo}</h4>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{noticia.resumo || 'Sem descrição disponível'}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="font-medium">{noticia.fonte}</span>
                  <span>{noticia.tempo}</span>
                </div>
              </div>
            ))}
            
            {hasMore && (
              <div ref={loadingRef} className="flex items-center justify-center py-4">
                {loadingMore && (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                    <span className="text-sm text-gray-600">Carregando mais notícias...</span>
                  </div>
                )}
              </div>
            )}
            
            {!hasMore && noticias.length > 0 && (
              <div className="flex items-center justify-center py-4">
                <p className="text-sm text-gray-500">Todas as notícias foram carregadas</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
