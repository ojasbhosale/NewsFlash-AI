import type { ReadArticle } from "@/types/news"

const READ_ARTICLES_KEY = "newsflash_read_articles"
const BOOKMARKED_ARTICLES_KEY = "newsflash_bookmarked_articles"
const USER_PREFERENCES_KEY = "newsflash_user_preferences"
const READING_STATS_KEY = "newsflash_reading_stats"

export interface BookmarkedArticle {
  article_id: string
  title: string
  link: string
  bookmarkedAt: string
  category: string[]
  image_url?: string
}

export interface UserPreferences {
  preferredCategories: string[]
  preferredCountries: string[]
  autoSummarize: boolean
  readingGoal: number
  notifications: boolean
}

export interface ReadingStats {
  totalArticlesRead: number
  articlesReadToday: number
  lastReadDate: string
  readingStreak: number
  favoriteCategories: Record<string, number>
  totalReadingTime: number
}

// Initialize storage with default values
function initializeStorage() {
  if (typeof window === "undefined") return

  try {
    // Initialize reading stats if not exists
    if (!localStorage.getItem(READING_STATS_KEY)) {
      const defaultStats: ReadingStats = {
        totalArticlesRead: 0,
        articlesReadToday: 0,
        lastReadDate: "",
        readingStreak: 0,
        favoriteCategories: {},
        totalReadingTime: 0,
      }
      localStorage.setItem(READING_STATS_KEY, JSON.stringify(defaultStats))
    }

    // Initialize preferences if not exists
    if (!localStorage.getItem(USER_PREFERENCES_KEY)) {
      const defaultPrefs: UserPreferences = {
        preferredCategories: [],
        preferredCountries: ["in"],
        autoSummarize: false,
        readingGoal: 5,
        notifications: false,
      }
      localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(defaultPrefs))
    }

    // Initialize other storage if not exists
    if (!localStorage.getItem(READ_ARTICLES_KEY)) {
      localStorage.setItem(READ_ARTICLES_KEY, JSON.stringify([]))
    }

    if (!localStorage.getItem(BOOKMARKED_ARTICLES_KEY)) {
      localStorage.setItem(BOOKMARKED_ARTICLES_KEY, JSON.stringify([]))
    }
  } catch (error) {
    console.error("Error initializing storage:", error)
  }
}

// Call initialization
if (typeof window !== "undefined") {
  initializeStorage()
}

// Read Articles Management
export function getReadArticles(): ReadArticle[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(READ_ARTICLES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error reading from localStorage:", error)
    return []
  }
}

export function markArticleAsRead(articleId: string): void {
  if (typeof window === "undefined") return

  try {
    const readArticles = getReadArticles()
    const existing = readArticles.find((a) => a.article_id === articleId)

    if (!existing) {
      readArticles.push({
        article_id: articleId,
        readAt: new Date().toISOString(),
      })

      const trimmed = readArticles.slice(-1000)
      localStorage.setItem(READ_ARTICLES_KEY, JSON.stringify(trimmed))

      // Update reading stats
      updateReadingStats()
    }
  } catch (error) {
    console.error("Error writing to localStorage:", error)
  }
}

export function isArticleRead(articleId: string): boolean {
  const readArticles = getReadArticles()
  return readArticles.some((a) => a.article_id === articleId)
}

// Bookmarks Management
export function getBookmarkedArticles(): BookmarkedArticle[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(BOOKMARKED_ARTICLES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error reading bookmarks:", error)
    return []
  }
}

export function toggleBookmark(article: {
  article_id: string
  title: string
  link: string
  category: string[]
  image_url?: string
}): boolean {
  if (typeof window === "undefined") return false

  try {
    const bookmarks = getBookmarkedArticles()
    const existingIndex = bookmarks.findIndex((b) => b.article_id === article.article_id)

    if (existingIndex >= 0) {
      bookmarks.splice(existingIndex, 1)
      localStorage.setItem(BOOKMARKED_ARTICLES_KEY, JSON.stringify(bookmarks))
      return false
    } else {
      bookmarks.push({
        ...article,
        bookmarkedAt: new Date().toISOString(),
      })
      localStorage.setItem(BOOKMARKED_ARTICLES_KEY, JSON.stringify(bookmarks))
      return true
    }
  } catch (error) {
    console.error("Error managing bookmarks:", error)
    return false
  }
}

export function isArticleBookmarked(articleId: string): boolean {
  const bookmarks = getBookmarkedArticles()
  return bookmarks.some((b) => b.article_id === articleId)
}

// User Preferences
export function getUserPreferences(): UserPreferences {
  if (typeof window === "undefined") {
    return {
      preferredCategories: [],
      preferredCountries: ["in"],
      autoSummarize: false,
      readingGoal: 5,
      notifications: false,
    }
  }

  try {
    const stored = localStorage.getItem(USER_PREFERENCES_KEY)
    if (stored) {
      return JSON.parse(stored)
    }

    // Return and save default preferences
    const defaultPrefs: UserPreferences = {
      preferredCategories: [],
      preferredCountries: ["in"],
      autoSummarize: false,
      readingGoal: 5,
      notifications: false,
    }
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(defaultPrefs))
    return defaultPrefs
  } catch (error) {
    console.error("Error reading preferences:", error)
    return {
      preferredCategories: [],
      preferredCountries: ["in"],
      autoSummarize: false,
      readingGoal: 5,
      notifications: false,
    }
  }
}

export function saveUserPreferences(preferences: Partial<UserPreferences>): void {
  if (typeof window === "undefined") return

  try {
    const current = getUserPreferences()
    const updated = { ...current, ...preferences }
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Error saving preferences:", error)
  }
}

// Reading Stats
export function getReadingStats(): ReadingStats {
  if (typeof window === "undefined") {
    return {
      totalArticlesRead: 0,
      articlesReadToday: 0,
      lastReadDate: "",
      readingStreak: 0,
      favoriteCategories: {},
      totalReadingTime: 0,
    }
  }

  try {
    const stored = localStorage.getItem(READING_STATS_KEY)
    if (stored) {
      const stats = JSON.parse(stored)

      // Check if we need to reset daily stats
      const today = new Date().toDateString()
      if (stats.lastReadDate && stats.lastReadDate !== today) {
        // Check if streak should continue
        const lastDate = new Date(stats.lastReadDate)
        const currentDate = new Date()
        const diffTime = currentDate.getTime() - lastDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays > 1) {
          // Streak broken
          stats.readingStreak = 0
        }

        // Reset daily count
        stats.articlesReadToday = 0
      }

      return stats
    }

    // Return and save default stats
    const defaultStats: ReadingStats = {
      totalArticlesRead: 0,
      articlesReadToday: 0,
      lastReadDate: "",
      readingStreak: 0,
      favoriteCategories: {},
      totalReadingTime: 0,
    }
    localStorage.setItem(READING_STATS_KEY, JSON.stringify(defaultStats))
    return defaultStats
  } catch (error) {
    console.error("Error reading stats:", error)
    return {
      totalArticlesRead: 0,
      articlesReadToday: 0,
      lastReadDate: "",
      readingStreak: 0,
      favoriteCategories: {},
      totalReadingTime: 0,
    }
  }
}

function updateReadingStats(): void {
  if (typeof window === "undefined") return

  try {
    const stats = getReadingStats()
    const today = new Date().toDateString()

    stats.totalArticlesRead += 1

    if (stats.lastReadDate === today) {
      stats.articlesReadToday += 1
    } else {
      // Check streak
      if (stats.lastReadDate) {
        const lastDate = new Date(stats.lastReadDate)
        const currentDate = new Date()
        const diffTime = currentDate.getTime() - lastDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          stats.readingStreak += 1
        } else if (diffDays > 1) {
          stats.readingStreak = 1
        }
      } else {
        stats.readingStreak = 1
      }

      stats.articlesReadToday = 1
      stats.lastReadDate = today
    }

    localStorage.setItem(READING_STATS_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error("Error updating stats:", error)
  }
}

export function addReadingTime(minutes: number): void {
  if (typeof window === "undefined") return

  try {
    const stats = getReadingStats()
    stats.totalReadingTime += minutes
    localStorage.setItem(READING_STATS_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error("Error updating reading time:", error)
  }
}

export function clearReadArticles(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(READ_ARTICLES_KEY)
    localStorage.removeItem(BOOKMARKED_ARTICLES_KEY)
    localStorage.removeItem(USER_PREFERENCES_KEY)
    localStorage.removeItem(READING_STATS_KEY)

    // Reinitialize with defaults
    initializeStorage()
  } catch (error) {
    console.error("Error clearing localStorage:", error)
  }
}
