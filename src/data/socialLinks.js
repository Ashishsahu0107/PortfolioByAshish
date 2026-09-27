import { developer } from "./developer";

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const socialLinks = [
  {
    id: "github",
    label: "GitHub",
    url: developer.github,
    username: "@ashishsahu0107",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: developer.linkedin,
    username: "Ashish Sahu",
  },
  {
    id: "instagram",
    label: "Instagram",
    url: developer.instagram,
    username: "@ashishsahu_official",
  },
  {
    id: "twitter",
    label: "Twitter",
    url: developer.twitter,
    username: "@ashishsahu0107",
  },
  {
    id: "email",
    label: "Email",
    url: `mailto:${developer.email}`,
    username: developer.email,
  },
];

export const testimonials = [
  {
    id: 1,
    quote:
      "Ashish delivered the project ahead of schedule with exceptional attention to detail. The code quality and UI polish exceeded our expectations.",
    name: "Rahul Sharma",
    role: "Project Manager",
    company: "Tech Startup",
  },
  {
    id: 2,
    quote:
      "Working with Ashish was a great experience. He understood the requirements quickly and implemented features with clean, maintainable code.",
    name: "Priya Patel",
    role: "Senior Developer",
    company: "Software Company",
  },
  {
    id: 3,
    quote:
      "Ashish's ability to bridge design and development is remarkable. He built exactly what we envisioned, with animations that felt premium and smooth.",
    name: "Arjun Mehta",
    role: "Product Designer",
    company: "Design Studio",
  },
];

export const services = [
  {
    id: 1,
    icon: "Monitor",
    title: "Frontend Development",
    description:
      "Modern, responsive interfaces using React, Tailwind CSS, and Framer Motion with a focus on performance and user experience.",
    tags: ["React", "Tailwind", "Framer Motion"],
  },
  {
    id: 2,
    icon: "Layers",
    title: "Full Stack Development",
    description:
      "End-to-end MERN applications — from database design and REST APIs to React frontends and deployment.",
    tags: ["MongoDB", "Express", "React", "Node.js"],
  },
  {
    id: 3,
    icon: "Server",
    title: "API Development",
    description:
      "Secure, scalable REST APIs with proper authentication, validation, error handling, and documentation.",
    tags: ["Node.js", "Express", "JWT", "REST"],
  },
  {
    id: 4,
    icon: "Figma",
    title: "UI Implementation",
    description:
      "Pixel-perfect implementation from Figma or design mockups with clean, semantic HTML and CSS.",
    tags: ["HTML", "CSS", "React", "Pixel-Perfect"],
  },
  {
    id: 5,
    icon: "Zap",
    title: "Performance Optimization",
    description:
      "Improve load times, runtime performance, and responsiveness with code splitting, lazy loading, and best practices.",
    tags: ["Lighthouse", "Web Vitals", "Optimization"],
  },
  {
    id: 6,
    icon: "Shield",
    title: "Authentication Systems",
    description:
      "Secure user authentication with JWT, session management, role-based access control, and protection against common vulnerabilities.",
    tags: ["JWT", "Auth", "Security", "RBAC"],
  },
];

export const processSteps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Understanding your goals, users, and constraints through research and deep conversation.",
    icon: "Search",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "Mapping out architecture, data models, component structure, and development milestones.",
    icon: "FileText",
  },
  {
    number: "03",
    title: "Design",
    description:
      "Creating wireframes, design systems, and prototypes aligned with brand and user needs.",
    icon: "Layers",
  },
  {
    number: "04",
    title: "Develop",
    description:
      "Writing clean, modular, well-documented code following best practices and conventions.",
    icon: "Code2",
  },
  {
    number: "05",
    title: "Test",
    description:
      "Rigorous testing across devices, browsers, and screen sizes to ensure quality and reliability.",
    icon: "CheckCircle",
  },
  {
    number: "06",
    title: "Deploy",
    description:
      "Launching with proper CI/CD, performance monitoring, and post-deployment support.",
    icon: "Rocket",
  },
];
