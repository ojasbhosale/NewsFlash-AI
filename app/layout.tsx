import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "NewsFlash AI - Smart News Summaries",
  description: "Get the latest news headlines with AI-powered summaries. Stay informed with intelligent news curation.",
  keywords: "news, headlines, AI, summaries, breaking news, technology, world news",
  authors: [{ name: "NewsFlash AI" }],
}

// ✅ Move viewport to its own export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

// ✅ Move themeColor to its own export
export const themeColor = [
  { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <ErrorBoundary>
            <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
              <div className="absolute inset-0 bg-grid opacity-30"></div>
              <div className="relative">{children}</div>
            </div>
            <Toaster />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
