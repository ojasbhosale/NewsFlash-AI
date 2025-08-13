interface RateLimitEntry {
  count: number
  resetTime: number
  lastUpdated: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private readonly STORAGE_KEY = 'news_app_rate_limits'

  // NewsData.io free tier: 200 requests per day
  private readonly NEWS_API_LIMIT = 200
  private readonly NEWS_API_WINDOW = 24 * 60 * 60 * 1000 // 24 hours

  // SMMRY API free tier: 100 requests per day
  private readonly SMMRY_API_LIMIT = 100
  private readonly SMMRY_API_WINDOW = 24 * 60 * 60 * 1000 // 24 hours

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(this.STORAGE_KEY)
        if (stored) {
          const data = JSON.parse(stored)
          // Convert plain object back to Map
          this.limits = new Map(Object.entries(data))
        }
      }
    } catch (error) {
      console.warn('Failed to load rate limit data from storage:', error)
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        // Convert Map to plain object for storage
        const data = Object.fromEntries(this.limits)
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
      }
    } catch (error) {
      console.warn('Failed to save rate limit data to storage:', error)
    }
  }

  canMakeRequest(apiType: "news" | "smmry"): boolean {
    const now = Date.now()
    const key = `${apiType}_requests`
    const limit = apiType === "news" ? this.NEWS_API_LIMIT : this.SMMRY_API_LIMIT
    

    const entry = this.limits.get(key)

    // If no entry exists or the window has expired, allow requests
    if (!entry || now > entry.resetTime) {
      return true
    }

    // Check if we're within the limit
    return entry.count < limit
  }

  // Only call this method when you receive a successful API response
  recordSuccessfulRequest(apiType: "news" | "smmry"): void {
    const now = Date.now()
    const key = `${apiType}_requests`
    const window = apiType === "news" ? this.NEWS_API_WINDOW : this.SMMRY_API_WINDOW

    const entry = this.limits.get(key)

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      this.limits.set(key, {
        count: 1,
        resetTime: now + window,
        lastUpdated: now
      })
    } else {
      // Increment existing entry
      entry.count += 1
      entry.lastUpdated = now
      this.limits.set(key, entry)
    }

    this.saveToStorage()
  }

  getRemainingRequests(apiType: "news" | "smmry"): number {
    const key = `${apiType}_requests`
    const limit = apiType === "news" ? this.NEWS_API_LIMIT : this.SMMRY_API_LIMIT
    const entry = this.limits.get(key)

    if (!entry || Date.now() > entry.resetTime) {
      return limit
    }

    return Math.max(0, limit - entry.count)
  }

  getResetTime(apiType: "news" | "smmry"): Date {
    const key = `${apiType}_requests`
    const entry = this.limits.get(key)
    const window = apiType === "news" ? this.NEWS_API_WINDOW : this.SMMRY_API_WINDOW

    if (!entry || Date.now() > entry.resetTime) {
      return new Date(Date.now() + window)
    }

    return new Date(entry.resetTime)
  }

  // Get usage statistics
  getUsageStats(apiType: "news" | "smmry"): {
    used: number
    remaining: number
    total: number
    resetTime: Date
    percentage: number
  } {
    const total = apiType === "news" ? this.NEWS_API_LIMIT : this.SMMRY_API_LIMIT
    const remaining = this.getRemainingRequests(apiType)
    const used = total - remaining
    const percentage = (used / total) * 100

    return {
      used,
      remaining,
      total,
      resetTime: this.getResetTime(apiType),
      percentage: Math.round(percentage * 100) / 100
    }
  }

  // Reset limits manually (for testing or admin purposes)
  resetLimits(apiType?: "news" | "smmry"): void {
    if (apiType) {
      this.limits.delete(`${apiType}_requests`)
    } else {
      this.limits.clear()
    }
    this.saveToStorage()
  }

  // Check if the rate limit data is stale and needs refresh
  isDataStale(apiType: "news" | "smmry"): boolean {
    const key = `${apiType}_requests`
    const entry = this.limits.get(key)
    
    if (!entry) return false
    
    const now = Date.now()
    const oneHour = 60 * 60 * 1000
    
    // Consider data stale if it hasn't been updated in over an hour
    return (now - entry.lastUpdated) > oneHour
  }
}

export const rateLimiter = new RateLimiter()