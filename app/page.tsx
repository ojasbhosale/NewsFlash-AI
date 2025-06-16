"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { NewsFilters } from "@/components/news-filters"
import { NewsCard } from "@/components/news-card"
import { RateLimitDisplay } from "@/components/rate-limit-display"
import { fetchNews, NewsAPIError } from "@/lib/news-api"
import type { NewsArticle, FilterOptions } from "@/types/news"
import { useToast } from "@/hooks/use-toast"

// 🛠 Dynamically import lucide icons with SSR disabled to prevent hydration mismatch
const Newspaper = dynamic(() => import("lucide-react").then(mod => mod.Newspaper), { ssr: false })
const RefreshCw = dynamic(() => import("lucide-react").then(mod => mod.RefreshCw), { ssr: false })

export default function HomePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({})
  const { toast } = useToast()

  const loadNews = async (newFilters: FilterOptions = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchNews(newFilters)
      setArticles(response.results || [])

      if (response.results?.length === 0) {
        toast({
          title: "No articles found",
          description: "Try adjusting your filters or search terms.",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof NewsAPIError ? err.message : "Failed to load news. Please try again."

      setError(errorMessage)
      toast({
        title: "Error loading news",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    loadNews(newFilters)
  }

  const handleRefresh = () => {
    loadNews(filters)
  }

  useEffect(() => {
    loadNews()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Newspaper className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">NewsFlash AI</h1>
                <p className="text-sm text-muted-foreground">Latest news with AI-powered summaries</p>
              </div>
            </div>

            <Button onClick={handleRefresh} disabled={isLoading} variant="outline">
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Filters */}
            <NewsFilters onFiltersChange={handleFiltersChange} isLoading={isLoading} />

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading latest news...</p>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            {!isLoading && articles.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2">
                {articles.map((article) => (
                  <NewsCard key={article.article_id} article={article} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && articles.length === 0 && (
              <div className="py-12 text-center">
                <Newspaper className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No articles found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <RateLimitDisplay />

            {/* Usage Tips */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold mb-3">Usage Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use specific keywords for better search results</li>
                <li>• Generate summaries sparingly to conserve API limits</li>
                <li>• Mark articles as read to track your progress</li>
                <li>• Refresh periodically for the latest news</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
