"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  ExternalLink,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  Bookmark,
  BookmarkCheck,
  Share2,
  Sparkles,
  TrendingUp,
  User,
  Calendar,
  Tag,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { NewsArticle } from "@/types/news"
import { textSummarizer } from "@/lib/text-summarizer"
import { markArticleAsRead, isArticleRead, toggleBookmark, isArticleBookmarked, addReadingTime } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

interface EnhancedNewsCardProps {
  article: NewsArticle
  index: number
}

const categoryIcons: Record<string, string> = {
  business: "💼",
  technology: "💻",
  sports: "⚽",
  entertainment: "🎬",
  health: "🏥",
  science: "🔬",
  politics: "🏛️",
  world: "🌍",
  environment: "🌱",
  food: "🍽️",
  top: "⭐",
}

export function EnhancedNewsCard({ article, index }: EnhancedNewsCardProps) {
  const [summary, setSummary] = useState<string>("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRead, setIsRead] = useState(() => isArticleRead(article.article_id))
  const [isBookmarked, setIsBookmarked] = useState(() => isArticleBookmarked(article.article_id))
  const [readingTime, setReadingTime] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    // Calculate reading time
    const content = article.content || article.description || article.title
    const time = textSummarizer.getReadingTime(content)
    setReadingTime(time)
  }, [article])

  const handleSummarize = async () => {
    if (summary) return

    setIsLoading(true)
    try {
      const content = article.content || article.description || article.title
      if (!content) {
        throw new Error("No content available to summarize")
      }

      // Use our free text summarizer
      const result = textSummarizer.summarize(content, 2)
      const extractedKeywords = textSummarizer.extractKeywords(content, 4)

      setSummary(result)
      setKeywords(extractedKeywords)

      toast({
        title: "Summary generated! ✨",
        description: "AI summary has been created using advanced text analysis.",
      })
    } catch (error) {
      toast({
        title: "Summarization failed",
        description: error instanceof Error ? error.message : "Failed to generate summary",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = () => {
    markArticleAsRead(article.article_id)
    setIsRead(true)
    addReadingTime(readingTime)
    toast({
      title: "Article marked as read! 📖",
      description: `Added ${readingTime} min to your reading time.`,
    })
  }

  const handleBookmark = () => {
    const bookmarked = toggleBookmark({
      article_id: article.article_id,
      title: article.title,
      link: article.link,
      category: article.category || [],
      image_url: article.image_url,
    })

    setIsBookmarked(bookmarked)
    toast({
      title: bookmarked ? "Article bookmarked! 🔖" : "Bookmark removed",
      description: bookmarked ? "Added to your reading list." : "Removed from your reading list.",
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description || "Check out this news article",
          url: article.link,
        })
      } catch {
        // User cancelled sharing - no need to handle error
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(article.link)
        toast({
          title: "Link copied! 📋",
          description: "Article link has been copied to clipboard.",
        })
      } catch {
        toast({
          title: "Share failed",
          description: "Unable to share or copy link.",
          variant: "destructive",
        })
      }
    }
  }

  const getTimeAgo = (dateString: string) => {
    try {
      const now = new Date()
      const articleDate = new Date(dateString)
      const diffInHours = Math.floor((now.getTime() - articleDate.getTime()) / (1000 * 60 * 60))

      if (diffInHours < 1) return "Just now"
      if (diffInHours < 24) return `${diffInHours}h ago`
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    } catch {
      return ""
    }
  }

  return (
    <Card
      className={`
      group card-hover glass mobile-card animate-slide-up transition-all duration-500
      ${isRead ? "opacity-75 dark:opacity-60" : ""}
      hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10
    `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{getTimeAgo(article.pubDate)}</span>
              <Separator orientation="vertical" className="h-3" />
              <Clock className="h-3 w-3" />
              <span>{readingTime} min read</span>
            </div>

            <CardTitle className="line-clamp-2 text-lg leading-tight font-poppins group-hover:gradient-text transition-all duration-300">
              {article.title}
            </CardTitle>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className="h-8 w-8 glass hover:bg-blue-500/20 transition-all duration-300"
            >
              {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-blue-500" /> : <Bookmark className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleMarkAsRead}
              disabled={isRead}
              className="h-8 w-8 glass hover:bg-green-500/20 transition-all duration-300"
            >
              {isRead ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {article.category?.slice(0, 3).map((cat) => (
            <Badge
              key={cat}
              variant="secondary"
              className="text-xs glass hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300"
            >
              <span className="mr-1">{categoryIcons[cat] || "📰"}</span>
              {cat}
            </Badge>
          ))}
          {article.source_id && (
            <Badge variant="outline" className="text-xs glass">
              <TrendingUp className="mr-1 h-3 w-3" />
              {article.source_id}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {article.creator?.[0] && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate max-w-[150px]">{article.creator[0]}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {article.image_url && (
          <div className="aspect-video w-full overflow-hidden rounded-lg hover:scale-[1.02] transition-transform duration-300 relative">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
              }}
            />
          </div>
        )}

        {article.description && (
          <CardDescription className="line-clamp-3 leading-relaxed">{article.description}</CardDescription>
        )}

        {summary && (
          <div className="rounded-lg glass p-4 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <h4 className="font-semibold text-sm gradient-text">AI Summary</h4>
            </div>
            <p className="text-sm leading-relaxed">{summary}</p>

            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {keywords.map((keyword, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs glass hover:bg-purple-500/20 transition-colors">
                    <Tag className="mr-1 h-2 w-2" />
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            onClick={handleSummarize}
            disabled={isLoading || !!summary}
            size="sm"
            className={`
              transition-all duration-300 glass
              ${
                summary
                  ? "bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : summary ? (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Summary Ready
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Summary
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(article.link, "_blank", "noopener,noreferrer")}
            className="glass hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Read Full
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="glass hover:bg-blue-500/20 transition-all duration-300"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}