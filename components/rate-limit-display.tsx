"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { rateLimiter } from "@/lib/rate-limiter"

export function RateLimitDisplay() {
  const [newsRemaining, setNewsRemaining] = useState(0)
  const [summaryRemaining, setSummaryRemaining] = useState(0)
  const [newsResetTime, setNewsResetTime] = useState<Date>(new Date())
  const [summaryResetTime, setSummaryResetTime] = useState<Date>(new Date())

  useEffect(() => {
    const updateLimits = () => {
      setNewsRemaining(rateLimiter.getRemainingRequests("news"))
      setSummaryRemaining(rateLimiter.getRemainingRequests("smmry"))
      setNewsResetTime(rateLimiter.getResetTime("news"))
      setSummaryResetTime(rateLimiter.getResetTime("smmry"))
    }

    updateLimits()
    const interval = setInterval(updateLimits, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const newsPercentage = (newsRemaining / 200) * 100
  const summaryPercentage = (summaryRemaining / 100) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4" />
          API Usage
        </CardTitle>
        <CardDescription>Daily limits for free tier APIs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>News API</span>
            <span>{newsRemaining}/200</span>
          </div>
          <Progress value={newsPercentage} className="h-2" />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Resets: {newsResetTime.toLocaleTimeString()}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Summary API</span>
            <span>{summaryRemaining}/100</span>
          </div>
          <Progress value={summaryPercentage} className="h-2" />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Resets: {summaryResetTime.toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
