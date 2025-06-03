"use client"

import { motion } from "framer-motion"
import { Play, ExternalLink } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { useLanguage } from "../hooks/use-language"

export function YouTubeSection() {
  const { language } = useLanguage()

  const content = {
    es: {
      title: "Mis Videos de YouTube",
      description: "Contenido educativo sobre ingeniería eléctrica, desarrollo de software y tecnología",
      viewMore: "Ver más en YouTube",
      watchVideo: "Ver Video",
      subscribe: "Suscríbete al Canal",
    },
    en: {
      title: "My YouTube Videos",
      description: "Educational content about electrical engineering, software development and technology",
      viewMore: "View more on YouTube",
      watchVideo: "Watch Video",
      subscribe: "Subscribe to Channel",
    },
  }

  // Lista de tus videos de YouTube - reemplaza con tus URLs reales
  const youtubeVideos = [
    {
      id: "1",
      videoId: "crPqqzqCUuc", // Reemplaza con tu video ID real
      title: language === "es" ? "Vale la pena estudiar ingenieria electrica?" : "Is it worth studying electrical engineering?",
      description: language === "es" ? "Descubre la verdad detrás de la carrera que promete un futuro brillante. David Avila, ingeniero eléctrico y desarrollador de software, te cuenta su historia sin filtros: expectativas vs. realidad, el duro mercado laboral y consejos clave para triunfar. ¿Vale la pena estudiar ingeniería eléctrica? La respuesta te sorprenderá. ¡No te lo pierdas!" : "Discover the truth behind the career that promises a bright future. David Avila, electrical engineer and software developer, tells you his story without filters: expectations vs. reality, the tough job market and key advice to succeed. Is it worth studying electrical engineering? The answer will surprise you. Don't miss it!",
      duration: "5:52",
    },
    {
      id: "2",
      videoId: "z_eHDBkyie4", // Reemplaza con tu video ID real  
      title: language === "es" ? "Apagón Masivo en Europa: Análisis Técnico del Colapso Eléctrico" : "Mass blackout in Europe: Technical analysis of the electric collapse",
      description: language === "es" ? "Análisis técnico del gran apagón europeo" : "Technical analysis of the European blackout",
      duration: "4:14",
    },
    {
      id: "3",
      videoId: "W2xrtHtyvQ4", // Reemplaza con tu video ID real
      title: language === "es" ? "Lo Que No Quieren Que Sepas de la Energía Nuclear ⚡🔥" : "What They Don't Want You to Know About Nuclear Energy ⚡🔥",
      description: language === "es" ? "Nos han hecho creer que la energía nuclear es peligrosa, inestable y que su mayor legado son los desastres como Chernobyl y Fukushima. Pero, ¿y si te dijera que la energía nuclear es en realidad la más eficiente, segura y sostenible que tenemos? 🌍⚡ Con tan solo unos gramos de combustible, una planta nuclear puede generar una cantidad de energía impresionante y abastecer ciudades enteras sin emisiones de CO₂. Además, América Latina ya cuenta con reactores en países como Argentina, Brasil y México. ¿Por qué seguimos temiéndole a la energía del futuro? 🔬☢️" : "They have made us believe that nuclear energy is dangerous, unstable and that its greatest legacy are disasters like Chernobyl and Fukushima. But what if I told you that nuclear energy is actually the most efficient, safe and sustainable energy we have? 🌍⚡ With just a few grams of fuel, a nuclear plant can generate an impressive amount of energy and supply entire cities without CO₂ emissions. In addition, Latin America already has reactors in countries like Argentina, Brazil and Mexico. Why do we still fear the future energy? 🔬☢️",
      duration: "1:27",
    },
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {content[language].title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {content[language].description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {youtubeVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-0">
                  <div className="relative bg-black rounded-t-lg overflow-hidden">
                    {/* Video embed */}
                    <div className="relative w-full h-64">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.videoId}`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full rounded-t-lg"
                      />
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>

                    {/* YouTube logo */}
                    <div className="absolute top-4 right-4 bg-red-600 rounded-full p-2">
                      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {video.description}
                    </p>

                    <a
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {content[language].watchVideo}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Botón para suscribirse al canal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 space-y-4"
        >
          <a
            href="https://www.youtube.com/@electrical_da" // Reemplaza con tu canal
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mr-4"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            {content[language].subscribe}
          </a>

          <a
            href="https://www.youtube.com/@electrical_da" // Reemplaza con tu canal
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            {content[language].viewMore}
          </a>
        </motion.div>
      </div>
    </section>
  )
} 