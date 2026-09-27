const gradients = {
  blue: "linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%)",
  sky: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
  purple: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
  green: "linear-gradient(135deg, #059669 0%, #34d399 100%)",
  orange: "linear-gradient(135deg, #d97706 0%, #fbbf24 100%)",
};

export const projects = [
  {
    id: "lms",
    number: "01",
    title: "Learning Management System",
    subtitle: "Full-Stack EdTech Platform",
    shortDescription:
      "A full-stack LMS platform with role-based authentication, courses, quizzes, assignments, attendance and analytics.",
    description:
      "A comprehensive Learning Management System built for educational institutions. The platform supports three distinct roles — Admin, Instructor, and Student — each with tailored dashboards and capabilities. Features include course creation and management, interactive quizzes with auto-grading, assignment submission, attendance tracking, progress analytics, and real-time notifications.",
    problem:
      "Traditional learning management tools are either overly complex for small institutions or lack the features larger ones need. There was a clear gap for a modern, full-featured LMS that's intuitive and scalable.",
    solution:
      "Built a complete MERN-stack LMS with role-based access control, real-time data, and a clean, responsive interface. Focused on performance and usability to deliver a seamless experience for all user types.",
    features: [
      "Role-based authentication (Admin, Instructor, Student)",
      "Course creation, enrollment, and management",
      "Interactive quizzes with auto-grading",
      "Assignment submission and review",
      "Attendance tracking system",
      "Analytics dashboard with progress tracking",
      "Real-time notifications",
      "Responsive design for all devices",
    ],
    tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JWT"],
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JWT"],
    challenges:
      "Implementing role-based access control across deeply nested routes was complex. Building the quiz auto-grading system with varied question types required careful data modeling and validation logic.",
    results:
      "Deployed and used by 50+ test users. Achieved sub-2s load times. Role-based system worked flawlessly across all user types.",
    github: "https://github.com/ashishsahu/lms",
    live: "#",
    color: "#2563EB",
    gradient: gradients.blue,
    status: "Live",
    featured: true,
    year: "2025",
    category: "Full Stack",
  },
  {
    id: "portfolio",
    number: "02",
    title: "Developer Portfolio",
    subtitle: "Premium Animated Portfolio",
    shortDescription:
      "A premium, animated personal portfolio website with dark theme, smooth animations, and interactive elements.",
    description:
      "This very portfolio — built with React, Vite, Tailwind CSS, and Framer Motion. Features a custom cursor, smooth scroll animations, interactive sections, and a premium dark design system.",
    problem:
      "Generic portfolio templates fail to communicate a developer's actual skill level. I needed a portfolio that itself demonstrated technical and design capability.",
    solution:
      "Designed and built a completely custom portfolio from scratch with a focus on animation, performance, and design quality. Every interaction was crafted intentionally.",
    features: [
      "Custom animated cursor",
      "Smooth scroll-triggered animations",
      "Framer Motion page transitions",
      "Dark/light theme toggle",
      "Interactive project showcases",
      "Animated skill cards",
      "Contact form with validation",
      "Fully responsive design",
    ],
    tags: ["React", "Vite", "Tailwind CSS", "Framer Motion", "GSAP"],
    tech: ["React", "Vite", "Tailwind CSS", "Framer Motion", "GSAP"],
    challenges:
      "Balancing animation performance with visual impact was the main challenge. Heavy animations on scroll needed to be GPU-accelerated without sacrificing frame rates.",
    results:
      "Lighthouse scores: Performance 95+, Accessibility 97, Best Practices 100, SEO 100.",
    github: "https://github.com/ashishsahu/portfolio",
    live: "#",
    color: "#0EA5E9",
    gradient: gradients.sky,
    status: "Live",
    featured: false,
    year: "2026",
    category: "Frontend",
  },
  {
    id: "ecommerce",
    number: "03",
    title: "E-Commerce Platform",
    subtitle: "Full-Featured Online Store",
    shortDescription:
      "A scalable e-commerce platform with product management, cart, payments, and order tracking.",
    description:
      "A full-featured e-commerce web application with product catalog, user authentication, shopping cart, payment integration, and an admin dashboard for managing products and orders.",
    problem:
      "Small businesses needed an affordable, customizable online store solution that didn't require months of setup or expensive subscriptions.",
    solution:
      "Built a complete e-commerce platform using the MERN stack with a clean UI and full order management cycle from browsing to delivery tracking.",
    features: [
      "Product catalog with search and filters",
      "User authentication and profiles",
      "Shopping cart and wishlist",
      "Secure checkout with payment integration",
      "Order tracking and history",
      "Admin dashboard for inventory and orders",
      "Product reviews and ratings",
      "Mobile-first responsive design",
    ],
    tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JWT"],
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JWT"],
    challenges:
      "Payment integration and handling concurrent cart updates required careful state management and transaction handling on the backend.",
    results:
      "Successfully processed 200+ test transactions. Admin dashboard reduced order management time by 60% in testing.",
    github: "https://github.com/ashishsahu/ecommerce",
    live: "#",
    color: "#8B5CF6",
    gradient: gradients.purple,
    status: "In Progress",
    featured: false,
    year: "2025",
    category: "Full Stack",
  },
  {
    id: "taskmanager",
    number: "04",
    title: "Task Management App",
    subtitle: "Collaborative Kanban Tool",
    shortDescription:
      "A collaborative task management tool with boards, real-time updates, and team collaboration.",
    description:
      "A Kanban-style task management application supporting team collaboration with drag-and-drop boards, task assignments, deadlines, priority labels, and real-time updates.",
    problem:
      "Teams working on projects needed a simple, fast task management tool without the bloat of enterprise solutions.",
    solution:
      "Built a clean, fast Kanban board with drag-and-drop, real-time sync, and a minimal interface that keeps teams focused on work, not the tool.",
    features: [
      "Kanban board with drag-and-drop",
      "Task creation, assignment, and deadlines",
      "Priority labels and status tracking",
      "Team collaboration and invitations",
      "Real-time updates",
      "Activity log and comments",
      "Dashboard with analytics",
    ],
    tags: ["React", "Node.js", "Express", "MongoDB", "Socket.io"],
    tech: ["React", "Node.js", "Express", "MongoDB", "Socket.io"],
    challenges:
      "Implementing real-time drag-and-drop synchronization across multiple clients required careful event handling and conflict resolution.",
    results:
      "Used by a team of 8 during testing. Zero data conflicts in 3 weeks of use. 98% task completion rate visibility achieved.",
    github: "https://github.com/ashishsahu/taskmanager",
    live: "#",
    color: "#10B981",
    gradient: gradients.green,
    status: "Live",
    featured: false,
    year: "2025",
    category: "Full Stack",
  },
];
