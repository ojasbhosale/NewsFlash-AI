interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()

  // NewsData.io free tier: 200 requests per day
  private readonly NEWS_API_LIMIT = 200
  private readonly NEWS_API_WINDOW = 24 * 60 * 60 * 1000 // 24 hours

  // SMMRY API free tier: 100 requests per day
  private readonly SMMRY_API_LIMIT = 100
  private readonly SMMRY_API_WINDOW = 24 * 60 * 60 * 1000 // 24 hours

  canMakeRequest(apiType: "news" | "smmry"): boolean {
    const now = Date.now()
    const key = `${apiType}_requests`
    const limit = apiType === "news" ? this.NEWS_API_LIMIT : this.SMMRY_API_LIMIT
    const window = apiType === "news" ? this.NEWS_API_WINDOW : this.SMMRY_API_WINDOW

    const entry = this.limits.get(key)

    if (!entry || now > entry.resetTime) {
      // Reset or initialize
      this.limits.set(key, {
        count: 0,
        resetTime: now + window,
      })
      return true
    }

    return entry.count < limit
  }

  recordRequest(apiType: "news" | "smmry"): void {
    const key = `${apiType}_requests`
    const entry = this.limits.get(key)

    if (entry) {
      entry.count += 1
      this.limits.set(key, entry)
    }
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

    if (!entry) {
      return new Date(Date.now() + (apiType === "news" ? this.NEWS_API_WINDOW : this.SMMRY_API_WINDOW))
    }

    return new Date(entry.resetTime)
  }
}

export const rateLimiter = new RateLimiter()
