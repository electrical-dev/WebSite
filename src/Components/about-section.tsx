"use client"

import { motion } from "framer-motion"
import { Cpu, Code, Zap, Lightbulb } from "lucide-react"
import { useLanguage } from "../hooks/use-language"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { Card, CardContent } from "./ui/card"

export function AboutSection() {
  const { language } = useLanguage()

  const content = {
    es: {
      title: "Sobre Mí",
      description:
        "Ingeniero Electricista con 4 años de experiencia en diseño eléctrico, subestaciones, iluminación y análisis de calidad de energía en sectores industriales, comerciales y de hidrocarburos. He liderado equipos, gestionado proyectos eléctricos y trabajado con herramientas como AutoCAD, REVIT, ETAP y Dialux, aplicando normativas como RETIE, NEC y RETILAP. Actualmente me desempeño como desarrollador de software con enfoque en el backend, utilizando tecnologías como Node.js, NestJS, PostgreSQL y MongoDB, bajo principios de arquitectura hexagonal. También tengo habilidades en frontend con React y conocimientos en Python, Java y tecnologías web (HTML, CSS), lo que me permite abordar proyectos full-stack de manera integral.",
      tabs: {
        electrical: "Ingenieria Eléctrica",
        software: "Desarrollo de Software",
      },
      electricalSkills: [
        "Diseño de sistemas eléctricos",
        "Gestion de proyectos eléctricos",
        "Analisis de calidad de energia",
        "Eficiencia energética",
        "Diseño de iluminacion",
        "Diseño de subestaciones",
      ],
      softwareSkills: [
        "Desarrollo web frontend (React, Next.js)",
        "Desarrollo backend (Node.js, NestJS)",
        "Bases de datos (PostgreSQL, MongoDB)",
        "Integración de APIs",
        "Arquitectura hexagonal",
      ],
    },
    en: {
      title: "About Me",
      description:
        "Electrical Engineer with 4 years of experience in electrical design, substations, lighting, and power quality analysis in industrial, commercial, and hydrocarbon sectors. I have led teams, managed electrical projects, and worked with tools such as AutoCAD, REVIT, ETAP, and Dialux, applying regulations such as RETIE, NEC, and RETILAP. Currently, I work as a software developer with a focus on backend development, using technologies like Node.js, NestJS, PostgreSQL, and MongoDB, following hexagonal architecture principles. I also have frontend skills with React and knowledge in Python, Java, and web technologies (HTML, CSS), which allows me to comprehensively approach full-stack projects.",
      tabs: {
        electrical: "Electrical Engineering",
        software: "Software Development",
      },
      electricalSkills: [
        "Electrical systems design",
        "Electrical project management",
        "Power quality analysis",
        "Energy efficiency",
        "Lighting design",
        "Substation design",
      ],
      softwareSkills: [
        "Frontend web development (React, Next.js)",
        "Backend development (Node.js, NestJS)",
        "Databases (PostgreSQL, MongoDB)",
        "API integration",
        "Hexagonal architecture",
      ],
    },
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
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{content[language].title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">{content[language].description}</p>
        </motion.div>

        <Tabs defaultValue="electrical" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger
              value="electrical"
              className="flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 hover:bg-gray-200 dark:hover:bg-gray-700 data-[state=active]:hover:bg-white dark:data-[state=active]:hover:bg-gray-700"
            >
              <Zap className="mr-2 h-5 w-5" />
              {content[language].tabs.electrical}
            </TabsTrigger>
            <TabsTrigger
              value="software"
              className="flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 hover:bg-gray-200 dark:hover:bg-gray-700 data-[state=active]:hover:bg-white dark:data-[state=active]:hover:bg-gray-700"
            >
              <Code className="mr-2 h-5 w-5" />
              {content[language].tabs.software}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="electrical">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Cpu className="h-8 w-8 text-orange-600 dark:text-orange-400 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {language === "es" ? "Habilidades Técnicas" : "Technical Skills"}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {content[language].electricalSkills.map((skill, index) => (
                        <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                          <span className="h-2 w-2 rounded-full bg-orange-600 dark:bg-orange-400 mr-2"></span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex items-center justify-center"
              >
                <img
                  src="/i4.webp"
                  alt={language === "es" ? "Ingeniería Eléctrica" : "Electrical Engineering"}
                  className="rounded-lg shadow-lg w-1/2 h-auto"
                />
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="software">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-center justify-center order-2 md:order-1"
              >
                <img
                  src="/acercaDeMi.webp"
                  alt={language === "es" ? "Desarrollo de Software" : "Software Development"}
                  className="rounded-lg shadow-lg w-1/2 h-auto"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="order-1 md:order-2"
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Lightbulb className="h-8 w-8 text-orange-600 dark:text-orange-400 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {language === "es" ? "Habilidades de Desarrollo" : "Development Skills"}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {content[language].softwareSkills.map((skill, index) => (
                        <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                          <span className="h-2 w-2 rounded-full bg-orange-600 dark:bg-orange-400 mr-2"></span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
