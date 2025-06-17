import { AboutSection } from "../templates/about-section";
import { ContactSection } from "../templates/contact-section";
import { ElectricalSection } from "../templates/electrical-section";
import { ExperienceSection } from "../templates/experience-section";
import { HeroSection } from "../templates/hero-section";
import { ProjectsSection } from "../templates/projects-section";
import { YouTubeSection } from "../templates/youtube-section";


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <HeroSection />
      <AboutSection />
      <ElectricalSection />
      <YouTubeSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  )
}
