"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "../hooks/use-language"
import { Button } from "./ui/button"


export function HeroSection() {
  const { language } = useLanguage()
  const [typedText, setTypedText] = useState("")
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  const texts = {
    es: ["Ingeniero Electricista", "Desarrollador full stack", "Diseñador electricista BT/MT"],
    en: ["Electrical Engineer", "Full Stack Developer", "BT/MT Electrical Designer"],
  }

  useEffect(() => {
    let currentIndex = 0
    const currentText = texts[language][currentTextIndex]
    const interval = setInterval(() => {
      if (currentIndex <= currentText.length) {
        setTypedText(currentText.substring(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts[language].length)
        }, 2000)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [currentTextIndex, language])

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToElectricalTools = () => {
    document.getElementById("electrical-tools")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-gray-500/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
      </div>

      <div className="container px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">David Avila</h1>
          <h2 className="text-2xl md:text-4xl font-medium text-gray-700 dark:text-gray-300 h-12">
            <span className="text-orange-600 dark:text-orange-400">{typedText}</span>
            <span className="animate-blink">|</span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg">
            {language === "es"
              ? "Combinando ingeniería eléctrica con desarrollo de software para crear soluciones innovadoras."
              : "Combining electrical engineering with software development to create innovative solutions."}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={scrollToProjects}>
              {language === "es" ? "Ver Proyectos" : "View Projects"}
            </Button>
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={scrollToElectricalTools}>
              {language === "es" ? "Herramientas eléctricas" : "Electrical Tools"}
            </Button>
            {/*   <Button
              size="lg"
              variant="outline"
              className="border-orange-600 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-950/50"
            >
              {language === "es" ? "Descargar CV" : "Download Resume"}
            </Button> */}

          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-gray-600 dark:text-gray-400" />
      </div>
    </section>
  )
}
