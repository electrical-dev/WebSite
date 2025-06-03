"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Youtube,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react"
import { useLanguage } from "../hooks/use-language"
import { toast } from "../hooks/use-toast"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

export function ContactSection() {
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: language === "es" ? "Mensaje enviado" : "Message sent",
      description:
        language === "es"
          ? "Gracias por tu mensaje. Te responderé pronto."
          : "Thank you for your message. I'll get back to you soon.",
    })

    setIsSubmitting(false)
      ; (e.target as HTMLFormElement).reset()
  }
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {language === "es" ? "Contacto" : "Contact"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {language === "es"
              ? "¿Tienes un proyecto en mente? ¡Hablemos sobre cómo puedo ayudarte!"
              : "Do you have a project in mind? Let's talk about how I can help you!"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === "es" ? "Nombre" : "Name"}
                    </label>
                    <Input id="name" required placeholder={language === "es" ? "Tu nombre" : "Your name"} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === "es" ? "Correo Electrónico" : "Email"}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder={language === "es" ? "tu@email.com" : "you@email.com"}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      {language === "es" ? "Asunto" : "Subject"}
                    </label>
                    <Input
                      id="subject"
                      required
                      placeholder={language === "es" ? "Asunto del mensaje" : "Message subject"}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      {language === "es" ? "Mensaje" : "Message"}
                    </label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      placeholder={language === "es" ? "Tu mensaje..." : "Your message..."}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {language === "es" ? "Enviando..." : "Sending..."}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        {language === "es" ? "Enviar Mensaje" : "Send Message"}
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                  {language === "es" ? "Información de Contacto" : "Contact Information"}
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {language === "es" ? "Correo Electrónico" : "Email"}
                      </h4>
                      <a
                        href="mailto:elec-dev@proton.me"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        elec-dev@proton.me
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {language === "es" ? "Teléfono" : "Phone"}
                      </h4>
                      <a
                        href="tel:+573157533033"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        +57 315 753 3033
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {language === "es" ? "Ubicación" : "Location"}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {language === "es" ? "Bogotá, Colombia" : "Bogotá, Colombia"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-medium mb-4 text-gray-900 dark:text-white">
                    {language === "es" ? "Redes Sociales" : "Social Media"}
                  </h4>
                  <div className="flex space-x-4">
                    <a
                      href="https://github.com/electrical-dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                    >
                      <Github className="h-6 w-6" />
                    </a>
                    <a
                      href="https://www.youtube.com/@electrical_da"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                    >
                      <Youtube className="h-6 w-6" />
                    </a>
                    <a
                      href="https://linkedin.com/in/davidavila1992"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>
                    <a
                      href="https://www.tiktok.com/@electrical_da"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                    >
                      <TikTokIcon />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
