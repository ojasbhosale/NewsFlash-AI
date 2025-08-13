import type { NewsResponse, FilterOptions } from "@/types/news"
import { rateLimiter } from "./rate-limiter"

const NEWS_API_KEY = "pub_960ad30592db404a829d0f1d5eafbcc9"
const NEWS_BASE_URL = "https://newsdata.io/api/1/news"

export class NewsAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public isRateLimit: boolean = false
  ) {
    super(message)
    this.name = "NewsAPIError"
  }
}

export async function fetchNews(filters: FilterOptions = {}): Promise<NewsResponse> {
  // Check client-side rate limit first
  if (!rateLimiter.canMakeRequest("news")) {
    const resetTime = rateLimiter.getResetTime("news")
    throw new NewsAPIError(
      `Rate limit exceeded. Resets at ${resetTime.toLocaleTimeString()}`, 
      429, 
      true
    )
  }

  const params = new URLSearchParams({
    apikey: NEWS_API_KEY,
    language: filters.language || "en",
    size: "10", // Limit to 10 articles to conserve API calls
  })

  if (filters.category) params.append("category", filters.category)
  if (filters.country) params.append("country", filters.country)
  if (filters.q) params.append("q", filters.q)

  try {
    const response = await fetch(`${NEWS_BASE_URL}?${params}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "NewsApp/1.0",
      },
    })

    if (!response.ok) {
      if (response.status === 429) {
        // Server-side rate limit hit
        throw new NewsAPIError(
          "API rate limit exceeded. Please try again later.", 
          429, 
          true
        )
      }
      
      if (response.status === 401) {
        throw new NewsAPIError("Invalid API key", 401)
      }
      
      if (response.status === 403) {
        throw new NewsAPIError("API access forbidden", 403)
      }

      throw new NewsAPIError(
        `HTTP error! status: ${response.status}`, 
        response.status
      )
    }

    const data = await response.json()

    if (data.status !== "success") {
      throw new NewsAPIError(data.message || "Failed to fetch news")
    }

    // Only record successful API calls to the rate limiter
    rateLimiter.recordSuccessfulRequest("news")
    
    return data
  } catch (error) {
    if (error instanceof NewsAPIError) {
      throw error
    }
    
    // Network or parsing errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NewsAPIError("Network error. Please check your connection.")
    }
    
    throw new NewsAPIError("Failed to fetch news. Please try again.")
  }
}

export async function summarizeArticle(text: string): Promise<string> {
  // Client-side fallback summary function
  const fallbackSummary = (text: string): string => {
    if (!text || text.length < 50) return text

    // Clean the text
    const cleanText = text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?-]/g, '')
      .trim()

    // Split into sentences
    const sentences = cleanText
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20 && s.length < 200)

    if (sentences.length === 0) return text.substring(0, 200) + "..."

    // Return first 2-3 most substantial sentences
    const selectedSentences = sentences
      .slice(0, Math.min(3, sentences.length))
      .join('. ')

    return selectedSentences + (selectedSentences.endsWith('.') ? '' : '.')
  }

  // Check client-side rate limit for SMMRY
  if (!rateLimiter.canMakeRequest("smmry")) {
    console.log("SMMRY rate limit exceeded, using fallback summary")
    return fallbackSummary(text)
  }

  try {
    const response = await fetch("https://api.smmry.com/&SM_LENGTH=2", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      body: `sm_api_input=${encodeURIComponent(text.substring(0, 2000))}`,
    })

    if (!response.ok) {
      console.log("SMMRY API error, using fallback summary")
      return fallbackSummary(text)
    }

    const data = await response.json()

    if (data.sm_api_content) {
      // Only record successful API calls
      rateLimiter.recordSuccessfulRequest("smmry")
      return data.sm_api_content
    }

    return fallbackSummary(text)
  } catch (error) {
    console.error("SMMRY API error:", error)
    return fallbackSummary(text)
  }
}

// Utility function to get current API usage stats
export function getAPIUsageStats() {
  return {
    news: rateLimiter.getUsageStats("news"),
    summary: rateLimiter.getUsageStats("smmry")
  }
}

// Utility function to check if we can make requests
export function canMakeAPIRequest(apiType: "news" | "smmry"): boolean {
  return rateLimiter.canMakeRequest(apiType)
}

// Utility function to reset rate limits (for testing)
export function resetAPILimits(apiType?: "news" | "smmry"): void {
  rateLimiter.resetLimits(apiType)
}