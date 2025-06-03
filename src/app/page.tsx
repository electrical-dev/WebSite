import { AboutSection } from "../Components/about-section";
import { ContactSection } from "../Components/contact-section";
import { ElectricalSection } from "../Components/electrical-section";
import { ExperienceSection } from "../Components/experience-section";
import { HeroSection } from "../Components/hero-section";
import { LanguageSwitcher } from "../Components/language-switcher";
import { ProjectsSection } from "../Components/projects-section";
import { YouTubeSection } from "../Components/youtube-section";


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
