export interface NewsArticle {
  article_id: string
  title: string
  link: string
  keywords?: string[]
  creator?: string[]
  video_url?: string
  description?: string
  content?: string
  pubDate: string
  image_url?: string
  source_id: string
  source_priority: number
  source_url: string
  source_icon?: string
  language: string
  country: string[]
  category: string[]
  ai_tag?: string
  sentiment?: string
  sentiment_stats?: string
  ai_region?: string
  ai_org?: string
  duplicate?: boolean
}

export interface NewsResponse {
  status: string
  totalResults: number
  results: NewsArticle[]
  nextPage?: string
}

export interface ReadArticle {
  article_id: string
  readAt: string
}

export interface FilterOptions {
  category?: string
  country?: string
  language?: string
  q?: string
}

export interface RateLimitInfo {
  requests: number
  resetTime: number
  maxRequests: number
}
