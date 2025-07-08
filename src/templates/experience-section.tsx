"use client"

import { motion } from "framer-motion"
import { Briefcase, Calendar } from "lucide-react"
import { useLanguage } from "../hooks/use-language"
import { Card, CardContent } from "../Components/ui/card"

export function ExperienceSection() {
  const { language } = useLanguage()

  const experiences = [
    {
      id: 1,
      title: {
        es: "Desarrollador Full Stack",
        en: "Full Stack Developer",
      },
      company: {
        es: "Kunturtech",
        en: "Kunturtech",
      },
      period: {
        es: "2024-03 - Presente",
        en: "2024-03 - Present",
      },
      description: {
        es: "Desarrollo de aplicaciones web para el sector fintech utilizando React, Next.js y Node.js nestjs. Implementación de arquitetura hexagonal, APIs RESTful y bases de datos SQL/NoSQL.",
        en: "Development of web applications for the fintech sector using React, Next.js and Node.js nestjs. Implementation of hexagonal architecture, RESTful APIs and SQL/NoSQL databases.",
      },
    },
    {
      id: 2,
      title: {
        es: "Ingeniero Electricista independiente",
        en: "Freelance Electrical Engineer",
      },
      company: {
        es: "Freelance",
        en: "Freelance",
      },
      period: {
        es: "2023 - Presente",
        en: "2023 - Present",
      },
      description: {
        es: "Diseño e implementación de sistemas de control y automatización para procesos industriales. Programación de PLCs y desarrollo de interfaces HMI.",
        en: "Design and implementation of control and automation systems for industrial processes. PLC programming and HMI interface development.",
      },
    },
    {
      id: 3,
      title: {
        es: "Ingeniero de proyectos",
        en: "Project Engineer",
      },
      company: {
        es: "Jorge A. Gomez y CIA SAS",
        en: "Jorge A. Gomez and CIA SAS",
      },
      period: {
        es: "2023-01 - 2023-10",
        en: "2023-01 - 2023-10",
      },
      description: {
        es: "Implementación de sistemas eléctricos en plantas de hidrocarburos, Supervisión de proyectos de telemetría y cierre documental de proyectos.",
        en: "Implementation of electrical systems in hydrocarbon plants, Supervision of telemetry projects and documentation closure of projects.",
      },
    },
    {
      id: 4,
      title: {
        es: "Ingeniero de proyectos",
        en: "Project Engineer",
      },
      company: {
        es: "Energia Integral Andina ",
        en: "Energia Integral Andina ",
      },
      period: {
        es: "2022-06 - 2023-01",
        en: "2022-06 - 2023-01",
      },
      description: {
        es: "Diseño y supervisión de infraestructura eléctrica en peajes, Optimización de procesos y reducción de tiempos de ejecución. ",
        en: "Design and supervision of electrical infrastructure at toll booths, Optimization of processes and reduction of execution times.",
      },
    },
  ]

  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-850">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {language === "es" ? "Experiencia Profesional" : "Professional Experience"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {language === "es"
              ? "Mi trayectoria profesional combinando ingeniería eléctrica y desarrollo de software."
              : "My professional journey combining electrical engineering and software development."}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="mb-8 last:mb-0"
            >
              <Card className="border-l-4 border-l-orange-600 dark:border-l-orange-400">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{exp.title[language]}</h3>
                      <div className="flex items-center text-gray-700 dark:text-gray-300 mt-1">
                        <Briefcase className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-400" />
                        {exp.company[language]}
                      </div>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0 text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-400" />
                      {exp.period[language]}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{exp.description[language]}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
