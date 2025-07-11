import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "../Components/theme-provider"
import { LanguageProvider } from "../hooks/use-language"
import { Toaster } from "../Components/ui/toaster"
import { LanguageSwitcher } from "../Components/language-switcher"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { ThemeToggle } from "../Components/theme-toggle"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Electrical Calculators",
  description: "Calculadoras eléctricas para profesionales",
  icons: {
    icon: '/bombilla.webp',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (async () => {
                  try {
                    await fetch('/api/visit', { method: 'POST' });
                  } catch (error) {
                    console.error('Error recording visit:', error);
                  }
                })();
              `,
            }}
          />
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
