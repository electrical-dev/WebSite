import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "../Components/theme-provider"
import { LanguageProvider } from "../hooks/use-language"
import { Toaster } from "../Components/ui/toaster"
import { ThemeToggle } from "../Components/theme-toggle"
import "../app/globals.css"
import { LanguageSwitcher } from "../Components/language-switcher"
import { SpeedInsights } from "@vercel/speed-insights/next"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "David Avila - Electrical Engineer & Software Developer",
  description: "Portfolio of David Avila, Electrical Engineer and Software Developer",
  icons: {
    icon: '/bombilla.webp',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/bombilla.webp" />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <LanguageProvider>
            <div className="fixed top-4 right-4 z-50 flex flex-row items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
