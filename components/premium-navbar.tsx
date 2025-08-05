"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Menu, Search, Bell, BookOpen, BarChart3, Newspaper, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { getReadingStats } from "@/lib/storage"
import { useRouter } from "next/navigation"

interface PremiumNavbarProps {
  onSearch?: (query: string) => void
  onShowBookmarks?: () => void
  onShowStats?: () => void
  currentPath?: string
}

// Default stats to prevent hydration mismatch
const defaultStats = {
  totalArticlesRead: 0,
  readingStreak: 0,
  articlesReadToday: 0,
  lastReadDate: ""
}

export function PremiumNavbar({ onSearch, onShowStats, currentPath = "/" }: PremiumNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState(defaultStats)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
    setStats(getReadingStats())
  }, [])

  useEffect(() => {
    if (!isClient) return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isClient])

  useEffect(() => {
    if (!isClient) return

    const interval = setInterval(() => {
      setStats(getReadingStats())
    }, 30000)

    return () => clearInterval(interval)
  }, [isClient])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim())
      setSearchQuery("")
    }
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMobileMenuOpen(false)
  }

  const handleStatsClick = () => {
    onShowStats?.()
  }

  const navigationItems = [
    { path: "/news", label: "News", icon: Newspaper },
    { path: "/bookmarks", label: "Bookmarks", icon: BookOpen },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
  ]

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            isScrolled
              ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm"
              : "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl"
          }
        `}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center ">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse-glow"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black gradient-text">NewsFlash</h1>
                <p className="text-xs text-muted-foreground -mt-1">AI Powered</p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPath === item.path

                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      relative px-4 py-2 rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                    )}
                  </Button>
                )
              })}
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-9 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-lg"
                />
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Reading Stats - Desktop Only */}
              {isClient && stats.totalArticlesRead > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStatsClick}
                  className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm font-medium">{stats.totalArticlesRead}</span>
                  {stats.readingStreak > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                    >
                      {stats.readingStreak}🔥
                    </Badge>
                  )}
                </Button>
              )}

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative w-9 h-9 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <Bell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Menu Trigger */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden w-9 h-9 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-80 p-0 bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800"
                >
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <SheetHeader className="p-6 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">N</span>
                          </div>
                          <SheetTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            NewsFlash
                          </SheetTitle>
                        </div>
                      </div>
                    </SheetHeader>

                    {/* Mobile Search */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                      <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search news..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 h-10 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg"
                        />
                      </form>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex-1 p-6">
                      <div className="space-y-2">
                        {navigationItems.map((item) => {
                          const Icon = item.icon
                          const isActive = currentPath === item.path

                          return (
                            <Button
                              key={item.path}
                              variant="ghost"
                              onClick={() => handleNavigation(item.path)}
                              className={`
                                w-full justify-start h-12 px-4 rounded-lg transition-all duration-200
                                ${
                                  isActive
                                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                }
                              `}
                            >
                              <Icon className="w-5 h-5 mr-3" />
                              <span className="font-medium">{item.label}</span>
                            </Button>
                          )
                        })}
                      </div>

                      {/* Mobile Stats */}
                      {isClient && stats.totalArticlesRead > 0 && (
                        <>
                          <Separator className="my-6" />
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Reading Stats</h3>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Articles Read</span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                  {stats.totalArticlesRead}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Reading Streak</span>
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {stats.readingStreak}
                                  </span>
                                  {stats.readingStreak > 0 && <span className="text-sm">🔥</span>}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Today&apos;s Goal</span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                  {stats.articlesReadToday}/5
                                </span>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleNavigation("/analytics")}
                              variant="outline"
                              size="sm"
                              className="w-full mt-4 h-9"
                            >
                              <BarChart3 className="w-4 h-4 mr-2" />
                              View Analytics
                            </Button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Mobile Footer */}
                    <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>NewsFlash AI</span>
                        <span>v0.3.0</span>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16"></div>
    </>
  )
}