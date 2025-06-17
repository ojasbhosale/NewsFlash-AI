"use client"

import { useState, useEffect } from "react"
import { BookOpen, Clock, Target, Award, BarChart3, Flame } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getReadingStats, getUserPreferences, type ReadingStats } from "@/lib/storage"

export function ReadingStatsDashboard() {
  const [stats, setStats] = useState<ReadingStats | null>(null)
  const [preferences, setPreferences] = useState(getUserPreferences())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateStats = () => {
      setStats(getReadingStats())
      setPreferences(getUserPreferences())
    }

    updateStats()
    const interval = setInterval(updateStats, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  // Don't render until mounted to avoid hydration issues
  if (!mounted || !stats) {
    return (
      <div className="space-y-4">
        <Card className="glass animate-pulse">
          <CardHeader className="pb-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-3 bg-muted rounded mb-2"></div>
            <div className="flex justify-between">
              <div className="h-3 bg-muted rounded w-1/4"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progressToday = Math.min((stats.articlesReadToday / preferences.readingGoal) * 100, 100)
  const topCategories = Object.entries(stats.favoriteCategories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  return (
    <div className="space-y-4 animate-slide-in-up">
      {/* Today's Progress */}
      <Card className="glass border-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            Today&apos;s Goal
          </CardTitle>
          <CardDescription>
            {stats.articlesReadToday} of {preferences.readingGoal} articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressToday} className="h-3 mb-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="font-medium">{Math.round(progressToday)}% complete</span>
            <span>{Math.max(0, preferences.readingGoal - stats.articlesReadToday)} remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Reading Streak */}
      <Card className="glass border-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <Flame className="h-4 w-4 text-white" />
            </div>
            Reading Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold gradient-text">{stats.readingStreak}</div>
            <div>
              <p className="text-sm font-medium">{stats.readingStreak === 1 ? "day" : "days"} in a row</p>
              <p className="text-xs text-muted-foreground">Keep it up! 🔥</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="glass border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text">{stats.totalArticlesRead}</div>
                <p className="text-xs text-muted-foreground">Total Read</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text">{stats.totalReadingTime}</div>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      {topCategories.length > 0 && (
        <Card className="glass border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              Top Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCategories.map(([category, count], index) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"}`}
                  ></div>
                  <span className="text-sm capitalize font-medium">{category}</span>
                </div>
                <Badge variant="secondary" className="glass text-xs">
                  {count}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Achievement Badges */}
      <Card className="glass border-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
              <Award className="h-4 w-4 text-white" />
            </div>
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {stats.totalArticlesRead >= 1 && (
              <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                📚 First Read
              </Badge>
            )}
            {stats.totalArticlesRead >= 10 && (
              <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                🎓 Scholar
              </Badge>
            )}
            {stats.readingStreak >= 3 && (
              <Badge className="bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                🔥 Streak Master
              </Badge>
            )}
            {stats.totalReadingTime >= 30 && (
              <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                ⏰ Time Reader
              </Badge>
            )}
            {stats.totalArticlesRead >= 50 && (
              <Badge className="bg-pink-500/20 text-pink-700 dark:text-pink-400 border border-pink-200 dark:border-pink-800">
                🏆 News Expert
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
