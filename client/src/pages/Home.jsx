import PortfolioHero from "../components/PortfolioHero";
import PortfolioAbout from "../components/PortfolioAbout";
import PortfolioSkills from "../components/PortfolioSkills";
import PortfolioProjects from "../components/PortfolioProjects";
import PortfolioProcess from "../components/PortfolioProcess";
import PortfolioExperience from "../components/PortfolioExperience";
import PortfolioContact from "../components/PortfolioContact";
import PortfolioFooter from "../components/PortfolioFooter";

export default function Home() {
  return (
    <main id="main-content">
      <PortfolioHero />
      <PortfolioAbout />
      <PortfolioSkills />
      <PortfolioProjects />
      <PortfolioProcess />
      <PortfolioExperience />
      <PortfolioContact />
      <PortfolioFooter />
    </main>
  );
}
