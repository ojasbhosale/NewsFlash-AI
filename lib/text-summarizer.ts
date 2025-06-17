interface SentenceScore {
  sentence: string
  score: number
  position: number
}

export class TextSummarizer {
  private stopWords = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "has",
    "he",
    "in",
    "is",
    "it",
    "its",
    "of",
    "on",
    "that",
    "the",
    "to",
    "was",
    "will",
    "with",
    "the",
    "this",
    "but",
    "they",
    "have",
    "had",
    "what",
    "said",
    "each",
    "which",
    "their",
    "time",
    "will",
    "about",
    "if",
    "up",
    "out",
    "many",
    "then",
    "them",
    "these",
    "so",
    "some",
    "her",
    "would",
    "make",
    "like",
    "into",
    "him",
    "has",
    "two",
    "more",
    "very",
    "after",
    "words",
    "long",
    "than",
    "first",
    "been",
    "call",
    "who",
    "oil",
    "sit",
    "now",
    "find",
    "down",
    "day",
    "did",
    "get",
    "come",
    "made",
    "may",
    "part",
  ])

  private cleanText(text: string): string {
    return text
      .replace(/[^\w\s.!?]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2 && !this.stopWords.has(word))
  }

  private calculateWordFrequency(words: string[]): Map<string, number> {
    const frequency = new Map<string, number>()

    words.forEach((word) => {
      frequency.set(word, (frequency.get(word) || 0) + 1)
    })

    // Normalize frequencies
    const maxFreq = Math.max(...frequency.values())
    frequency.forEach((freq, word) => {
      frequency.set(word, freq / maxFreq)
    })

    return frequency
  }

  private scoreSentence(sentence: string, wordFreq: Map<string, number>): number {
    const words = this.tokenize(sentence)
    if (words.length === 0) return 0

    const totalScore = words.reduce((score, word) => {
      return score + (wordFreq.get(word) || 0)
    }, 0)

    return totalScore / words.length
  }

  public summarize(text: string, maxSentences = 2): string {
    if (!text || text.trim().length === 0) {
      return "No content available for summarization."
    }

    const cleanedText = this.cleanText(text)

    // Split into sentences
    const sentences = cleanedText
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20) // Filter out very short sentences

    if (sentences.length <= maxSentences) {
      return sentences.join(". ") + "."
    }

    // Calculate word frequencies
    const allWords = this.tokenize(cleanedText)
    const wordFreq = this.calculateWordFrequency(allWords)

    // Score sentences
    const sentenceScores: SentenceScore[] = sentences.map((sentence, index) => ({
      sentence,
      score: this.scoreSentence(sentence, wordFreq),
      position: index,
    }))

    // Sort by score and select top sentences
    const topSentences = sentenceScores
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSentences)
      .sort((a, b) => a.position - b.position) // Maintain original order

    return topSentences.map((s) => s.sentence).join(". ") + "."
  }

  public getReadingTime(text: string): number {
    const words = text.split(/\s+/).length
    return Math.ceil(words / 200) // Average reading speed: 200 words per minute
  }

  public extractKeywords(text: string, maxKeywords = 5): string[] {
    const words = this.tokenize(text)
    const frequency = this.calculateWordFrequency(words)

    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxKeywords)
      .map(([word]) => word)
  }
}

export const textSummarizer = new TextSummarizer()
