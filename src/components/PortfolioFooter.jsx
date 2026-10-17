import { ArrowUpRight } from "lucide-react";
import { developer } from "../data/developer";
import { GithubIcon, LinkedinIcon } from "./icons";
import { contentWidth } from "./portfolioStyles";

export default function PortfolioFooter() {
  return (
    <footer className="bg-canvas py-[27px]"><div className={`${contentWidth} flex min-h-10 items-center justify-between gap-[18px] max-[620px]:flex-wrap`}><a className="font-display text-[22px] font-bold text-primary no-underline" href="#home" aria-label={`${developer.name}, back to top`}><span>AS</span><i className="text-action not-italic">.</i></a><span className="font-mono text-[9px] text-secondary max-[620px]:order-3 max-[620px]:w-full">Designing and building with intent.</span><div className="flex gap-[18px] text-secondary [&_a]:inline-flex [&_a]:transition-colors [&_a:hover]:text-action"><a href={developer.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon size={17} /></a><a href={developer.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon size={17} /></a><a href="#home" aria-label="Back to top"><ArrowUpRight size={17} /></a></div><small className="text-right font-mono text-[9px] text-secondary max-[620px]:text-[8px]">© {new Date().getFullYear()} {developer.name}</small></div></footer>
  );
}
