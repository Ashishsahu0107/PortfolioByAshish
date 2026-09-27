import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import TechStack from "../components/TechStack";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Services from "../components/Services";
import GitHubActivity from "../components/GitHubActivity";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <About />
      <Skills />
      <TechStack />
      <Projects />
      <Experience />
      <Services />
      <GitHubActivity />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
