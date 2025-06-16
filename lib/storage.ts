import type { ReadArticle } from "@/types/news"

const READ_ARTICLES_KEY = "newsflash_read_articles"

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

      // Keep only last 1000 read articles to prevent localStorage bloat
      const trimmed = readArticles.slice(-1000)
      localStorage.setItem(READ_ARTICLES_KEY, JSON.stringify(trimmed))
    }
  } catch (error) {
    console.error("Error writing to localStorage:", error)
  }
}

export function isArticleRead(articleId: string): boolean {
  const readArticles = getReadArticles()
  return readArticles.some((a) => a.article_id === articleId)
}

export function clearReadArticles(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(READ_ARTICLES_KEY)
  } catch (error) {
    console.error("Error clearing localStorage:", error)
  }
}
