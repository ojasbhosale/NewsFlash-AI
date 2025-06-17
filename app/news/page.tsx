"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, RefreshCw, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { PremiumNavbar } from "@/components/premium-navbar"
import { EnhancedNewsFilters } from "@/components/enhanced-news-filters"
import { PremiumNewsCard } from "@/components/premium-news-card"
import { RateLimitDisplay } from "@/components/rate-limit-display"
import { ReadingStatsDashboard } from "@/components/reading-stats-dashboard"
import { fetchNews, NewsAPIError } from "@/lib/news-api"
import type { NewsArticle, FilterOptions } from "@/types/news"
import { useToast } from "@/hooks/use-toast"

function NewsPageContent() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({})
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters: FilterOptions = {}
    const q = searchParams.get("q")
    const category = searchParams.get("category")
    const country = searchParams.get("country")

    if (q) urlFilters.q = q
    if (category) urlFilters.category = category
    if (country) urlFilters.country = country

    setFilters(urlFilters)

    // Load news with URL filters or default empty filters
    const loadInitialNews = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchNews(urlFilters)
        setArticles(response.results || [])

        if (response.results?.length === 0) {
          toast({
            title: "📰 No Articles Found",
            description: "Try adjusting your filters or search terms.",
          })
        } else {
          toast({
            title: `✨ Found ${response.results?.length} Articles!`,
            description: "Latest news loaded successfully.",
          })
        }
      } catch (err) {
        const errorMessage = err instanceof NewsAPIError ? err.message : "Failed to load news. Please try again."
        setError(errorMessage)
        toast({
          title: "❌ Error Loading News",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (Object.keys(urlFilters).length > 0 || !q) {
      loadInitialNews()
    }
  }, [searchParams, toast])

  const loadNews = async (newFilters: FilterOptions = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchNews(newFilters)
      setArticles(response.results || [])

      if (response.results?.length === 0) {
        toast({
          title: "📰 No Articles Found",
          description: "Try adjusting your filters or search terms.",
        })
      } else {
        toast({
          title: `✨ Found ${response.results?.length} Articles!`,
          description: "Latest news loaded successfully.",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof NewsAPIError ? err.message : "Failed to load news. Please try again."
      setError(errorMessage)
      toast({
        title: "❌ Error Loading News",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)

    // Update URL with new filters
    const params = new URLSearchParams()
    if (newFilters.q) params.set("q", newFilters.q)
    if (newFilters.category) params.set("category", newFilters.category)
    if (newFilters.country) params.set("country", newFilters.country)

    const newUrl = params.toString() ? `/news?${params.toString()}` : "/news"
    router.replace(newUrl)

    loadNews(newFilters)
  }

  const handleSearch = (query: string) => {
    const searchFilters = { ...filters, q: query }
    handleFiltersChange(searchFilters)
  }

  const handleRefresh = () => {
    loadNews(filters)
  }

  const handleShowBookmarks = () => {
    router.push("/bookmarks")
  }

  const handleShowStats = () => {
    router.push("/analytics")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <PremiumNavbar
        onSearch={handleSearch}
        onShowBookmarks={handleShowBookmarks}
        onShowStats={handleShowStats}
        currentPath="/news"
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* News Content */}
          <div className="space-y-8">
            {/* Page Header */}
            <div className="text-center space-y-4 py-8">
              <h1 className="text-headline gradient-text">Latest News Headlines</h1>
              <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                Stay updated with the latest news from around the world, powered by AI summaries
              </p>
            </div>

            {/* Filters */}
            <EnhancedNewsFilters onFiltersChange={handleFiltersChange} isLoading={isLoading} />

            {/* Error Display */}
            {error && (
              <Alert variant="destructive" className="glass animate-slide-in-up">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-spin">
                      <div className="absolute inset-2 rounded-full bg-background"></div>
                    </div>
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-title gradient-text">Loading Latest News</h3>
                    <p className="text-caption">Fetching the most recent headlines for you...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            {!isLoading && articles.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-title">Headlines</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-caption">{articles.length} articles</span>
                    <Button
                      onClick={handleRefresh}
                      disabled={isLoading}
                      variant="outline"
                      size="sm"
                      className="glass hover:bg-green-500/20"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  </div>
                </div>

                <div className="grid gap-8">
                  {articles.map((article, index) => (
                    <PremiumNewsCard key={article.article_id} article={article} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && articles.length === 0 && (
              <div className="py-20 text-center space-y-6 animate-slide-in-up">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-gray-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-title">No Articles Found</h3>
                  <p className="text-body text-muted-foreground max-w-md mx-auto">
                    Try adjusting your filters or search terms to find relevant news.
                  </p>
                </div>
                <Button onClick={handleRefresh} className="btn-premium text-white">
                  Try Again
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <ReadingStatsDashboard />
              <RateLimitDisplay />
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default function NewsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-spin mx-auto">
              <div className="absolute inset-2 rounded-full bg-background"></div>
            </div>
            <p className="text-muted-foreground">Loading news...</p>
          </div>
        </div>
      }
    >
      <NewsPageContent />
    </Suspense>
  )
}
