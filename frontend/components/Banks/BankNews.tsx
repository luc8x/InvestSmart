"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect, useCallback, useRef } from "react"
import { fetchFinancialNews, NewsItem } from "@/lib/newsFinance/newsService"
import { Loader2, Newspaper, Sparkles } from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function BankNews() {
  const [noticias, setNoticias] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [summaries, setSummaries] = useState<{ [key: string]: string }>({})
  const [loadingSummaries, setLoadingSummaries] = useState<{ [key: string]: boolean }>({})
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  const GEMINI_API_KEY = 'AIzaSyBl5kdYCkq3E0sS5lxVA5IbvDPsRu7TehI'
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

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

  const getSummaryFromGemini = async (noticia: NewsItem) => {
    const noticiaId = noticia.id.toString()

    if (summaries[noticiaId]) {
      return
    }

    setLoadingSummaries(prev => ({ ...prev, [noticiaId]: true }))

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const prompt = `Por favor, faça um resumo conciso e informativo da seguinte notícia financeira:\n\nTítulo: ${noticia.titulo}\n\nConteúdo: ${noticia.url || noticia.resumo || noticia.titulo}\n\nResumo em português (máximo 3 frases):`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const summary = response.text() || 'Não foi possível gerar o resumo.'

      setSummaries(prev => ({ ...prev, [noticiaId]: summary }))
    } catch (error) {
      console.error('Erro ao obter resumo:', error)
      setSummaries(prev => ({ ...prev, [noticiaId]: 'Erro ao gerar resumo. Tente novamente.' }))
    } finally {
      setLoadingSummaries(prev => ({ ...prev, [noticiaId]: false }))
    }
  }

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
          <CardTitle>Notícias</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <hr className="mb-4 border-gray-200" />
        <ScrollArea className="h-96" ref={scrollAreaRef}>
          <div className="flex flex-col gap-3 pr-1">
            {noticias.map((noticia) => {
              const noticiaId = noticia.id.toString()
              const hasSummary = summaries[noticiaId]
              const isLoadingSummary = loadingSummaries[noticiaId]

              return (
                <div key={noticia.id} className="border-l-4 border-purple-500 px-4 py-3 bg-gray-50 hover:bg-gray-100/90  transition-all duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4
                      className="font-semibold text-sm text-gray-800 line-clamp-2 cursor-pointer flex-1 mr-2"
                      onClick={() => window.open(noticia.url, '_blank')}
                    >
                      {noticia.titulo}
                    </h4>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!hasSummary) {
                              getSummaryFromGemini(noticia)
                            }
                          }}
                          disabled={isLoadingSummary || hasSummary}
                          className={`flex-shrink-0 p-1 rounded-full transition-colors
        ${hasSummary
                              ? 'text-purple-500/60 cursor-default'
                              : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50'}
        ${isLoadingSummary ? 'animate-pulse' : ''}`}
                        >
                          {isLoadingSummary ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles
                              className="w-4 h-4"
                              fill={hasSummary ? "currentColor" : "none"}
                            />
                          )}
                        </button>
                      </TooltipTrigger>

                      {!hasSummary && (
                        <TooltipContent>
                          <p>Gerar resumo com IA</p>
                        </TooltipContent>
                      )}
                    </Tooltip>

                  </div>

                  <p className="text-xs text-gray-600 mb-2 line-clamp-2 cursor-pointer" onClick={() => window.open(noticia.url, '_blank')}>
                    {noticia.resumo || 'Sem descrição disponível'}
                  </p>

                  {hasSummary && (
                    <div className="bg-purple-50 border-l-2 border-purple-300 p-2 mb-2 rounded-r">
                      <p className="text-xs text-purple-800 font-medium mb-1">Resumo da IA:</p>
                      <p className="text-xs text-purple-700">{hasSummary}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="font-medium">{noticia.fonte}</span>
                    <span>{noticia.tempo}</span>
                  </div>
                </div>
              )
            })}

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
