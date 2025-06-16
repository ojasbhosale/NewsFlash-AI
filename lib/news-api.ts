import type { NewsResponse, FilterOptions } from "@/types/news"
import { rateLimiter } from "./rate-limiter"

const NEWS_API_KEY = "pub_960ad30592db404a829d0f1d5eafbcc9"
const NEWS_BASE_URL = "https://newsdata.io/api/1/news"

export class NewsAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message)
    this.name = "NewsAPIError"
  }
}

export async function fetchNews(filters: FilterOptions = {}): Promise<NewsResponse> {
  if (!rateLimiter.canMakeRequest("news")) {
    const resetTime = rateLimiter.getResetTime("news")
    throw new NewsAPIError(`Rate limit exceeded. Resets at ${resetTime.toLocaleTimeString()}`, 429)
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
      },
    })

    if (!response.ok) {
      if (response.status === 429) {
        throw new NewsAPIError("Rate limit exceeded", 429)
      }
      throw new NewsAPIError(`HTTP error! status: ${response.status}`, response.status)
    }

    const data = await response.json()

    if (data.status !== "success") {
      throw new NewsAPIError(data.message || "Failed to fetch news")
    }

    rateLimiter.recordRequest("news")
    return data
  } catch (error) {
    if (error instanceof NewsAPIError) {
      throw error
    }
    throw new NewsAPIError("Failed to fetch news. Please check your connection.")
  }
}

export async function summarizeArticle(text: string): Promise<string> {
  if (!rateLimiter.canMakeRequest("smmry")) {
    const resetTime = rateLimiter.getResetTime("smmry")
    throw new NewsAPIError(`Summary rate limit exceeded. Resets at ${resetTime.toLocaleTimeString()}`, 429)
  }

  // Fallback summary if SMMRY fails or rate limit exceeded
  const fallbackSummary = (text: string): string => {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20)
    return sentences.slice(0, 2).join(". ") + (sentences.length > 2 ? "." : "")
  }

  try {
    const response = await fetch("https://api.smmry.com/&SM_LENGTH=2", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `sm_api_input=${encodeURIComponent(text.substring(0, 2000))}`, 
    })

    if (!response.ok) {
      return fallbackSummary(text)
    }

    const data = await response.json()

    if (data.sm_api_content) {
      rateLimiter.recordRequest("smmry")
      return data.sm_api_content
    }

    return fallbackSummary(text)
  } catch (error) {
    // Always return fallback summary if SMMRY fails
    return fallbackSummary(text)
  }
}
