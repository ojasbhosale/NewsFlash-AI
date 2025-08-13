"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Clock, Zap, Globe, RefreshCw, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAPIUsageStats, resetAPILimits } from "@/lib/news-api"

interface UsageStats {
  used: number
  remaining: number
  total: number
  resetTime: Date
  percentage: number
}

export function RateLimitDisplay() {
  const [newsStats, setNewsStats] = useState<UsageStats | null>(null)
  const [summaryStats, setSummaryStats] = useState<UsageStats | null>(null)
  const [mounted, setMounted] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    setMounted(true)
    updateStats()

    // Update stats every 30 seconds
    const interval = setInterval(updateStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const updateStats = () => {
    try {
      const stats = getAPIUsageStats()
      setNewsStats(stats.news)
      setSummaryStats(stats.summary)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error updating stats:", error)
    }
  }

  const handleReset = (apiType?: "news" | "smmry") => {
    resetAPILimits(apiType)
    updateStats()
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-500"
    if (percentage >= 75) return "text-amber-500"
    return "text-green-500"
  }

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 90) return <XCircle className="h-4 w-4 text-red-500" />
    if (percentage >= 75) return <AlertCircle className="h-4 w-4 text-amber-500" />
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  if (!mounted) {
    return (
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 animate-pulse">
        <CardHeader>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-800/50 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-800 to-blue-600 dark:from-gray-100 dark:to-blue-300 bg-clip-text text-transparent">
                API Usage Monitor
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                Real-time tracking of API consumption
                {lastUpdated && (
                  <span className="block text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateStats()}
            className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* News API Usage */}
        {newsStats && (
          <div className="space-y-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">News API</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">NewsData.io Service</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(newsStats.percentage)}
                <Badge 
                  variant="outline" 
                  className="bg-white/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-600"
                >
                  {newsStats.used}/{newsStats.total}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Progress 
                value={newsStats.percentage} 
                className="h-3 bg-gray-200 dark:bg-gray-700"
              />
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>Resets: {newsStats.resetTime.toLocaleDateString()} at {newsStats.resetTime.toLocaleTimeString()}</span>
                </div>
                <span className={`font-bold ${getStatusColor(newsStats.percentage)}`}>
                  {newsStats.percentage.toFixed(1)}% used
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {newsStats.remaining} requests remaining
              </span>
              {process.env.NODE_ENV === 'development' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReset("news")}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                >
                  Reset (Dev)
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Summary API Usage */}
        {summaryStats && (
          <div className="space-y-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-purple-500" />
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Summary API</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">SMMRY + Local Fallback</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(summaryStats.percentage)}
                <Badge 
                  variant="outline" 
                  className="bg-white/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-600"
                >
                  {summaryStats.used}/{summaryStats.total}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Progress 
                value={summaryStats.percentage} 
                className="h-3 bg-gray-200 dark:bg-gray-700"
              />
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>Resets: {summaryStats.resetTime.toLocaleDateString()} at {summaryStats.resetTime.toLocaleTimeString()}</span>
                </div>
                <span className={`font-bold ${getStatusColor(summaryStats.percentage)}`}>
                  {summaryStats.percentage.toFixed(1)}% used
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {summaryStats.remaining} API calls remaining
              </span>
              {process.env.NODE_ENV === 'development' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReset("smmry")}
                  className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/30"
                >
                  Reset (Dev)
                </Button>
              )}
            </div>
          </div>
        )}

        
      </CardContent>
    </Card>
  )
}