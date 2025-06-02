import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "../Components/theme-provider"
import { LanguageProvider } from "../hooks/use-language"
import { Toaster } from "../Components/ui/toaster"
import { ThemeToggle } from "../Components/theme-toggle"
import "../app/globals.css"
import { LanguageSwitcher } from "../Components/language-switcher"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "David Avila - Electrical Engineer & Software Developer",
  description: "Portfolio of David Avila, Electrical Engineer and Software Developer",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <div className="fixed top-4 right-4 z-50 flex flex-row items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
