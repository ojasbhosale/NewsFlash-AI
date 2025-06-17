"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { BookOpen, Trash2, ExternalLink, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PremiumNavbar } from "@/components/premium-navbar"
import { ReadingStatsDashboard } from "@/components/reading-stats-dashboard"
import { getBookmarkedArticles, toggleBookmark, type BookmarkedArticle } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const loadBookmarks = useCallback(() => {
    setIsLoading(true)
    try {
      const savedBookmarks = getBookmarkedArticles()
      setBookmarks(savedBookmarks)
    } catch {
      toast({
        title: "❌ Error Loading Bookmarks",
        description: "Failed to load your saved articles.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadBookmarks()
  }, [loadBookmarks])

  const handleRemoveBookmark = (articleId: string) => {
    const article = bookmarks.find((b) => b.article_id === articleId)
    if (article) {
      toggleBookmark({
        article_id: article.article_id,
        title: article.title,
        link: article.link,
        category: article.category,
        image_url: article.image_url,
      })

      setBookmarks((prev) => prev.filter((b) => b.article_id !== articleId))

      toast({
        title: "🗑️ Bookmark Removed",
        description: "Article removed from your reading list.",
      })
    }
  }

  const handleSearch = (query: string) => {
    router.push(`/news?q=${encodeURIComponent(query)}`)
  }

  const handleShowStats = () => {
    router.push("/analytics")
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Unknown date"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <PremiumNavbar
        onSearch={handleSearch}
        onShowBookmarks={() => {}}
        onShowStats={handleShowStats}
        currentPath="/bookmarks"
      />

      <main className="pt-2">
        <div className="container mx-auto mobile-padding py-8">
          

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Bookmarks Content */}
            <div className="space-y-8">
              {/* Page Header */}
              <div className="text-center space-y-4 py-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h1 className="text-headline gradient-text">Your Bookmarked Articles</h1>
                <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                  Your saved articles for later reading
                </p>
              </div>

              {/* Status Banner */}
              <Alert className="glass border-blue-500/50 bg-blue-500/10 animate-slide-in-up">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-700 dark:text-blue-400">
                  You have {bookmarks.length} bookmarked articles.
                  <Button
                    variant="link"
                    className="p-0 ml-1 h-auto text-blue-700 dark:text-blue-400"
                    onClick={() => router.push("/news")}
                  >
                    Browse more news
                  </Button>
                </AlertDescription>
              </Alert>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-spin mx-auto">
                      <div className="absolute inset-2 rounded-full bg-background"></div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-title gradient-text">Loading Bookmarks</h3>
                      <p className="text-caption">Fetching your saved articles...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bookmarks List */}
              {!isLoading && bookmarks.length > 0 && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-title">Saved Articles</h3>
                    <span className="text-caption">{bookmarks.length} bookmarks</span>
                  </div>

                  <div className="grid gap-6">
                    {bookmarks.map((bookmark, index) => (
                      <Card
                        key={bookmark.article_id}
                        className="card-premium glass border-0 animate-slide-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardHeader className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <CardTitle className="text-title leading-tight hover:gradient-text transition-all duration-300 cursor-pointer">
                                {bookmark.title}
                              </CardTitle>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Saved {formatDate(bookmark.bookmarkedAt)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(bookmark.link, "_blank", "noopener,noreferrer")}
                                className="glass hover:bg-blue-500/20 transition-all duration-300"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveBookmark(bookmark.article_id)}
                                className="glass hover:bg-red-500/20 transition-all duration-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {bookmark.category.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {bookmark.category.slice(0, 3).map((cat) => (
                                <Badge
                                  key={cat}
                                  variant="secondary"
                                  className="text-xs glass hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300"
                                >
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardHeader>

                        {bookmark.image_url && (
                          <CardContent className="pt-0">
                            <div className="aspect-video w-full overflow-hidden rounded-lg relative">
                              <Image
                                src={bookmark.image_url}
                                alt={bookmark.title}
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = "none"
                                }}
                              />
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && bookmarks.length === 0 && (
                <div className="py-20 text-center space-y-6 animate-slide-in-up">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto">
                      <BookOpen className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-title">No Bookmarks Yet</h3>
                    <p className="text-body text-muted-foreground max-w-md mx-auto">
                      Start reading and bookmark interesting articles to build your reading list.
                    </p>
                  </div>
                  <Button onClick={() => router.push("/news")} className="btn-premium text-white">
                    Browse News
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <ReadingStatsDashboard />
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}