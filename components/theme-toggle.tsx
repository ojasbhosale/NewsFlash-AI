"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Avoid SSR mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-9 h-9 rounded-lg text-gray-600 dark:text-gray-400"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  const isLight = resolvedTheme === "light"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label="Toggle theme"
      className="w-9 h-9 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
    >
      {isLight ? (
        <Moon className="h-4 w-4 transition-transform duration-200" />
      ) : (
        <Sun className="h-4 w-4 transition-transform duration-200" />
      )}
    </Button>
  )
}
