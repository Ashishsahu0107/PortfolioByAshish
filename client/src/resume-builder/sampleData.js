export const sampleResumeData = {
  personalInfo: {
    fullName: "Ashish Sahu",
    headline: "Full Stack Developer | MERN & React Specialist",
    email: "ashishsahu01072005@gmail.com",
    phone: "+91 98765 43210",
    location: "India",
    profilePhoto: "",
    linkedin: "https://linkedin.com/in/ashishsahu0107",
    github: "https://github.com/Ashishsahu0107",
    portfolioUrl: "https://iamashish.vercel.app",
  },
  summary:
    "Proactive Full Stack Developer and Computer Science & Engineering undergraduate (Class of 2026) specializing in the MERN stack (MongoDB, Express, React, Node.js). Strong foundations in Data Structures and Algorithms in Java, RESTful API architecture, responsive modern UIs, and cloud deployments. Proven track record of architecting scalable educational platforms, e-commerce systems, and high-performance interactive web applications with sub-2s latency.",
  skills: {
    languages: [
      "JavaScript (ES6+)",
      "TypeScript",
      "Java",
      "SQL",
      "HTML5",
      "CSS3",
    ],
    frontend: [
      "React 19",
      "Next.js",
      "Tailwind CSS",
      "Redux Toolkit",
      "GSAP 3",
      "Vite",
    ],
    backend: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "JWT Auth",
      "WebSocket / Socket.io",
      "Microservices",
    ],
    databases: [
      "MongoDB",
      "Mongoose",
      "MongoDB Atlas",
      "MySQL",
      "Redis (Basic)",
    ],
    toolsDevOps: [
      "Git",
      "GitHub",
      "Postman",
      "Docker (Basics)",
      "Vercel",
      "Linux",
      "VS Code",
    ],
  },
  workExperience: [
    {
      id: "exp-1",
      title: "Full Stack Developer (Freelance & Open Source)",
      company: "Independent Technical Projects",
      location: "Remote",
      startDate: "Jan 2024",
      endDate: "Present",
      current: true,
      description:
        "• Designed and deployed high-performance full-stack web applications for academic and client use cases.\n• Architected RESTful API micro-services with token-based authentication, request sanitization, and structured error boundaries.\n• Built responsive, accessible UI design systems adhering to WCAG 2.1 AA contrast standards using React and Tailwind CSS.\n• Improved Core Web Vitals to consistently achieve Lighthouse performance scores of 95+ across mobile and desktop.",
    },
    {
      id: "exp-2",
      title: "Frontend Engineering Contributor",
      company: "Developer Community Initiatives",
      location: "Remote",
      startDate: "Jul 2023",
      endDate: "Dec 2023",
      current: false,
      description:
        "• Contributed to modern component libraries, improving accessibility and keyboard navigation compliance.\n• Optimized image rendering pipelines and dynamic bundle splitting, reducing initial JavaScript chunk size by 35%.\n• Collaborated on open-source repositories with clean Git commit hygiene, code reviews, and issue triage.",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Institutional Learning Management System (LMS)",
      technologies: "React 19, Node.js, Express, MongoDB, Tailwind CSS, JWT",
      description:
        "Comprehensive full-stack EdTech platform featuring Role-Based Access Control (Admin, Instructor, Student), interactive auto-graded quizzes with time limits, assignment submission workflows, institutional attendance tracking, and real-time student completion analytics.",
      githubUrl: "https://github.com/Ashishsahu0107/lms-platform",
      liveUrl: "https://github.com/Ashishsahu0107/lms-platform",
    },
    {
      id: "proj-2",
      name: "Full Stack E-Commerce Cloud Storefront",
      technologies: "React, Node.js, Express, MongoDB Atlas, REST APIs",
      description:
        "High-throughput online retail storefront with faceted product filtering, debounced search, persistent shopping cart state, checkout order fulfillment pipeline, and an administrative inventory control dashboard.",
      githubUrl: "https://github.com/Ashishsahu0107/ecommerce-platform",
      liveUrl: "https://github.com/Ashishsahu0107/ecommerce-platform",
    },
    {
      id: "proj-3",
      name: "Real-Time Collaborative Kanban Platform",
      technologies: "React, Express, MongoDB, WebSockets, Tailwind",
      description:
        "Agile project management board featuring smooth drag-and-drop task movements across workflow columns, task assignment chips, deadline alerts, markdown-formatted descriptions, and instantaneous multi-client synchronization.",
      githubUrl: "https://github.com/Ashishsahu0107/task-manager",
      liveUrl: "https://github.com/Ashishsahu0107/task-manager",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree:
        "Bachelor of Technology (B.Tech) in Computer Science & Engineering",
      institution: "Technical University",
      location: "India",
      graduationYear: "2022 — 2026",
      gradeGpa: "8.5 / 10.0 CGPA",
      details:
        "Core Coursework: Data Structures & Algorithms (Java), Database Management Systems (DBMS), Operating Systems, Computer Networks, Object-Oriented Software Design.",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Full Stack Web Development with MERN",
      issuer: "Professional Web Track",
      date: "2024",
      credentialUrl: "https://linkedin.com/in/ashishsahu0107",
    },
    {
      id: "cert-2",
      name: "Data Structures & Algorithms in Java Mastery",
      issuer: "Competitive Programming Track",
      date: "2023",
      credentialUrl: "https://github.com/Ashishsahu0107",
    },
  ],
  achievements: [
    {
      id: "ach-1",
      title: "Solved 200+ Algorithmic Challenges",
      issuer: "Competitive Coding Platforms",
      year: "2024",
      description:
        "Demonstrated computational efficiency across Arrays, Trees, Graphs, and Dynamic Programming in Java.",
    },
    {
      id: "ach-2",
      title: "20+ Open Source Technical Repositories",
      issuer: "GitHub Community",
      year: "2024",
      description:
        "Maintained disciplined commit workflows, documentation, and clean modular code standards across public repositories.",
    },
  ],
};

export const emptyResumeData = {
  personalInfo: {
    fullName: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    profilePhoto: "",
    linkedin: "",
    github: "",
    portfolioUrl: "",
  },
  summary: "",
  skills: {
    languages: [],
    frontend: [],
    backend: [],
    databases: [],
    toolsDevOps: [],
  },
  workExperience: [],
  projects: [],
  education: [],
  certifications: [],
  achievements: [],
};
