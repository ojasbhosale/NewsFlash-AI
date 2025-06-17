"use client"

import { useState, useEffect } from "react"
import { ArrowRight, TrendingUp, Globe, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"


interface PremiumHeroProps {
  onGetStarted?: () => void
}

export function PremiumHero({ onGetStarted }: PremiumHeroProps) {
  const [currentStat, setCurrentStat] = useState(0)

  const stats = [
    { label: "Articles Analyzed", value: "10K+", icon: "📰" },
    { label: "AI Summaries", value: "5K+", icon: "🤖" },
    { label: "Active Readers", value: "1K+", icon: "👥" },
    { label: "Countries", value: "50+", icon: "🌍" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [stats.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden ">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-float-slow"></div>
      <div
        className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-15 animate-float-slow"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full opacity-25 animate-float-slow"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="container mx-auto mobile-padding relative z-10">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          {/* <div className="animate-scale-in">
            <Badge className="glass px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </Badge>
          </div> */}

          {/* Main Heading */}
          <div className="space-y-4 stagger-animation">
            <h1 className="text-display gradient-text">
              Stay Informed with
              <br />
              <span className="gradient-text-secondary">Intelligent News</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get the latest headlines with AI-powered summaries.
              <br className="hidden md:block" />
              Discover, read, and stay updated effortlessly.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-in-up">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="btn-premium text-white px-8 py-6 text-lg font-semibold rounded-xl"
            >
              Start Reading
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="glass px-8 py-6 text-lg font-semibold rounded-xl hover:bg-white/30 dark:hover:bg-black/30"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              View Trending
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-slide-in-up">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`
                  glass p-6 rounded-2xl text-center transition-all duration-500
                  ${index === currentStat ? "scale-105 animate-pulse-glow" : ""}
                `}
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Preview */}
          <div className="flex flex-wrap justify-center gap-4 mt-12 animate-slide-in-up">
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Instant Summaries</span>
            </div>
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Global Coverage</span>
            </div>
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Real-time Updates</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
