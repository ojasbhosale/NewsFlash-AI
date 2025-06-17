"use client"

import { useState } from "react"
import Image from "next/image"
import { ExternalLink, Clock, Eye, EyeOff, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { NewsArticle } from "@/types/news"
import { summarizeArticle } from "@/lib/news-api"
import { markArticleAsRead, isArticleRead } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

interface NewsCardProps {
  article: NewsArticle
}

export function NewsCard({ article }: NewsCardProps) {
  const [summary, setSummary] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRead, setIsRead] = useState(() => isArticleRead(article.article_id))
  const { toast } = useToast()

  const handleSummarize = async () => {
    if (summary) return // Already summarized

    setIsLoading(true)
    try {
      const content = article.content || article.description || article.title
      if (!content) {
        throw new Error("No content available to summarize")
      }

      const result = await summarizeArticle(content)
      setSummary(result)
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
    toast({
      title: "Article marked as read",
      description: "This article has been added to your read list.",
    })
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
    <Card className={`transition-all duration-200 hover:shadow-lg ${isRead ? "opacity-75" : ""}`}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="line-clamp-2 text-lg leading-tight">{article.title}</CardTitle>
          <Button variant={isRead ? "secondary" : "outline"} size="sm" onClick={handleMarkAsRead} disabled={isRead}>
            {isRead ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {article.category?.map((cat) => (
            <Badge key={cat} variant="outline" className="text-xs">
              {cat}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(article.pubDate)}
          </div>
          {article.creator?.[0] && <span>by {article.creator[0]}</span>}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
          <div className="aspect-video w-full overflow-hidden rounded-md relative">
            <Image
              src={article.image_url || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover transition-transform hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
              }}
            />
          </div>

        {article.description && <CardDescription className="line-clamp-3">{article.description}</CardDescription>}

        {summary && (
          <div className="rounded-md bg-muted p-3">
            <h4 className="mb-2 font-semibold text-sm">AI Summary:</h4>
            <p className="text-sm leading-relaxed">{summary}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleSummarize}
            disabled={isLoading || !!summary}
            size="sm"
            variant={summary ? "secondary" : "default"}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : summary ? (
              "Summary Generated"
            ) : (
              "Generate Summary"
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(article.link, "_blank", "noopener,noreferrer")}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Read Full Article
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
