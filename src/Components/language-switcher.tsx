"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { useLanguage } from "../hooks/use-language"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: "es", name: "Español" },
    { code: "en", name: "English" },
  ]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1 bg-white/80 backdrop-blur-sm dark:bg-gray-950/80 border-gray-200 dark:border-gray-800"
        >
          <Globe className="h-4 w-4" />
          <span>{language === "es" ? "ES" : "EN"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={
              language === lang.code ? "bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400" : ""
            }
            onClick={() => {
              setLanguage(lang.code as typeof language)
              setIsOpen(false)
            }}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
