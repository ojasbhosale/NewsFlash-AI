"use client"
import { useRouter } from "next/navigation"
import { PremiumHero } from "@/components/premium-hero"
import { PremiumNavbar } from "@/components/premium-navbar"

export default function HomePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/news")
  }

  const handleSearch = (query: string) => {
    router.push(`/news?q=${encodeURIComponent(query)}`)
  }

  const handleShowBookmarks = () => {
    router.push("/bookmarks")
  }

  const handleShowStats = () => {
    router.push("/analytics")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <PremiumNavbar
        onSearch={handleSearch}
        onShowBookmarks={handleShowBookmarks}
        onShowStats={handleShowStats}
        currentPath="/"
      />
      <PremiumHero onGetStarted={handleGetStarted} />
    </div>
  )
}
