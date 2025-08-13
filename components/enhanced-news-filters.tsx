"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, X, Filter, TrendingUp, Globe, Zap, Languages, ChevronDown, Check } from "lucide-react"
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
  { value: "top", label: "Top Stories", icon: "⭐", color: "from-amber-400 to-yellow-500" },
  { value: "business", label: "Business", icon: "💼", color: "from-blue-400 to-cyan-500" },
  { value: "technology", label: "Technology", icon: "💻", color: "from-purple-400 to-pink-500" },
  { value: "sports", label: "Sports", icon: "⚽", color: "from-green-400 to-emerald-500" },
  { value: "entertainment", label: "Entertainment", icon: "🎬", color: "from-pink-400 to-rose-500" },
  { value: "health", label: "Health", icon: "🏥", color: "from-red-400 to-pink-500" },
  { value: "science", label: "Science", icon: "🔬", color: "from-indigo-400 to-purple-500" },
  { value: "politics", label: "Politics", icon: "🏛️", color: "from-gray-400 to-slate-500" },
  { value: "world", label: "World", icon: "🌍", color: "from-teal-400 to-cyan-500" },
  { value: "environment", label: "Environment", icon: "🌱", color: "from-emerald-400 to-green-500" },
]

const COUNTRIES = [
  { value: "in", label: "India", flag: "🇮🇳" },
  { value: "us", label: "United States", flag: "🇺🇸" },
  { value: "gb", label: "United Kingdom", flag: "🇬🇧" },
  { value: "ca", label: "Canada", flag: "🇨🇦" },
  { value: "au", label: "Australia", flag: "🇦🇺" },
  { value: "de", label: "Germany", flag: "🇩🇪" },
  { value: "fr", label: "France", flag: "🇫🇷" },
  { value: "jp", label: "Japan", flag: "🇯🇵" },
  { value: "br", label: "Brazil", flag: "🇧🇷" },
  { value: "mx", label: "Mexico", flag: "🇲🇽" },
]

const LANGUAGES = [
  { value: "en", label: "English", native: "English", flag: "🇺🇸", gradient: "from-blue-400 to-indigo-500", accent: "bg-blue-500" },
  { value: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳", gradient: "from-orange-400 to-red-500", accent: "bg-orange-500" },
  { value: "mr", label: "Marathi", native: "मराठी", flag: "🇮🇳", gradient: "from-amber-400 to-orange-500", accent: "bg-amber-500" },
  { value: "gu", label: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳", gradient: "from-green-400 to-emerald-500", accent: "bg-green-500" },
  { value: "ta", label: "Tamil", native: "தமிழ்", flag: "🇮🇳", gradient: "from-red-400 to-pink-500", accent: "bg-red-500" },
  { value: "te", label: "Telugu", native: "తెలుగు", flag: "🇮🇳", gradient: "from-purple-400 to-violet-500", accent: "bg-purple-500" },
  { value: "kn", label: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳", gradient: "from-yellow-400 to-amber-500", accent: "bg-yellow-500" },
  { value: "bn", label: "Bengali", native: "বাংলা", flag: "🇮🇳", gradient: "from-teal-400 to-cyan-500", accent: "bg-teal-500" },
  { value: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳", gradient: "from-pink-400 to-rose-500", accent: "bg-pink-500" },
  { value: "ur", label: "Urdu", native: "اردو", flag: "🇵🇰", gradient: "from-emerald-400 to-teal-500", accent: "bg-emerald-500" },
  { value: "es", label: "Spanish", native: "Español", flag: "🇪🇸", gradient: "from-red-400 to-orange-500", accent: "bg-red-500" },
  { value: "fr", label: "French", native: "Français", flag: "🇫🇷", gradient: "from-blue-400 to-purple-500", accent: "bg-blue-500" }
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
  const [showAllLanguages, setShowAllLanguages] = useState(false)

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

  const handleLanguageSelect = (language: string) => {
    updateFilters({ language: language === "all" ? undefined : language })

    // Save to preferences
    const updatedPrefs = {
      ...preferences,
      preferredLanguage: language === "all" ? "en" : language,
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
  const displayLanguages = showAllLanguages ? LANGUAGES : LANGUAGES.slice(0, 4)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Language Filter - Mobile First Design */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 p-4 sm:p-6 border border-blue-100 dark:border-blue-800/30">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <Languages className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 dark:from-gray-100 dark:to-blue-300 bg-clip-text text-transparent">
              Choose Your Language
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Get news in your preferred language
            </p>
          </div>
        </div>
        
        {/* Language Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {displayLanguages.map((language) => (
            <Button
              key={language.value}
              variant="ghost"
              onClick={() => handleLanguageSelect(language.value)}
              disabled={isLoading}
              className={`
                group relative h-20 sm:h-24 p-3 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 border-2
                ${
                  filters.language === language.value
                    ? `bg-gradient-to-br ${language.gradient} text-white shadow-lg shadow-black/20 border-white/20`
                    : "bg-white/70 hover:bg-white dark:bg-gray-800/70 dark:hover:bg-gray-800 border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600"
                }
              `}
            >
              {/* Background Animation */}
              <div className={`
                absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300
                bg-gradient-to-br ${language.gradient}
              `} />
              
              {/* Content */}
              <div className="relative flex flex-col items-center gap-1.5 sm:gap-2 h-full justify-center">
                <span className="text-xl sm:text-2xl filter drop-shadow-sm">{language.flag}</span>
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-bold leading-tight">{language.label}</div>
                  <div className="text-[10px] sm:text-xs opacity-80 leading-tight font-medium">
                    {language.native}
                  </div>
                </div>
              </div>
              
              {/* Selection Indicator */}
              {filters.language === language.value && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
              )}
            </Button>
          ))}
        </div>

        {/* Show More/Less Button */}
        {LANGUAGES.length > 8 && (
          <div className="flex justify-center mt-4">
            <Button
              variant="outline" 
              size="sm"
              onClick={() => setShowAllLanguages(!showAllLanguages)}
              className="bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 border-gray-200 hover:border-gray-300"
            >
              <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${showAllLanguages ? 'rotate-180' : ''}`} />
              {showAllLanguages ? 'Show Less' : `Show All ${LANGUAGES.length} Languages`}
            </Button>
          </div>
        )}
      </div>

      {/* Search Bar - Mobile Optimized */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search breaking news, topics, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 h-12 sm:h-14 text-base bg-white/80 dark:bg-gray-800/80 border-gray-200 hover:border-gray-300 focus:border-blue-400 dark:border-gray-700 dark:hover:border-gray-600 dark:focus:border-blue-500 rounded-xl"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="h-12 sm:h-14 px-6 sm:px-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-xl font-medium shadow-lg"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Trending Searches - Mobile Scrollable */}
        <div className="flex items-start gap-2">
          <span className="text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap mt-1">
            <TrendingUp className="h-3 w-3" />
            Trending:
          </span>
          <div className="flex flex-wrap sm:flex-nowrap gap-2 overflow-x-auto pb-1">
            {TRENDING_SEARCHES.slice(0, 6).map((trend) => (
              <Button
                key={trend}
                variant="ghost"
                size="sm"
                onClick={() => handleTrendingSearch(trend)}
                className="h-7 px-3 text-xs bg-gray-100 hover:bg-blue-100 dark:bg-gray-800 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 whitespace-nowrap rounded-full font-medium transition-all duration-200"
                disabled={isLoading}
              >
                {trend}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs - Mobile Optimized */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <TabsTrigger value="categories" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="countries" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Countries</span>
          </TabsTrigger>
          <TabsTrigger value="quick" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Quick</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {CATEGORIES.map((category) => (
              <Button
                key={category.value}
                variant={filters.category === category.value ? "default" : "outline"}
                onClick={() => handleCategorySelect(category.value)}
                disabled={isLoading}
                className={`
                  h-auto p-3 sm:p-4 flex flex-col items-center gap-2 rounded-xl transition-all duration-300 border-2
                  ${
                    filters.category === category.value
                      ? `bg-gradient-to-br ${category.color} text-white shadow-lg border-white/20`
                      : "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }
                `}
              >
                <span className="text-lg sm:text-xl">{category.icon}</span>
                <span className="text-xs sm:text-sm font-medium text-center leading-tight">{category.label}</span>
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="countries" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {COUNTRIES.map((country) => (
              <Button
                key={country.value}
                variant={filters.country === country.value ? "default" : "outline"}
                onClick={() => updateFilters({ country: country.value })}
                disabled={isLoading}
                className={`
                  h-auto p-3 sm:p-4 flex flex-col items-center gap-2 rounded-xl transition-all duration-300 border-2
                  ${
                    filters.country === country.value
                      ? "bg-gradient-to-br from-green-400 to-blue-500 text-white shadow-lg border-white/20"
                      : "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }
                `}
              >
                <span className="text-lg sm:text-xl">{country.flag}</span>
                <span className="text-xs sm:text-sm font-medium text-center leading-tight">{country.label}</span>
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quick" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { category: "top", icon: "⭐", label: "Top Stories", color: "hover:bg-amber-100 dark:hover:bg-amber-900/20" },
              { category: "technology", icon: "💻", label: "Tech News", color: "hover:bg-purple-100 dark:hover:bg-purple-900/20" },
              { category: "business", icon: "💼", label: "Business", color: "hover:bg-blue-100 dark:hover:bg-blue-900/20" },
              { category: "sports", icon: "⚽", label: "Sports", color: "hover:bg-green-100 dark:hover:bg-green-900/20" },
            ].map((item) => (
              <Button
                key={item.category}
                onClick={() => updateFilters({ category: item.category })}
                disabled={isLoading}
                className={`h-16 sm:h-20 ${item.color} bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-xl transition-all duration-300`}
                variant="outline"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-lg sm:text-xl">{item.icon}</span>
                  <span className="text-xs sm:text-sm font-medium">{item.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Active Filters - Mobile Optimized */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active:</span>
          {filters.language && (
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 px-3 py-1 rounded-full">
              <Languages className="mr-1 h-3 w-3" />
              {LANGUAGES.find((l) => l.value === filters.language)?.flag}{" "}
              {LANGUAGES.find((l) => l.value === filters.language)?.label}
            </Badge>
          )}
          {filters.category && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-3 py-1 rounded-full">
              {CATEGORIES.find((c) => c.value === filters.category)?.icon}{" "}
              {CATEGORIES.find((c) => c.value === filters.category)?.label}
            </Badge>
          )}
          {filters.country && (
            <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0 px-3 py-1 rounded-full">
              {COUNTRIES.find((c) => c.value === filters.country)?.flag}{" "}
              {COUNTRIES.find((c) => c.value === filters.country)?.label}
            </Badge>
          )}
          {filters.q && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-3 py-1 rounded-full">
              🔍 {filters.q}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            disabled={isLoading}
            className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-full"
          >
            <X className="mr-1 h-3 w-3" />
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}