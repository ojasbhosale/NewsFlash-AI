"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, ArrowLeft, TrendingUp, Clock, Target, Award, Calendar, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PremiumNavbar } from "@/components/premium-navbar"
import { getReadingStats, getUserPreferences, getReadArticles, type ReadingStats } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

interface ReadActivity {
  article_id: string;
  readAt: string;
  title?: string;
  category?: string;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<ReadingStats | null>(null)
  const [preferences, setPreferences] = useState(getUserPreferences())
  const [recentActivity, setRecentActivity] = useState<ReadActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const loadAnalytics = useCallback(() => {
    setIsLoading(true)
    try {
      const readingStats = getReadingStats()
      const userPrefs = getUserPreferences()
      const readArticles = getReadArticles()

      setStats(readingStats)
      setPreferences(userPrefs)
      setRecentActivity(readArticles.slice(-10).reverse()) // Last 10 articles
    } catch {
      toast({
        title: "❌ Error Loading Analytics",
        description: "Failed to load your reading statistics.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  const handleSearch = (query: string) => {
    router.push(`/news?q=${encodeURIComponent(query)}`)
  }

  const handleShowBookmarks = () => {
    router.push("/bookmarks")
  }

  if (!stats) return null

  const progressToday = Math.min((stats.articlesReadToday / preferences.readingGoal) * 100, 100)
  const topCategories = Object.entries(stats.favoriteCategories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <PremiumNavbar
        onSearch={handleSearch}
        onShowBookmarks={handleShowBookmarks}
        onShowStats={() => {}}
        currentPath="/analytics"
      />

      <main className="pt-20">
        <div className="container mx-auto mobile-padding py-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/news")}
              className="glass hover:bg-white/30 dark:hover:bg-black/30 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </div>

          {/* Page Header */}
          <div className="text-center space-y-4 py-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-headline gradient-text">Reading Analytics</h1>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Track your reading progress and discover your news consumption patterns
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-spin mx-auto">
                  <div className="absolute inset-2 rounded-full bg-background"></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-title gradient-text">Loading Analytics</h3>
                  <p className="text-caption">Analyzing your reading patterns...</p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Stats */}
              <div className="lg:col-span-2 space-y-8">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="glass border-0 animate-slide-in-up">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold gradient-text">{stats.totalArticlesRead}</div>
                          <p className="text-sm text-muted-foreground">Total Articles</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-0 animate-slide-in-up" style={{ animationDelay: "100ms" }}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold gradient-text">{stats.totalReadingTime}</div>
                          <p className="text-sm text-muted-foreground">Minutes Read</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-0 animate-slide-in-up" style={{ animationDelay: "200ms" }}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold gradient-text">{stats.readingStreak}</div>
                          <p className="text-sm text-muted-foreground">Day Streak</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-0 animate-slide-in-up" style={{ animationDelay: "300ms" }}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold gradient-text">{stats.articlesReadToday}</div>
                          <p className="text-sm text-muted-foreground">Today&apos;s Count</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Daily Goal */}
                  <Card className="glass border-0 animate-slide-in-up" style={{ animationDelay: "400ms" }}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-500" />
                        Daily Goal Progress
                      </CardTitle>
                      <CardDescription>
                        {stats.articlesReadToday} of {preferences.readingGoal} articles today
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
                  <Card className="glass border-0 animate-slide-in-up" style={{ animationDelay: "500ms" }}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-orange-500" />
                        Reading Consistency
                      </CardTitle>
                      <CardDescription>Your current reading streak</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold gradient-text">{stats.readingStreak}</div>
                        <div>
                          <p className="font-medium">{stats.readingStreak === 1 ? "day" : "days"} in a row</p>
                          <p className="text-sm text-muted-foreground">Keep it up! 🔥</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Categories */}
                {topCategories.length > 0 && (
                  <Card className="glass border-0 animate-slide-in-up" style={{ animationDelay: "600ms" }}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-500" />
                        Favorite Categories
                      </CardTitle>
                      <CardDescription>Your most read news categories</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {topCategories.map(([category, count], index) => (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                index === 0
                                  ? "bg-yellow-500"
                                  : index === 1
                                    ? "bg-gray-400"
                                    : index === 2
                                      ? "bg-orange-500"
                                      : "bg-blue-500"
                              }`}
                            ></div>
                            <span className="capitalize font-medium">{category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="glass">
                              {count} articles
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Achievements */}
                <Card className="glass border-0 animate-slide-in-up" style={{ animationDelay: "700ms" }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.totalArticlesRead >= 1 && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                          <span className="text-2xl">📚</span>
                          <div>
                            <p className="font-medium text-blue-700 dark:text-blue-400">First Read</p>
                            <p className="text-xs text-blue-600 dark:text-blue-500">Read your first article</p>
                          </div>
                        </div>
                      )}

                      {stats.totalArticlesRead >= 10 && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-200 dark:border-purple-800">
                          <span className="text-2xl">🎓</span>
                          <div>
                            <p className="font-medium text-purple-700 dark:text-purple-400">Scholar</p>
                            <p className="text-xs text-purple-600 dark:text-purple-500">Read 10+ articles</p>
                          </div>
                        </div>
                      )}

                      {stats.readingStreak >= 3 && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-200 dark:border-orange-800">
                          <span className="text-2xl">🔥</span>
                          <div>
                            <p className="font-medium text-orange-700 dark:text-orange-400">Streak Master</p>
                            <p className="text-xs text-orange-600 dark:text-orange-500">3+ day reading streak</p>
                          </div>
                        </div>
                      )}

                      {stats.totalReadingTime >= 30 && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-200 dark:border-green-800">
                          <span className="text-2xl">⏰</span>
                          <div>
                            <p className="font-medium text-green-700 dark:text-green-400">Time Reader</p>
                            <p className="text-xs text-green-600 dark:text-green-500">30+ minutes reading</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                {recentActivity.length > 0 && (
                  <Card className="glass border-0 animate-slide-in-up" style={{ animationDelay: "800ms" }}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-indigo-500" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentActivity.slice(0, 5).map((activity) => (
                          <div key={activity.article_id} className="flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <div className="flex-1">
                              <p className="text-muted-foreground">
                                Read article {new Date(activity.readAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card className="glass border-0 animate-slide-in-up" style={{ animationDelay: "900ms" }}>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={() => router.push("/news")}
                      className="w-full justify-start glass hover:bg-blue-500/20"
                      variant="ghost"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Read More News
                    </Button>
                    <Button
                      onClick={() => router.push("/bookmarks")}
                      className="w-full justify-start glass hover:bg-purple-500/20"
                      variant="ghost"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Bookmarks
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}