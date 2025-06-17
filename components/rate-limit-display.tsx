"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Clock, Zap, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { rateLimiter } from "@/lib/rate-limiter"

export function RateLimitDisplay() {
  const [newsRemaining, setNewsRemaining] = useState(200)
  const [newsResetTime, setNewsResetTime] = useState<Date>(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateLimits = () => {
      setNewsRemaining(rateLimiter.getRemainingRequests("news"))
  
      setNewsResetTime(rateLimiter.getResetTime("news"))
    }

    updateLimits()
    const interval = setInterval(updateLimits, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return (
      <Card className="glass border-0 animate-pulse">
        <CardHeader>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded"></div>
            <div className="h-2 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const newsPercentage = (newsRemaining / 200) * 100
  

  return (
    <Card className="glass border-0 animate-slide-in-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
          API Usage
        </CardTitle>
        <CardDescription>Daily limits for free tier APIs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* News API Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <span className="font-medium">News API</span>
            </div>
            <Badge variant="outline" className="glass">
              {newsRemaining}/200
            </Badge>
          </div>
          <Progress value={newsPercentage} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Resets: {newsResetTime.toLocaleTimeString()}</span>
            </div>
            <span className="font-medium">{Math.round(newsPercentage)}% used</span>
          </div>
        </div>

        {/* Summary API Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Summary API</span>
            </div>
            <Badge variant="outline" className="glass">
              Free/Unlimited
            </Badge>
          </div>
          <Progress value={100} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Client-side processing</span>
            <span className="font-medium text-green-600 dark:text-green-400">No limits! ✨</span>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            💡 <strong>Pro tip:</strong> Our AI summaries are processed locally, so you can generate unlimited summaries
            without using any API quota!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
