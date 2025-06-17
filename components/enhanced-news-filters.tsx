"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, X, Filter, TrendingUp, Globe, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FilterOptions } from "@/types/news"
import { getUserPreferences, saveUserPreferences } from "@/lib/storage"

interface EnhancedNewsFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void
  isLoading?: boolean
}

const CATEGORIES = [
  { value: "top", label: "Top Stories", icon: "⭐", color: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400" },
  { value: "business", label: "Business", icon: "💼", color: "bg-blue-500/20 text-blue-700 dark:text-blue-400" },
  {
    value: "technology",
    label: "Technology",
    icon: "💻",
    color: "bg-purple-500/20 text-purple-700 dark:text-purple-400",
  },
  { value: "sports", label: "Sports", icon: "⚽", color: "bg-green-500/20 text-green-700 dark:text-green-400" },
  {
    value: "entertainment",
    label: "Entertainment",
    icon: "🎬",
    color: "bg-pink-500/20 text-pink-700 dark:text-pink-400",
  },
  { value: "health", label: "Health", icon: "🏥", color: "bg-red-500/20 text-red-700 dark:text-red-400" },
  { value: "science", label: "Science", icon: "🔬", color: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-400" },
  { value: "politics", label: "Politics", icon: "🏛️", color: "bg-gray-500/20 text-gray-700 dark:text-gray-400" },
  { value: "world", label: "World", icon: "🌍", color: "bg-teal-500/20 text-teal-700 dark:text-teal-400" },
  {
    value: "environment",
    label: "Environment",
    icon: "🌱",
    color: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  },
]

const COUNTRIES = [
  { value: "us", label: "United States", flag: "🇺🇸" },
  { value: "gb", label: "United Kingdom", flag: "🇬🇧" },
  { value: "ca", label: "Canada", flag: "🇨🇦" },
  { value: "au", label: "Australia", flag: "🇦🇺" },
  { value: "in", label: "India", flag: "🇮🇳" },
  { value: "de", label: "Germany", flag: "🇩🇪" },
  { value: "fr", label: "France", flag: "🇫🇷" },
  { value: "jp", label: "Japan", flag: "🇯🇵" },
  { value: "br", label: "Brazil", flag: "🇧🇷" },
  { value: "mx", label: "Mexico", flag: "🇲🇽" },
]

const TRENDING_SEARCHES = [
  "AI technology",
  "Climate change",
  "Space exploration",
  "Cryptocurrency",
  "Health breakthrough",
  "Sports championship",
  "Movie releases",
  "Stock market",
]

export function EnhancedNewsFilters({ onFiltersChange, isLoading }: EnhancedNewsFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [preferences, setPreferences] = useState(getUserPreferences())

  useEffect(() => {
    // Load user preferences on mount
    const prefs = getUserPreferences()
    setPreferences(prefs)

    // Apply preferred filters if no current filters
    if (Object.keys(filters).length === 0 && prefs.preferredCountries.length > 0) {
      const initialFilters = { country: prefs.preferredCountries[0] }
      setFilters(initialFilters)
      onFiltersChange(initialFilters)
    }
  }, [filters, onFiltersChange])

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      updateFilters({ q: searchQuery.trim() })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleTrendingSearch = (query: string) => {
    setSearchQuery(query)
    updateFilters({ q: query })
  }

  const handleCategorySelect = (category: string) => {
    updateFilters({ category: category === "all" ? undefined : category })

    // Save to preferences
    const updatedPrefs = {
      ...preferences,
      preferredCategories: category === "all" ? [] : [category],
    }
    setPreferences(updatedPrefs)
    saveUserPreferences(updatedPrefs)
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery("")
    onFiltersChange({})
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search breaking news, topics, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 glass border-0 bg-white/50 dark:bg-black/20 backdrop-blur-sm h-12 text-base mobile-text"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Trending Searches */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Trending:
          </span>
          {TRENDING_SEARCHES.slice(0, 4).map((trend) => (
            <Button
              key={trend}
              variant="ghost"
              size="sm"
              onClick={() => handleTrendingSearch(trend)}
              className="h-6 px-2 text-xs glass hover:bg-blue-500/20 transition-all duration-300"
              disabled={isLoading}
            >
              {trend}
            </Button>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass">
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="countries" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Countries
          </TabsTrigger>
          <TabsTrigger value="quick" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category.value}
                variant={filters.category === category.value ? "default" : "outline"}
                onClick={() => handleCategorySelect(category.value)}
                disabled={isLoading}
                className={`
                  h-auto p-3 flex flex-col items-center gap-2 glass transition-all duration-300
                  ${
                    filters.category === category.value
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : "hover:bg-white/30 dark:hover:bg-black/30"
                  }
                `}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-xs font-medium">{category.label}</span>
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="countries" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {COUNTRIES.map((country) => (
              <Button
                key={country.value}
                variant={filters.country === country.value ? "default" : "outline"}
                onClick={() => updateFilters({ country: country.value })}
                disabled={isLoading}
                className={`
                  h-auto p-3 flex flex-col items-center gap-2 glass transition-all duration-300
                  ${
                    filters.country === country.value
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : "hover:bg-white/30 dark:hover:bg-black/30"
                  }
                `}
              >
                <span className="text-lg">{country.flag}</span>
                <span className="text-xs font-medium">{country.label}</span>
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quick" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={() => updateFilters({ category: "top" })}
              disabled={isLoading}
              className="h-16 glass hover:bg-yellow-500/20 transition-all duration-300"
              variant="outline"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">⭐</span>
                <span className="text-xs">Top Stories</span>
              </div>
            </Button>

            <Button
              onClick={() => updateFilters({ category: "technology" })}
              disabled={isLoading}
              className="h-16 glass hover:bg-purple-500/20 transition-all duration-300"
              variant="outline"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">💻</span>
                <span className="text-xs">Tech News</span>
              </div>
            </Button>

            <Button
              onClick={() => updateFilters({ category: "business" })}
              disabled={isLoading}
              className="h-16 glass hover:bg-blue-500/20 transition-all duration-300"
              variant="outline"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">💼</span>
                <span className="text-xs">Business</span>
              </div>
            </Button>

            <Button
              onClick={() => updateFilters({ category: "sports" })}
              disabled={isLoading}
              className="h-16 glass hover:bg-green-500/20 transition-all duration-300"
              variant="outline"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">⚽</span>
                <span className="text-xs">Sports</span>
              </div>
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-4 glass rounded-lg">
          <span className="text-sm font-medium">Active filters:</span>
          {filters.category && (
            <Badge variant="secondary" className="glass">
              {CATEGORIES.find((c) => c.value === filters.category)?.icon}{" "}
              {CATEGORIES.find((c) => c.value === filters.category)?.label}
            </Badge>
          )}
          {filters.country && (
            <Badge variant="secondary" className="glass">
              {COUNTRIES.find((c) => c.value === filters.country)?.flag}{" "}
              {COUNTRIES.find((c) => c.value === filters.country)?.label}
            </Badge>
          )}
          {filters.q && (
            <Badge variant="secondary" className="glass">
              🔍 {filters.q}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            disabled={isLoading}
            className="ml-auto glass hover:bg-red-500/20 text-red-600 dark:text-red-400"
          >
            <X className="mr-1 h-3 w-3" />
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
