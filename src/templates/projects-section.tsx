"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge, ExternalLink, Github, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "../hooks/use-language"
import { Button } from "../Components/ui/button"
import { Card, CardFooter, CardContent } from "../Components/ui/card"

// Define the Project type
interface Project {
  id: number;
  title: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  images: string[];
  category: string;
  tags: string[];
  link?: string;
  github?: string;
  company?: string;
}

export function ProjectsSection() {
  const { language } = useLanguage()
  const [filter, setFilter] = useState("all")
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/products.json")
        const jsonData: any[] = await response.json()

        const mappedProjects: Project[] = jsonData.map((item) => ({
          id: item.id,
          title: {
            es: item.name,
            en: item.name,
          },
          description: {
            es: item.description,
            en: item.description,
          },
          images: item.image || [],
          company: item.company,
          tags: item.category ? item.category.split(",").map((tag: string) => tag.trim()) : [],
          category: item.tags?.includes("React") || item.tags?.includes("Node.js") ? "software" : item.tags?.includes("electricidad") || item.tags?.includes("ingenieria") ? "electrical" : "hybrid",
          link: item.link || "#",
          github: item.github,
        }))
        setAllProjects(mappedProjects)
      } catch (error) {
        console.error("Error fetching projects:", error)
        setAllProjects([])
      }
    }

    fetchProjects()
  }, [])

  const filteredProjects =
    filter === "all"
      ? allProjects
      : allProjects.filter(
        (project) => project.category === filter,
      )

  const filterLabels = {
    es: {
      all: "Todos",
      electrical: "Ing. Eléctrica",
      software: "Desarrollo",
      hybrid: "Híbridos",
    },
    en: {
      all: "All",
      electrical: "Electrical Eng.",
      software: "Development",
      hybrid: "Hybrid",
    },
  }

  const openProjectDetail = (project: Project) => {
    setSelectedProject(project)
    setCurrentImageIndex(0)
    setIsDetailOpen(true)
  }

  const closeProjectDetail = () => {
    setSelectedProject(null)
    setIsDetailOpen(false)
  }

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {language === "es" ? "Mis Proyectos" : "My Projects"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {language === "es"
              ? "Una selección de proyectos que muestran mi experiencia en ingeniería eléctrica y desarrollo de software."
              : "A selection of projects showcasing my experience in electrical engineering and software development."}
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Object.entries(filterLabels[language]).map(([key, label]) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              onClick={() => setFilter(key)}
              className={
                filter === key
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "border-orange-600 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-950/50"
              }
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => openProjectDetail(project)}
              className="cursor-pointer"
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative overflow-hidden h-48">
                  <img
                    src={project.images && project.images.length > 0 ? project.images[0] : "/placeholder.svg"}
                    alt={project.title[language]}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardContent className="flex-grow p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {project.title[language]}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm h-20 overflow-hidden text-ellipsis">
                    {project.description[language]}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <Badge
                        key={i}
                        className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && <Badge className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">...</Badge>}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex gap-2">
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); openProjectDetail(project); }}>
                    {language === "es" ? "Ver Detalles" : "View Details"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {allProjects.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            {language === "es" ? "Cargando proyectos..." : "Loading projects..."}
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-orange-600 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-950/50"
          >
            {language === "es" ? "Ver Más Proyectos" : "View More Projects"}
          </Button>
        </div>
      </div>

      {isDetailOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedProject.title[language]}
                </h2>
                {selectedProject.company && (
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                    {selectedProject.company}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={closeProjectDetail} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                <X className="h-6 w-6" />
              </Button>
            </div>

            {selectedProject.images && selectedProject.images.length > 0 && (
              <div className="mb-4 relative flex justify-center items-center bg-gray-100 dark:bg-gray-800 rounded p-2 min-h-[200px] md:min-h-[300px]">
                <img
                  src={selectedProject.images[currentImageIndex]}
                  alt={`${selectedProject.title[language]} - Image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-80 md:max-h-96 object-contain rounded-md"
                />
                {selectedProject.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedProject.images.length) % selectedProject.images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedProject.images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {currentImageIndex + 1} / {selectedProject.images.length}
                    </div>
                  </>
                )}
              </div>
            )}

            <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm leading-relaxed whitespace-pre-wrap">
              {selectedProject.description[language]}
            </p>

            {selectedProject.tags && selectedProject.tags.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">
                  {language === "es" ? "Palabras Clave:" : "Keywords:"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, i) => (
                    <Badge
                      key={i}
                      className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-2 py-1 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <CardFooter className="p-0 flex flex-wrap gap-3">
              {selectedProject.link && selectedProject.link !== "#" && (
                <Button variant="default" size="sm" asChild className="bg-orange-600 hover:bg-orange-700">
                  <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {language === "es" ? "Ver Proyecto" : "View Project"}
                  </a>
                </Button>
              )}
              {selectedProject.github && (
                <Button variant="outline" size="sm" asChild>
                  <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                </Button>
              )}
            </CardFooter>
          </motion.div>
        </div>
      )}
    </section>
  )
}
