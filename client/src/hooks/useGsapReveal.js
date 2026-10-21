import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapReveal(ref, selector = ".reveal") {
  useEffect(() => {
    if (!ref.current) return undefined;

    const elements = ref.current.querySelectorAll(selector);
    if (!elements || elements.length === 0) return undefined;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      elements.forEach((el) => {
        gsap.set(el, { autoAlpha: 1, y: 0 });
      });
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              ease: "power2.out",
              overwrite: "auto",
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 50px 0px" }
    );

    elements.forEach((el, index) => {
      // Set initial position
      gsap.set(el, { autoAlpha: 0, y: 22 });

      // If already in viewport on mount, reveal immediately with subtle stagger
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          delay: (index % 4) * 0.08,
          ease: "power2.out",
        });
      } else {
        observer.observe(el);
      }
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      clearTimeout(refreshTimer);
      observer.disconnect();
    };
  }, [ref, selector]);
}
