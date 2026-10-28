export const initialDeveloper = {
  name: "Ashish Sahu",
  firstName: "Ashish",
  lastName: "Sahu",
  role: "Full Stack Developer",
  tagline: "Editorial craft meets engineering precision.",
  graduatingYear: "2026",
  courseStarted: "2022",
  degree: "B.Tech in Computer Science and Engineering",
  location: "India",
  locationShort: "India",
  email: "ashishsahu01072005@gmail.com",
  github: "https://github.com/Ashishsahu0107",
  linkedin: "https://linkedin.com/in/ashishsahu0107",
  resumeUrl: "/resume/ashish-sahu-resume.pdf",
  availableForWork: true,
  statusPhrase: "Available for opportunities",
  bio: "I am a Computer Science and Engineering undergraduate (Class of 2026) and passionate Full Stack Developer specializing in the MERN stack. I build robust, scalable web applications that combine high-performance backends with refined editorial user interfaces. With a strong foundation in Data Structures and Algorithms in Java, my focus is crafting software that is both architecturally sound and delightful to use.",
  philosophy: "I care about the details users notice, and the engineering they never have to.",
  emailjsServiceId: "service_mshfzaf",
  emailjsTemplateId: "template_0rruyps",
  emailjsPublicKey: "3JGbJNsXsGW1gQJGu",
};

export const initialAbout = {
  bio: initialDeveloper.bio,
  philosophy: initialDeveloper.philosophy,
  focusAreas: [
    {
      id: "focus_1",
      title: "Frontend Development",
      description: "Modern component architecture with React, Next.js, Tailwind CSS, and fluid GSAP micro-animations.",
      icon: "Code2",
    },
    {
      id: "focus_2",
      title: "Backend Engineering",
      description: "RESTful API design, Express.js servers, JWT authentication, and secure middleware pipelines.",
      icon: "Server",
    },
    {
      id: "focus_3",
      title: "Database Architecture",
      description: "Data modeling, schema validation, and indexing with MongoDB, Mongoose, and relational MySQL.",
      icon: "Database",
    },
    {
      id: "focus_4",
      title: "Data Structures & Java",
      description: "Algorithmic problem solving, clean OOP patterns, and computational complexity optimization.",
      icon: "Cpu",
    },
    {
      id: "focus_5",
      title: "Developer Tooling & CI/CD",
      description: "Git version control, Postman API testing, Vite build optimizations, and automated deployment.",
      icon: "Terminal",
    },
  ],
  stats: [
    { id: "stat_1", value: "20+", label: "Projects Built" },
    { id: "stat_2", value: "08+", label: "Technologies" },
    { id: "stat_3", value: "01+", label: "Years Experience" },
    { id: "stat_4", value: "2026", label: "Graduating Batch" },
  ],
};

export const initialSkills = [
  {
    id: "frontend",
    label: "Frontend",
    color: "var(--color-accent)",
    skills: [
      { name: "React", description: "Component-based UI library", level: 90, icon: "Code2" },
      { name: "JavaScript", description: "Core language for the web", level: 88, icon: "FileCode" },
      { name: "HTML5", description: "Semantic web structure", level: 95, icon: "Globe" },
      { name: "CSS3", description: "Styling & animations", level: 90, icon: "Palette" },
      { name: "Tailwind CSS", description: "Utility-first CSS framework", level: 88, icon: "Wind" },
      { name: "React Router", description: "Client-side routing", level: 85, icon: "Route" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    color: "var(--color-accent)",
    skills: [
      { name: "Node.js", description: "JavaScript runtime", level: 85, icon: "Server" },
      { name: "Express.js", description: "Fast, minimal web framework", level: 85, icon: "Zap" },
      { name: "REST APIs", description: "API design & development", level: 88, icon: "Network" },
      { name: "Authentication", description: "Secure user auth systems", level: 82, icon: "ShieldCheck" },
      { name: "JWT", description: "Token-based auth", level: 80, icon: "KeyRound" },
    ],
  },
  {
    id: "database",
    label: "Database",
    color: "var(--color-accent)",
    skills: [
      { name: "MongoDB", description: "NoSQL document database", level: 85, icon: "Database" },
      { name: "MySQL", description: "Relational database", level: 75, icon: "TableProperties" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    color: "var(--color-accent)",
    skills: [
      { name: "Git", description: "Version control", level: 88, icon: "GitBranch" },
      { name: "GitHub", description: "Code hosting & collaboration", level: 88, icon: "Github" },
      { name: "VS Code", description: "Primary code editor", level: 95, icon: "Terminal" },
      { name: "Postman", description: "API testing", level: 85, icon: "Send" },
    ],
  },
  {
    id: "other",
    label: "Other",
    color: "var(--color-accent)",
    skills: [
      { name: "Java", description: "Object-oriented programming", level: 78, icon: "Coffee" },
      { name: "DSA", description: "Data structures & algorithms", level: 75, icon: "Binary" },
      { name: "IoT", description: "Internet of Things", level: 70, icon: "Radio" },
      { name: "Cloud Computing", description: "Cloud infrastructure basics", level: 68, icon: "Cloud" },
      { name: "Computer Vision", description: "Image processing & ML", level: 65, icon: "Eye" },
    ],
  },
];

export const initialProjects = [
  {
    id: "proj_01",
    number: "01",
    title: "Learning Management System (LMS)",
    subtitle: "Full-Stack EdTech Platform with RBAC & Dynamic Quiz Engine",
    category: "Full Stack Web App",
    year: "2024",
    color: "#1E3A8A",
    shortDescription:
      "A full-scale educational platform built with React, Node.js, Express, and MongoDB featuring role-based dashboards for students, instructors, and administrators.",
    description:
      "Designed and engineered an institutional Learning Management System that addresses the friction in modern online education. Includes course authoring, progress tracking, dynamic quizzes with automatic grading, and comprehensive student analytics.",
    problem:
      "Educational institutions struggle with fragmented tools for course delivery, grading, and student progress tracking.",
    solution:
      "A centralized platform supporting custom video hosting, interactive quiz evaluations, and distinct dashboard experiences tailored to students and instructors.",
    features: [
      "Role-Based Access Control (Student, Instructor, Admin)",
      "Course authoring with rich media embeds and modular lesson builder",
      "Dynamic timed quiz system with instantaneous grading and review",
      "Real-time student progress tracking and visual course analytics",
      "Responsive UI built with Tailwind CSS and React Hook Form",
    ],
    tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JWT"],
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JWT"],
    github: "https://github.com/Ashishsahu0107",
    live: "https://iamashish.vercel.app",
    featured: true,
  },
  {
    id: "proj_02",
    number: "02",
    title: "Interactive Full-Stack Resume Builder",
    subtitle: "Multi-Template Document Generator with A4 PDF Precision",
    category: "Web Application / Productivity",
    year: "2024",
    color: "#065F46",
    shortDescription:
      "An editorial-grade resume authoring platform featuring live split-screen previewing, multiple design templates, and high-DPI client-side PDF export.",
    description:
      "Engineered a production-ready resume builder providing job seekers with instantaneous typographic feedback across multiple industry-tested templates. Supports ATS-friendly layouts, developer-focused formats, and executive sidebar designs.",
    problem:
      "Traditional resume builders lock users into restrictive paywalls or produce malformed, non-ATS compliant PDF files.",
    solution:
      "A free, fast, local-first web app with real-time vector rendering, auto-saving draft storage, and 1-click A4 PDF export using HTML2Canvas and jsPDF.",
    features: [
      "Live two-column editor with synchronized real-time document preview",
      "6 curated templates: Modern, Minimal, Professional, Developer, Elegant, Compact",
      "1-Click high-fidelity vector PDF generation matching exact screen layout",
      "Local persistence with auto-save draft recovery",
      "Granular customization for technical skills, achievements, and project links",
    ],
    tags: ["React 19", "Tailwind CSS", "jsPDF", "html2canvas", "LocalStorage"],
    tech: ["React 19", "Tailwind CSS", "jsPDF", "html2canvas", "LocalStorage"],
    github: "https://github.com/Ashishsahu0107",
    live: "https://iamashish.vercel.app/resume-builder",
    featured: true,
  },
  {
    id: "proj_03",
    number: "03",
    title: "Portfolio & Editorial Digital Showcase",
    subtitle: "Architectural Personal Website with Physics-Based UI & Custom Admin Console",
    category: "Portfolio / Creative Web",
    year: "2024",
    color: "#4C1D95",
    shortDescription:
      "A high-performance personal web platform combining refined serif typography, interactive desk lamp physics, secret authenticated login, and a full CMS backend.",
    description:
      "Built to demonstrate mastery across full-stack engineering and visual design. Features smooth GPU-accelerated GSAP scroll reveals, an interactive 3D-styled desk lamp with Web Audio click sounds, and a comprehensive admin console.",
    problem:
      "Generic template portfolios fail to reflect deep full-stack engineering competency and lack persistent dynamic content control.",
    solution:
      "A custom-coded platform powered by Express.js REST APIs, persistent database storage, and fluid micro-animations that make browsing memorable.",
    features: [
      "Editorial design system with dual light/dark architectural themes",
      "Interactive 3D-styled desk lamp with realistic pull-chain physics and Web Audio",
      "Protected secret admin console with JWT authentication and full CRUD controls",
      "Dynamic section management and integrated Form Builder engine",
      "Consistently 95+ Lighthouse performance scores and sub-second load times",
    ],
    tags: ["React 19", "Node.js", "Express", "Tailwind CSS", "GSAP", "REST API"],
    tech: ["React 19", "Node.js", "Express", "Tailwind CSS", "GSAP", "REST API"],
    github: "https://github.com/Ashishsahu0107",
    live: "https://iamashish.vercel.app",
    featured: true,
  },
];

export const initialExperience = [
  {
    id: "btech-cse",
    type: "education",
    title: "B.Tech in Computer Science & Engineering",
    organization: "Technical University",
    location: "India",
    period: "2022 — 2026",
    status: "Graduating Batch of 2026",
    description:
      "Pursuing a 4-year degree in Computer Science and Engineering with a strong focus on software engineering fundamentals, algorithm design, and modern web application development.",
    highlights: [
      "Core Coursework: Data Structures & Algorithms (Java), DBMS, OS, Computer Networks",
      "Software Engineering & Object-Oriented Design principles",
      "Built multiple full-stack academic capstone projects with high distinction",
      "Active participant in technical symposiums and competitive coding challenges",
    ],
  },
  {
    id: "fullstack-lead",
    type: "work",
    title: "Full Stack Developer (MERN Stack)",
    organization: "Independent & Open Source Projects",
    location: "Remote",
    period: "2024 — Present",
    status: "Active",
    description:
      "Architecting end-to-end full-stack web applications from database schema design to responsive UI implementation and deployment.",
    highlights: [
      "Engineered an institutional Learning Management System (LMS) serving 50+ test users with role-based auth and automated quizzes",
      "Designed clean RESTful API micro-services with Express.js, MongoDB indexing, and JWT authentication",
      "Crafted high-fidelity web experiences combining React 19, Tailwind CSS, and GPU-accelerated GSAP animations",
      "Optimized client-side web vitals to consistently achieve sub-2s load times and 95+ Lighthouse scores",
    ],
  },
  {
    id: "dsa-milestone",
    type: "certification",
    title: "Data Structures & Algorithms in Java",
    organization: "Competitive Programming & Problem Solving",
    location: "Online",
    period: "2023 — Present",
    status: "Continuous Mastery",
    description:
      "Deepened algorithmic problem solving and time-complexity optimization through rigorous problem sets in Java.",
    highlights: [
      "Mastered key computational structures: Arrays, Linked Lists, Binary Trees, Heaps, and Graphs",
      "Implemented recursion, backtracking, and Dynamic Programming algorithms from scratch",
      "Solved 200+ coding challenges with emphasis on edge cases and optimal O(n) / O(log n) efficiency",
    ],
  },
  {
    id: "web-cert",
    type: "certification",
    title: "Advanced Web Application Architecture",
    organization: "Self-Paced Professional Tracks",
    location: "Online",
    period: "2023 — 2024",
    status: "Completed",
    description:
      "Comprehensive mastery of contemporary full-stack web technologies, modern JavaScript (ES6+), and responsive UI systems.",
    highlights: [
      "Component lifecycle, custom hooks, and concurrent React rendering patterns",
      "RESTful API design best practices, CORS configuration, and security middleware",
      "Database schema normalization and aggregation pipelines in MongoDB",
    ],
  },
];

export const initialSections = [
  { id: "hero", name: "Hero Section", slug: "home", type: "builtin", enabled: true, order: 1, desc: "Introductory header with animated status and portrait" },
  { id: "about", name: "About & Philosophy", slug: "about", type: "builtin", enabled: true, order: 2, desc: "Personal bio, focus pillars, and statistics" },
  { id: "skills", name: "Skills & Toolkit", slug: "skills", type: "builtin", enabled: true, order: 3, desc: "Disciplines, technologies, and self-assessment metrics" },
  { id: "projects", name: "Selected Works", slug: "projects", type: "builtin", enabled: true, order: 4, desc: "Curated engineering projects with details" },
  {
    id: "process",
    name: "Engineering Process",
    slug: "process",
    type: "builtin",
    enabled: true,
    order: 5,
    desc: "5-step architectural lifecycle from discovery to ship",
    content: {
      heading: "How ideas become software.",
      subheading: "A systematic approach that balances high-speed iteration with architectural rigor.",
      items: [
        {
          step: "01",
          phase: "Discover",
          tagline: "Problem Framing & Architecture",
          description: "Deeply understanding the user requirements, scoping technical constraints, defining data models, and identifying edge cases before writing a line of code.",
          deliverables: [
            "Requirements gathering & user flows",
            "API contract specification",
            "Database schema diagramming"
          ]
        },
        {
          step: "02",
          phase: "Design",
          tagline: "UI & Technical Blueprints",
          description: "Establishing design systems, responsive wireframes, component hierarchies, and state management strategies to ensure a cohesive experience.",
          deliverables: [
            "Typography & color tokens",
            "Component hierarchy planning",
            "Accessible interactive states"
          ]
        },
        {
          step: "03",
          phase: "Develop",
          tagline: "Clean, Modular Coding",
          description: "Writing modular, self-documenting code with reusable React components, custom hooks, and robust error handling across both client and server.",
          deliverables: [
            "Semantic HTML5 & responsive CSS",
            "Reusable component library",
            "Strict data validation"
          ]
        },
        {
          step: "04",
          phase: "Integrate",
          tagline: "APIs, Persistence & Auth",
          description: "Connecting frontend interfaces to high-throughput REST endpoints, managing database indexes, configuring JWT security, and optimizing query speeds.",
          deliverables: [
            "Secure REST API endpoints",
            "MongoDB Mongoose pipelines",
            "Protected auth routes & sessions"
          ]
        },
        {
          step: "05",
          phase: "Test & Deploy",
          tagline: "Vitals Optimization & Launch",
          description: "Auditing cross-device responsiveness, tuning Core Web Vitals, verifying WCAG AA contrast compliance, and automating production deployments.",
          deliverables: [
            "Lighthouse performance ≥ 95 audit",
            "Cross-browser responsive testing",
            "CI/CD production deployment"
          ]
        }
      ]
    }
  },
  { id: "experience", name: "Experience & Education", slug: "experience", type: "builtin", enabled: true, order: 6, desc: "Chronological academic and technical milestones" },
  { id: "contact", name: "Contact & Connect", slug: "contact", type: "builtin", enabled: true, order: 7, desc: "Get in touch form, links, and status" },
];

export const initialForms = [
  {
    id: "form_contact",
    name: "General Contact Form",
    slug: "contact",
    description: "Default contact form for portfolio visitor inquiries.",
    enabled: true,
    submitButtonText: "Send Message",
    successMessage: "Thank you for reaching out! I will review your message and reply promptly.",
    fields: [
      { id: "f_name", name: "name", label: "Your Full Name", type: "text", placeholder: "e.g. Jane Doe", required: true },
      { id: "f_email", name: "email", label: "Email Address", type: "email", placeholder: "jane@company.com", required: true },
      { id: "f_subject", name: "subject", label: "Project / Subject", type: "text", placeholder: "e.g. Full Stack Collaboration", required: false },
      { id: "f_message", name: "message", label: "Message", type: "textarea", placeholder: "Tell me about your project, timeline, or idea…", required: true },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const initialResumeData = {
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
    languages: ["JavaScript (ES6+)", "TypeScript", "Java", "SQL", "HTML5", "CSS3"],
    frontend: ["React 19", "Next.js", "Tailwind CSS", "Redux Toolkit", "GSAP 3", "Vite"],
    backend: ["Node.js", "Express.js", "REST APIs", "JWT Auth", "WebSocket / Socket.io", "Microservices"],
    databases: ["MongoDB", "Mongoose", "MongoDB Atlas", "MySQL", "Redis (Basic)"],
    toolsDevOps: ["Git", "GitHub", "Postman", "Docker (Basics)", "Vercel", "Linux", "VS Code"],
  },
  workExperience: [
    {
      id: "exp-1",
      title: "Full Stack Developer (Freelance & Open Source)",
      company: "Independent Engineering",
      location: "Remote / India",
      startDate: "2023-01",
      endDate: "",
      current: true,
      description:
        "Architecting production-ready full stack web applications using React, Node.js, Express, and MongoDB. Designing high-availability RESTful APIs with JWT authentication, RBAC authorization, and automated schema validation. Engineering responsive, high-fidelity UI systems with Tailwind CSS and GSAP micro-animations.",
    },
    {
      id: "exp-2",
      title: "Frontend Developer Intern",
      company: "Tech Innovation Labs",
      location: "India",
      startDate: "2022-06",
      endDate: "2022-12",
      current: false,
      description:
        "Developed modular client components across multiple web portals, boosting lighthouse performance scores by 35%. Integrated backend REST endpoints with optimistic UI updates and error boundary fallbacks.",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "BrainWave - Modern AI Landing Page",
      technologies: "React 19, Tailwind CSS, GSAP, Vite",
      description:
        "Futuristic AI SaaS product landing page with complex scroll triggers, floating hero elements, Bento-grid feature displays, and smooth mobile micro-interactions.",
      githubUrl: "https://github.com/Ashishsahu0107/BrainWave",
      liveUrl: "https://brainwave-ashish.vercel.app",
    },
    {
      id: "proj-2",
      name: "Interactive Full-Stack Resume Builder",
      technologies: "React 19, Tailwind CSS, html2canvas, jsPDF, Express, MongoDB",
      description:
        "Editorial-grade resume authoring platform featuring live split-screen previewing, 6 curated ATS-friendly templates, and high-DPI client-side PDF export.",
      githubUrl: "https://github.com/Ashishsahu0107/PortfolioByAshish",
      liveUrl: "https://iamashish.vercel.app/resume-builder",
    },
    {
      id: "proj-3",
      name: "CarePulse - Patient Healthcare Portal",
      technologies: "Next.js 14, TypeScript, Tailwind CSS, Appwrite, Twilio SMS",
      description:
        "Healthcare management portal featuring administrative appointment scheduling, SMS alerts, passkey security, and document handling.",
      githubUrl: "https://github.com/Ashishsahu0107/CarePulse",
      liveUrl: "https://carepulse-ashish.vercel.app",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Technology in Computer Science & Engineering",
      institution: "State Technological University",
      location: "India",
      startDate: "2022",
      endDate: "2026",
      gpa: "8.6 / 10.0",
      highlights:
        "Core coursework: Data Structures & Algorithms, Object-Oriented Programming (Java), Database Management Systems, Computer Networks, Operating Systems.",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Full Stack Web Development Specialization",
      issuer: "Coursera / Meta",
      issueDate: "2024",
      credentialUrl: "",
    },
    {
      id: "cert-2",
      name: "Data Structures & Algorithms in Java",
      issuer: "HackerRank & LeetCode Certified",
      issueDate: "2023",
      credentialUrl: "",
    },
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Professional Working Proficiency" },
    { id: "lang-2", language: "Hindi", proficiency: "Native / Bilingual" },
  ],
  awards: [
    {
      id: "award-1",
      title: "Top Performer - University Hackathon",
      issuer: "College Tech Fest",
      date: "2024",
      description: "Ranked in top 3 for developing a real-time collaborative workspace tool within 36 hours.",
    },
  ],
};

export const initialResumeTemplates = [
  {
    id: "resume_modern",
    templateId: "modern",
    title: "Modern",
    tagline: "Modern Blue & Balanced",
    badge: "Recommended",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    description: "Vibrant blue accents, modern typography, badge skills, and clear timeline hierarchy.",
    accent: "#2563eb",
    status: "approved",
    isApproved: true,
    approvedAt: new Date("2026-01-01T00:00:00.000Z"),
    resumeData: initialResumeData,
    pdfUrl: "/resume/ashish-sahu-resume.pdf",
    version: 1,
  },
  {
    id: "resume_minimal",
    templateId: "minimal",
    title: "Minimal",
    tagline: "Ultra-Clean ATS Standard",
    badge: "ATS 99%",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "Monochrome high-contrast serif/sans layout designed for zero ATS parsing errors.",
    accent: "#18181b",
    status: "draft",
    isApproved: false,
    approvedAt: null,
    resumeData: initialResumeData,
    pdfUrl: "",
    version: 1,
  },
  {
    id: "resume_professional",
    templateId: "professional",
    title: "Professional",
    tagline: "Executive Sidebar",
    badge: "Corporate",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    description: "Navy blue left sidebar with quick contact & skill pills, structured experience right pane.",
    accent: "#1e3a8a",
    status: "draft",
    isApproved: false,
    approvedAt: null,
    resumeData: initialResumeData,
    pdfUrl: "",
    version: 1,
  },
  {
    id: "resume_developer",
    templateId: "developer",
    title: "Developer",
    tagline: "Terminal & Code Centric",
    badge: "Tech Focus",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    description: "Dark terminal header with git branch styling, monospace tech tags, and code accents.",
    accent: "#059669",
    status: "draft",
    isApproved: false,
    approvedAt: null,
    resumeData: initialResumeData,
    pdfUrl: "",
    version: 1,
  },
  {
    id: "resume_elegant",
    templateId: "elegant",
    title: "Elegant",
    tagline: "Editorial Warm Serif",
    badge: "Refined",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
    description: "Editorial typography with warm cream tones, tailored for creative engineering portfolios.",
    accent: "#b45309",
    status: "draft",
    isApproved: false,
    approvedAt: null,
    resumeData: initialResumeData,
    pdfUrl: "",
    version: 1,
  },
  {
    id: "resume_compact",
    templateId: "compact",
    title: "Compact",
    tagline: "High-Density Single Page",
    badge: "1-Page Ready",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    description: "Dense 2-column layout engineered to fit maximum technical depth into minimal vertical space.",
    accent: "#7c3aed",
    status: "draft",
    isApproved: false,
    approvedAt: null,
    resumeData: initialResumeData,
    pdfUrl: "",
    version: 1,
  },
];

