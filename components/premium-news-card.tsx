"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
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
  ArrowUpRight,
} from "lucide-react"
import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { NewsArticle } from "@/types/news"
// import { summarizeArticle } from "@/lib/news-api"
import { textSummarizer } from "@/lib/text-summarizer"
import { markArticleAsRead, isArticleRead, toggleBookmark, isArticleBookmarked, addReadingTime } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

interface PremiumNewsCardProps {
  article: NewsArticle
  index: number
}

const categoryConfig: Record<string, { icon: string; color: string }> = {
  business: {
    icon: "💼",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  technology: {
    icon: "💻",
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  },
  sports: {
    icon: "⚽",
    color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  entertainment: {
    icon: "🎬",
    color: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800",
  },
  health: { icon: "🏥", color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800" },
  science: {
    icon: "🔬",
    color: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  },
  politics: {
    icon: "🏛️",
    color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800",
  },
  world: { icon: "🌍", color: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800" },
  environment: {
    icon: "🌱",
    color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  food: {
    icon: "🍽️",
    color: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  },
  top: {
    icon: "⭐",
    color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  },
}

export function PremiumNewsCard({ article, index }: PremiumNewsCardProps) {
  const [summary, setSummary] = useState<string>("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRead, setIsRead] = useState(() => isArticleRead(article.article_id))
  const [isBookmarked, setIsBookmarked] = useState(() => isArticleBookmarked(article.article_id))
  const [readingTime, setReadingTime] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    const content = article.content || article.description || article.title
    const time = textSummarizer.getReadingTime(content)
    setReadingTime(time)
  }, [article])

  const handleSummarize = async () => {
    
    if (summary) return

    console.log("🧠 Starting summarization for article:", article.description)

    setIsLoading(true)
    try {
      let content = article.content

// If content is missing or looks fake/garbled, fallback to description or title
if (
  !content ||
  content.length < 50 || // Too short
  content.includes("ONLY AVAILABLE IN PAID PLANS") 
) {
  content = article.description || article.title
}


      
      


      // const result = await summarizeArticle(content)
      const result = article.description || article.title
      const extractedKeywords = textSummarizer.extractKeywords(content, 4)

  console.log("📜 Summarized content:", result)
      console.log("🔑 Extracted keywords:", extractedKeywords)

      setSummary(result)
      setKeywords(extractedKeywords)

      toast({
        title: "✨ Summary Generated!",
        description: "AI analysis complete using advanced text processing.",
      })
    } catch (error) {
      toast({
        title: "❌ Summarization Failed",
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
      title: "📖 Article Marked as Read!",
      description: `Added ${readingTime} minutes to your reading time.`,
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
      title: bookmarked ? "🔖 Article Bookmarked!" : "📝 Bookmark Removed",
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
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(article.link)
        toast({
          title: "📋 Link Copied!",
          description: "Article link has been copied to clipboard.",
        })
      } catch (error) {
        console.error("Failed to copy link:", error)
        toast({
          title: "❌ Share Failed",
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

  const primaryCategory = article.category?.[0] || "top"
  const categoryStyle = categoryConfig[primaryCategory] || categoryConfig.top

  return (
    <Card
      className={`
        card-premium glass border-0 overflow-hidden
        ${isRead ? "opacity-60" : ""}
        animate-slide-in-up
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Article Image */}
      {article.image_url && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={article.image_url || "/placeholder.svg"}
            alt={article.title}
            width={800} 
            height={450} 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            style={{ objectFit: "cover" }}
            unoptimized={false} 
            priority={index === 0} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Floating Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className="glass w-10 h-10 hover:bg-white/20 backdrop-blur-sm"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-blue-400" />
              ) : (
                <Bookmark className="w-4 h-4 text-white" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="glass w-10 h-10 hover:bg-white/20 backdrop-blur-sm"
            >
              <Share2 className="w-4 h-4 text-white" />
            </Button>
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-4 left-4">
            <Badge className={`${categoryStyle.color} border font-medium`}>
              <span className="mr-1">{categoryStyle.icon}</span>
              {primaryCategory}
            </Badge>
          </div>
        </div>
      )}

      <CardHeader className="space-y-4">
        {/* Article Meta */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{getTimeAgo(article.pubDate)}</span>
            </div>
            <Separator orientation="vertical" className="h-3" />
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAsRead}
            disabled={isRead}
            className="h-8 px-3 glass hover:bg-green-500/20"
          >
            {isRead ? (
              <>
                <Eye className="w-3 h-3 mr-1 text-green-500" />
                <span className="text-xs">Read</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3 mr-1" />
                <span className="text-xs">Mark Read</span>
              </>
            )}
          </Button>
        </div>

        {/* Article Title */}
        <CardTitle className="text-title leading-tight hover:gradient-text transition-all duration-300 cursor-pointer">
          {article.title}
        </CardTitle>

        {/* Article Description */}
        {/* {article.description && (
          <CardDescription className="text-body line-clamp-2 leading-relaxed">{article.description}</CardDescription>
        )} */}

        {/* Author & Source */}
        {(article.creator?.[0] || article.source_id) && (
          <div className="flex items-center gap-4 text-caption">
            {article.creator?.[0] && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="truncate max-w-[150px]">{article.creator[0]}</span>
              </div>
            )}
            {article.source_id && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{article.source_id}</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AI Summary */}
        {summary && (
          <div className="glass p-4 rounded-xl space-y-3 animate-scale-in">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <h4 className="font-semibold text-sm gradient-text">AI Summary</h4>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>

            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {keywords.map((keyword, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs glass hover:bg-purple-500/20 transition-colors">
                    <Tag className="mr-1 w-2 h-2" />
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleSummarize}
            disabled={isLoading || !!summary}
            className={`
              flex-1 min-w-[140px] transition-all duration-300
              ${
                summary
                  ? "bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30 border border-green-200 dark:border-green-800"
                  : "btn-premium text-white"
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : summary ? (
              <>
                <Sparkles className="mr-2 w-4 h-4" />
                Summary Ready
              </>
            ) : (
              <>
                <Sparkles className="mr-2 w-4 h-4" />
                Generate Summary
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => window.open(article.link, "_blank", "noopener,noreferrer")}
            className="glass hover:bg-white/30 dark:hover:bg-black/30 border-0"
          >
            <span className="mr-2">Read Full</span>
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
