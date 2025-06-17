"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"     // ✅ Set light as default
      enableSystem={true}      // ✅ Respect system preference if desired
      disableTransitionOnChange={true} // ✅ Prevent flashing
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
