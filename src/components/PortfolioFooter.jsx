import { ArrowUpRight } from "lucide-react";
import { developer } from "../data/developer";
import { GithubIcon, LinkedinIcon } from "./icons";

export default function PortfolioFooter() {
  return (
    <footer className="site-footer"><div className="wrap footer-inner"><a className="brand-mark" href="#home" aria-label={`${developer.name}, back to top`}><span>AS</span><i>.</i></a><span>Designing and building with intent.</span><div className="footer-socials"><a href={developer.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon size={17} /></a><a href={developer.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon size={17} /></a><a href="#home" aria-label="Back to top"><ArrowUpRight size={17} /></a></div><small>© {new Date().getFullYear()} {developer.name}</small></div></footer>
  );
}
