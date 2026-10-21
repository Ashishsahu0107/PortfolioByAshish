export const projects = [
  {
    id: "lms",
    number: "01",
    title: "Learning Management System",
    subtitle: "Full-Stack EdTech Platform",
    category: "Full Stack Application",
    year: "2025",
    color: "#24483A",
    shortDescription:
      "A comprehensive institutional LMS with role-based access control, auto-graded quizzes, course management, and attendance tracking.",
    description:
      "A complete Learning Management System architected for educational institutions. Provides role-tailored dashboards for Administrators, Instructors, and Students. Instructors can curate structured courses, author auto-graded quizzes with time limits, and review student assignment submissions. Students can track video lesson progress, receive instant quiz evaluations, and monitor course completion metrics in real time.",
    problem:
      "Most existing academic platforms are either fragmented across disparate tools or bloated and sluggish on student mobile devices.",
    solution:
      "Built an integrated MERN platform with token-based RBAC, normalized MongoDB schemas, responsive UI with Tailwind, and an analytics pipeline for actionable student progress.",
    features: [
      "Role-Based Access Control (Admin, Instructor, Student) with JWT",
      "Course authoring with lesson modules, resources & video embedding",
      "Interactive multi-type quizzes with automated instant grading",
      "Assignment submission portal with grading and feedback workflow",
      "Institutional attendance tracking and visual absence logs",
      "Comprehensive analytics dashboard for completion rates & grades",
      "Automated email notifications via transactional service",
      "Optimized sub-2s initial load time with code-splitting",
    ],
    tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JWT"],
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JWT"],
    github: "https://github.com/Ashishsahu0107/lms-platform",
    live: "https://github.com/Ashishsahu0107/lms-platform",
    featured: true,
  },
  {
    id: "portfolio-2",
    number: "02",
    title: "Developer Portfolio 2.0",
    subtitle: "Editorial Web Platform",
    category: "Frontend & Motion Engine",
    year: "2026",
    color: "#68745D",
    shortDescription:
      "An editorial craft developer portfolio pairing Playfair Display and Inter typography with GPU-accelerated GSAP timelines and accessible design.",
    description:
      "This application — built with React 19, Vite, Tailwind CSS v4, and GSAP 3.12. Features an editorial layout inspired by high-end technical publications, with reduced-motion fallbacks, custom interactive cursor physics, dynamic theme transitions, and structured JSON-LD Person schemas for search engine knowledge graphs.",
    problem:
      "Standard developer portfolios often rely on generic dark templates that fail to convey architectural precision or visual craftsmanship.",
    solution:
      "Engineered an editorial identity with bespoke organic color tokens, decoupled TypeScript/JS data single source of truth, and strict WCAG AA contrast compliance.",
    features: [
      "Custom cursor engine with interactive magnetic hover states",
      "GPU-accelerated GSAP ScrollTrigger reveals and timeline sequencing",
      "Adaptive dark / light theme engine with zero-flash persistence",
      "Full keyboard navigability and WCAG AA accessibility compliance",
      "SEO rich snippets, OpenGraph 1200x630 cards and JSON-LD schema",
      "Responsive across 320px mobile to 4K ultrawide displays",
      "1-click resume download and reactive contact pipeline",
      "Perfect Lighthouse score optimization (≥95 performance target)",
    ],
    tags: ["React 19", "Vite", "Tailwind CSS", "GSAP 3.12", "SEO"],
    tech: ["React 19", "Vite", "Tailwind CSS", "GSAP 3.12", "SEO"],
    github: "https://github.com/Ashishsahu0107/iamashish",
    live: "https://iamashish.vercel.app",
    featured: true,
  },
  {
    id: "ecommerce-hub",
    number: "03",
    title: "E-Commerce Cloud Storefront",
    subtitle: "Modern Digital Commerce",
    category: "Full Stack Application",
    year: "2025",
    color: "#8A9B87",
    shortDescription:
      "A scalable online retail platform featuring real-time product search, filtering, persistent cart, checkout pipeline, and administrative inventory.",
    description:
      "A modern full-stack e-commerce solution built with React and Node.js. Features full catalog browsing with faceted category filters and text search, customer wishlist, optimistic UI cart management, and an administration console for product inventory restocking, price updates, and customer order fulfillment.",
    problem:
      "Small boutique merchants require snappy, low-latency storefronts without high monthly SaaS lock-in or fragile third-party plugins.",
    solution:
      "Implemented a lightweight, high-throughput REST API with MongoDB indexing, client-side caching, and responsive product cards with image zoom.",
    features: [
      "Faceted product filtering by category, price range, and ratings",
      "Instant debounced search across product titles and tags",
      "Persistent cart state synchronized across sessions",
      "Order placement workflow with invoice generation",
      "Admin panel with real-time stock counters and status toggles",
      "Customer reviews and rating calculations with verified badge",
      "Responsive product image gallery with smooth preview hover",
      "RESTful API protected by rate limiting and input sanitization",
    ],
    tags: ["React", "Node.js", "Express", "MongoDB", "REST APIs"],
    tech: ["React", "Node.js", "Express", "MongoDB", "REST APIs"],
    github: "https://github.com/Ashishsahu0107/ecommerce-platform",
    live: "https://github.com/Ashishsahu0107/ecommerce-platform",
    featured: true,
  },
  {
    id: "task-kanban",
    number: "04",
    title: "Real-Time Kanban Platform",
    subtitle: "Collaborative Project Workspace",
    category: "Real-Time Web Application",
    year: "2025",
    color: "#354F52",
    shortDescription:
      "A collaborative team project board with drag-and-drop workflow columns, priority tagging, deadlines, and multi-user synchronization.",
    description:
      "A Kanban-style project management web application built for agile engineering teams. Features smooth drag-and-drop column transitions, markdown-supported task detail drawers, assignee badges, deadline reminders, and instant updates across connected team members.",
    problem:
      "Teams collaborating on tight sprints need clear visual workflow pipelines without the clutter of heavyweight enterprise suites.",
    solution:
      "Architected an intuitive board interface with optimistic UI updates, conflict prevention logic, and clean activity logging.",
    features: [
      "Intuitive drag-and-drop task movements across workflow columns",
      "Custom columns (Backlog, In Progress, Review, Completed)",
      "Priority chips, due date tags, and assignees with initials avatars",
      "Markdown descriptions with task checklists and progress percentage",
      "Search and tag filters for rapid task triage",
      "Activity audit log tracking every column change and assignment",
      "Responsive touch-friendly gestures on mobile and tablet",
      "Exportable project summary reports",
    ],
    tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    github: "https://github.com/Ashishsahu0107/task-manager",
    live: "https://github.com/Ashishsahu0107/task-manager",
    featured: true,
  },
  {
    id: "dev-community",
    number: "05",
    title: "DevPulse Community Hub",
    subtitle: "Developer Discussions & Code Share",
    category: "Full Stack Social Platform",
    year: "2024",
    color: "#2F3E46",
    shortDescription:
      "A developer knowledge sharing forum with markdown formatting, syntax highlighting, upvoting, and tag-based discovery.",
    description:
      "An open community discussion and snippet exchange application where developers can ask technical questions, share architectural recipes, and collaborate on code solutions. Includes nested comments, bookmarking, and user profile activity heatmaps.",
    problem:
      "Engineering teams often lack a dedicated internal micro-forum for documenting architecture choices and sharing reusable code patterns.",
    solution:
      "Built a snappy forum system with full-text search, thread tagging, JWT sessions, and syntax-highlighted code blocks.",
    features: [
      "Thread creation with full Markdown support and live code preview",
      "Nested replies and community upvote ranking algorithms",
      "Tag-based question discovery and filtered search",
      "User reputation system and badge progression",
      "Bookmark collections for saved technical references",
      "Dark/light reading modes optimized for code blocks",
      "Responsive mobile view for on-the-go browsing",
      "Comprehensive REST endpoints with rate limiting",
    ],
    tags: ["React", "Node.js", "MongoDB", "Express", "Markdown"],
    tech: ["React", "Node.js", "MongoDB", "Express", "Markdown"],
    github: "https://github.com/Ashishsahu0107/devpulse-community",
    live: "https://github.com/Ashishsahu0107/devpulse-community",
    featured: true,
  },
  {
    id: "algo-visualizer",
    number: "06",
    title: "Algorithm Visualizer Engine",
    subtitle: "Interactive DSA Simulator",
    category: "Frontend Engineering & Algorithms",
    year: "2024",
    color: "#52796F",
    shortDescription:
      "An interactive visualizer for pathfinding, sorting algorithms, and binary trees with step-by-step playback and speed controls.",
    description:
      "An educational web application demonstrating how foundational computer science algorithms work under the hood. Features interactive step-throughs of Dijkstra, A*, QuickSort, MergeSort, and Tree Traversals with custom maze generation and real-time execution metrics.",
    problem:
      "Abstract algorithmic concepts are difficult to master without visual intuition of state changes and pointer movements.",
    solution:
      "Created an interactive canvas simulator with variable speed controls, step-by-step debugger, and computational complexity breakdowns.",
    features: [
      "Pathfinding visualizer: Dijkstra, A* Search, BFS, and DFS",
      "Sorting visualizer: QuickSort, MergeSort, HeapSort with sound effects",
      "Interactive maze generator (Recursive Division & Random Walls)",
      "Variable simulation speed controls and pause/step-through buttons",
      "Real-time operation counters for comparisons and array accesses",
      "Explanatory theoretical cards with Big-O time and space metrics",
      "Custom array input generator and randomizer",
      "Fluid 60 FPS requestAnimationFrame rendering loop",
    ],
    tags: ["React", "JavaScript", "Algorithms", "DSA", "Canvas API"],
    tech: ["React", "JavaScript", "Algorithms", "DSA", "Canvas API"],
    github: "https://github.com/Ashishsahu0107/algorithm-visualizer",
    live: "https://github.com/Ashishsahu0107/algorithm-visualizer",
    featured: true,
  },
];
