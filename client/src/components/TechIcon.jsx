import React from "react";
import {
  Code2,
  FileCode,
  Globe,
  Palette,
  Wind,
  Route,
  Server,
  Zap,
  Network,
  ShieldCheck,
  KeyRound,
  Database,
  TableProperties,
  GitBranch,
  Terminal,
  Send,
  Coffee,
  Binary,
  Radio,
  Cloud,
  Eye,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";

/**
 * Official vector brand marks for industry technologies
 */
export const OFFICIAL_TECH_ICONS = {
  // --- FRONTEND TECHNOLOGIES ---
  React: ({ size = 20, className = "" }) => (
    <svg
      width={size}
      height={size}
      viewBox="-11.5 -10.23174 23 20.46348"
      fill="none"
      className={className}
    >
      <circle cx="0" cy="0" r="2.05" fill="#00D8FE" />
      <g stroke="#00D8FE" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  ),

  JavaScript: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 630 630" className={className}>
      <rect width="630" height="630" fill="#F7DF1E" rx="80" />
      <path
        d="m423.2 492.19c12.69 20.72 29.2 35.95 58.4 35.95 24.53 0 40.2-12.26 40.2-29.2 0-20.3-16.1-27.49-43.1-39.3l-14.8-6.35c-42.72-18.2-71.1-41.03-71.1-89.2 0-44.4 33.83-78.2 86.7-78.2 37.64 0 64.7 13.1 84.2 47.4l-46.1 29.6c-10.15-18.2-21.1-25.4-38.1-25.4-17.34 0-28.33 11-28.33 25.4 0 17.76 11 24.95 36.4 35.94l14.8 6.34c50.3 21.57 78.7 43.56 78.7 93 0 53.3-41.87 82.5-98.1 82.5-54.98 0-90.5-26.2-105.7-58.8zm-209.98 5.5c8.9 15.65 16.9 28.75 36.4 28.75 18.6 0 30.4-7.6 30.4-36.8v-200.4h55.8v201.3c0 58.8-34.7 85.5-84.6 85.5-44.8 0-71.5-23.7-84.2-52.5z"
        fill="#000"
      />
    </svg>
  ),

  TypeScript: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 128 128" className={className}>
      <rect width="128" height="128" fill="#3178C6" rx="20" />
      <path
        d="M72.2 92.5c0 14.3 9.4 19.3 22.8 19.3 12.8 0 20.8-5.3 20.8-15.5 0-10.8-8.6-14.7-22.9-20.9-18.7-8.1-31.1-18.3-31.1-39.7 0-19.8 15.1-34.9 38.7-34.9 16.8 0 28.9 5.8 37.6 21.2l-20.6 13.2c-4.5-8.1-9.4-11.3-17-11.3-7.7 0-12.6 4.9-12.6 11.3 0 7.9 4.9 11.1 16.2 16l6.6 2.8c22.5 9.6 35.1 19.4 35.1 41.5 0 23.8-18.7 36.8-43.8 36.8-24.5 0-40.4-11.7-47.2-26.2zm-58.4-56.1h26.4v75.2h28.1v-75.2h26.4v-23.1h-80.9z"
        fill="#FFF"
      />
    </svg>
  ),

  HTML5: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 512 512" className={className}>
      <path fill="#E44D26" d="M71.5 461.5L34.8 50.5h442.4l-36.8 411z" />
      <path fill="#F16529" d="M256 427.2l155-43 31.8-356.7H256v399.7z" />
      <path
        fill="#EBEBEB"
        d="M256 176.3h-75.8l-5.3-59h81.1V60.5H112.2l1.6 17.5 14.1 157.3H256v-59zm0 134.4l-.5.1-42.3-11.4-2.7-30.3h-57.2l5.3 59.8 97.4 27V310.7z"
      />
      <path
        fill="#FFF"
        d="M255.8 60.5v56.8h81.1l-7.7 85.8h-73.4v56.8h68.3l-6.5 73.1-61.8 16.7v58.6l110.8-30.7 1.6-17.5 12.9-144.5 1.6-17.5 7.1-79.6H255.8z"
      />
    </svg>
  ),

  CSS3: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 512 512" className={className}>
      <path fill="#264DE4" d="M71.5 461.5L34.8 50.5h442.4l-36.8 411z" />
      <path fill="#2965F1" d="M256 427.2l155-43 31.8-356.7H256v399.7z" />
      <path
        fill="#EBEBEB"
        d="M256 176.3H174.9l-5.3-59H256V60.5H112.2l1.6 17.5 14.1 157.3H256v-59zm0 134.4l-.5.1-42.3-11.4-2.7-30.3h-57.2l5.3 59.8 97.4 27V310.7z"
      />
      <path
        fill="#FFF"
        d="M255.8 176.3h73.4l-7.7 85.8h-65.7v56.8h60.6l-6.5 73.1-54.1 14.6v58.6l103.1-28.6 1.6-17.5 17.2-192.8 1.6-17.5 7.1-79.6H255.8v56.8z"
      />
    </svg>
  ),

  "Tailwind CSS": ({ size = 20, className = "" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 54 33"
      fill="none"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.005-5.147-3.654C23.256 19.31 20.192 16.2 13.5 16.2z"
        fill="#38BDF8"
      />
    </svg>
  ),

  "React Router": ({ size = 20, className = "" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="#CA4245"
        strokeWidth="2"
        fill="#CA4245"
        fillOpacity="0.1"
      />
      <path
        d="M8 8h5a3 3 0 1 1 0 6H8V8zm0 6h4l3 5"
        stroke="#CA4245"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  "Next.js": ({ size = 20, className = "" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      fill="none"
      className={className}
    >
      <circle cx="90" cy="90" r="90" fill="#000" />
      <path
        d="M149.508 157.067L69.8373 54H54V125.962H66.8373V69.7547L139.734 163.504C143.149 161.547 146.425 159.387 149.508 157.067Z"
        fill="url(#next_grad)"
      />
      <path d="M115.163 54H128V126H115.163V54Z" fill="#FFF" />
      <defs>
        <linearGradient
          id="next_grad"
          x1="109"
          y1="116.5"
          x2="144.5"
          y2="160.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFF" />
          <stop offset="1" stopColor="#FFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  ),

  Redux: ({ size = 20, className = "" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M16.5 13c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm-9 0C6.12 13 5 14.12 5 15.5S6.12 18 7.5 18s2.5-1.12 2.5-2.5S8.88 13 7.5 13zm4.5-7C10.62 6 9.5 7.12 9.5 8.5S10.62 11 12 11s2.5-1.12 2.5-2.5S13.38 6 12 6z"
        fill="#764ABC"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="#764ABC"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
    </svg>
  ),

  // --- BACKEND & DATABASE & SYSTEM TECHNOLOGIES ---
  "Node.js": ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 256 289" className={className}>
      <path
        fill="#539E43"
        d="M128 0L9.4 68.4v152.1L128 288.9l118.6-68.4V68.4L128 0zm-17.7 205.1c-29.2 0-38.3-15.6-38.3-37.5v-8.2h19.8v8.2c0 12.3 4.5 19.3 20.3 19.3 14.2 0 19.6-6.4 19.6-15.5 0-9.7-4.1-13.8-23.7-19.3-26.6-7.5-35-15.6-35-36.2 0-20.7 13.6-34.9 37.3-34.9 26.6 0 36.2 13.8 36.2 35.8v6.2h-19.6v-6.2c0-11.7-4.7-17.7-17.5-17.7-12.8 0-17.3 6-17.3 14.2 0 8.4 4.5 12.3 22.8 17.5 28 8 36.4 16.7 36.4 37.9 0 21.6-14 36.7-41 36.7z"
      />
    </svg>
  ),

  "Express.js": ({ size = 20, className = "" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect width="24" height="24" rx="5" fill="#222" />
      <text
        x="3"
        y="16"
        fill="#FFF"
        fontFamily="monospace"
        fontSize="9"
        fontWeight="bold"
      >
        ex
      </text>
      <circle cx="18" cy="12" r="3" fill="#A1B49C" />
    </svg>
  ),

  MongoDB: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path
        fill="#13AA52"
        d="M12 0C11.5 1.5 8 8 8 13.5c0 4.1 2.4 6.8 4 7.5.3-2.1.2-6.5.2-6.5s-1.8 1.4-2.5 0c-.5-1-.2-2.5 1.3-3.8C12 9.5 12 0 12 0z"
      />
      <path
        fill="#116149"
        d="M12 0c.5 1.5 4 8 4 13.5 0 4.1-2.4 6.8-4 7.5-.1 1.2-.5 2.5-1 3 0-1.8.8-3.1 1-3.5 0 0 0-4.4-.2-6.5-.4.2-1.3.4-1.8 0 .5-1.5 2-4.5 2-14z"
      />
    </svg>
  ),

  MySQL: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path
        fill="#00758F"
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5c-2.5 0-4.5-1.5-4.5-3.5s2-3.5 4.5-3.5c1.5 0 2.5.5 3.2 1.3l-1.3 1.2c-.4-.5-1-.8-1.9-.8-1.5 0-2.6.9-2.6 1.8s1.1 1.8 2.6 1.8c1 0 1.6-.4 2-.8l1.3 1.2c-.8.8-1.9 1.3-3.3 1.3z"
      />
      <path
        fill="#F29111"
        d="M17.5 7.5c-.8-.8-2-1.2-3.5-1.2v1.8c1 0 1.8.3 2.3.8s.8 1.2.8 2.1c0 1.2-.5 2.1-1.4 2.7l1.1 1.4c1.4-.9 2.2-2.4 2.2-4.1 0-1.4-.5-2.6-1.5-3.5z"
      />
    </svg>
  ),

  PostgreSQL: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path
        fill="#336791"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 10.9 12 11.5 12 13h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 .88-.36 1.68-.93 2.25z"
      />
    </svg>
  ),

  Docker: ({ size = 20, className = "" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M13.98 5.76h2.24v2.24h-2.24V5.76zm-2.8 0h2.24v2.24h-2.24V5.76zm5.6 2.8h2.24v2.24h-2.24V8.56zm-2.8 0h2.24v2.24h-2.24V8.56zm-2.8 0h2.24v2.24h-2.24V8.56zm-2.8 0h2.24v2.24H8.38V8.56zm-2.8 0h2.24v2.24H5.58V8.56zm15.82 2.38c-.37-.23-1.25-.32-1.92-.09-.2-.7-1-1.07-1.74-.95-.62-2.15-2.58-2.14-2.58-2.14h-8.4v4.48H4.5c-.85 0-1.5.65-1.5 1.5 0 2.92 1.62 5.37 4.14 6.38 2.05.83 4.67.87 7.08.15 2.9-1.04 4.88-3.4 5.25-6.83.67-.1 1.76.12 1.95-.5.2-.64-.02-1.55-.02-1.55l-.4-.5z"
        fill="#2496ED"
      />
    </svg>
  ),

  "Docker Containerization": ({ size = 20, className = "" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M13.98 5.76h2.24v2.24h-2.24V5.76zm-2.8 0h2.24v2.24h-2.24V5.76zm5.6 2.8h2.24v2.24h-2.24V8.56zm-2.8 0h2.24v2.24h-2.24V8.56zm-2.8 0h2.24v2.24h-2.24V8.56zm-2.8 0h2.24v2.24H8.38V8.56zm-2.8 0h2.24v2.24H5.58V8.56zm15.82 2.38c-.37-.23-1.25-.32-1.92-.09-.2-.7-1-1.07-1.74-.95-.62-2.15-2.58-2.14-2.58-2.14h-8.4v4.48H4.5c-.85 0-1.5.65-1.5 1.5 0 2.92 1.62 5.37 4.14 6.38 2.05.83 4.67.87 7.08.15 2.9-1.04 4.88-3.4 5.25-6.83.67-.1 1.76.12 1.95-.5.2-.64-.02-1.55-.02-1.55l-.4-.5z"
        fill="#2496ED"
      />
    </svg>
  ),

  Git: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path
        fill="#F05032"
        d="m21.7 10.9-8.6-8.6c-.6-.6-1.5-.6-2.1 0L8.7 4.6l3 3c.6-.2 1.3 0 1.8.5.5.5.7 1.2.5 1.8l2.9 2.9c.6-.2 1.3 0 1.8.5.8.8.8 2 0 2.8-.8.8-2 .8-2.8 0-.6-.6-.7-1.4-.4-2.1L12.7 11v4.7c.3.2.6.5.7.9.5 1.1-.1 2.3-1.2 2.8-1.1.5-2.3-.1-2.8-1.2-.5-1.1.1-2.3 1.2-2.8.4-.2.8-.2 1.1-.1V10.8c-.3-.1-.7-.3-1-.6-.6-.6-.7-1.4-.4-2.1L7.4 5.2 2.3 10.3c-.6.6-.6 1.5 0 2.1l8.6 8.6c.6.6 1.5.6 2.1 0l8.7-8.7c.6-.5.6-1.5 0-2.1z"
      />
    </svg>
  ),

  GitHub: ({ size = 20, className = "" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),

  "VS Code": ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path
        fill="#007ACC"
        d="m17.5 2.8-8.2 7.6-4.5-3.4c-.6-.4-1.4-.2-1.8.4l-.8 1.1c-.4.6-.2 1.4.4 1.8l3.9 3-3.9 3c-.6.4-.8 1.2-.4 1.8l.8 1.1c.4.6 1.2.8 1.8.4l4.5-3.4 8.2 7.6c.7.7 1.9.4 2.1-.6l2.3-18.8c.2-1-.7-1.8-1.6-1.6zm0 4.7v10.9l-6-5.4z"
      />
    </svg>
  ),

  Postman: ({ size = 20, className = "" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle cx="12" cy="12" r="10.5" fill="#FF6C37" />
      <path
        d="M17.5 9.5c0-.8-.7-1.5-1.5-1.5h-5.2c-.4 0-.8.2-1 .5L8.2 10.3c-.2.2-.5.3-.8.3H6.5c-.3 0-.5.2-.5.5v1.8c0 .3.2.5.5.5h1.2c.4 0 .7.2.9.5l1.6 2.3c.2.3.6.5 1 .5h4.8c.8 0 1.5-.7 1.5-1.5V9.5z"
        fill="#FFF"
      />
    </svg>
  ),

  Java: ({ size = 20, className = "" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M8.5 19c3.5 1 7.5.5 10-.5-2.5 1.5-7.5 2-10 .5zm-1 2c4.5 1 9.5.5 12.5-.5-3.5 1.5-9.5 2-12.5.5zM12 2c1.5 2-1 4-1 6 0 2.5 2.5 3 2.5 5 0 2.5-3.5 4-4.5 5 1.5-.5 3-1.5 3-3 0-2-2.5-3-2.5-5 0-2.5 2.5-4 2.5-7zm3 4c1 1.5-.5 3-.5 4.5 0 1.5 2 2 2 3.5 0 2-2.5 3-3.5 4 1-.5 2-1.5 2-2.5 0-1.5-2-2-2-3.5 0-1.5 2-3 2-6z"
        stroke="#E76F00"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),

  "REST APIs": ({ size = 20, className = "" }) => (
    <span
      className={`inline-flex items-center justify-center size-6 rounded-md bg-surface-alt text-action border border-border ${className}`}
    >
      <Network size={size * 0.75} />
    </span>
  ),

  Authentication: ({ size = 20, className = "" }) => (
    <span
      className={`inline-flex items-center justify-center size-6 rounded-md bg-surface-alt text-action border border-border ${className}`}
    >
      <ShieldCheck size={size * 0.75} />
    </span>
  ),

  JWT: ({ size = 20, className = "" }) => (
    <span
      className={`inline-flex items-center justify-center size-6 rounded-md bg-surface-alt text-action border border-border ${className}`}
    >
      <KeyRound size={size * 0.75} />
    </span>
  ),

  "Cloud Computing": ({ size = 20, className = "" }) => (
    <span
      className={`inline-flex items-center justify-center size-6 rounded-md bg-surface-alt text-action border border-border ${className}`}
    >
      <Cloud size={size * 0.75} />
    </span>
  ),

  DSA: ({ size = 20, className = "" }) => (
    <span
      className={`inline-flex items-center justify-center size-6 rounded-md bg-surface-alt text-action border border-border ${className}`}
    >
      <Binary size={size * 0.75} />
    </span>
  ),

  IoT: ({ size = 20, className = "" }) => (
    <span
      className={`inline-flex items-center justify-center size-6 rounded-md bg-surface-alt text-action border border-border ${className}`}
    >
      <Radio size={size * 0.75} />
    </span>
  ),

  "Computer Vision": ({ size = 20, className = "" }) => (
    <span
      className={`inline-flex items-center justify-center size-6 rounded-md bg-surface-alt text-action border border-border ${className}`}
    >
      <Eye size={size * 0.75} />
    </span>
  ),
};

const LUCIDE_FALLBACK_MAP = {
  Code2,
  FileCode,
  Globe,
  Palette,
  Wind,
  Route,
  Server,
  Zap,
  Network,
  ShieldCheck,
  KeyRound,
  Database,
  TableProperties,
  GitBranch,
  Terminal,
  Send,
  Coffee,
  Binary,
  Radio,
  Cloud,
  Eye,
  Cpu,
  Layers,
  Sparkles,
};

/**
 * Universal Tech Icon Component
 * Prioritizes official brand SVG, then matches by icon key or skill name, falling back to clean Lucide icon
 */
export default function TechIcon({
  name = "",
  iconKey = "",
  size = 24,
  className = "",
}) {
  // 1. Direct official brand match by skill name
  if (name && OFFICIAL_TECH_ICONS[name]) {
    const Component = OFFICIAL_TECH_ICONS[name];
    return <Component size={size} className={className} />;
  }

  // 2. Fuzzy name matching
  const cleanName = (name || "").toLowerCase().trim();
  if (cleanName.includes("react") && !cleanName.includes("router")) {
    return OFFICIAL_TECH_ICONS.React({ size, className });
  }
  if (cleanName.includes("javascript") || cleanName === "js") {
    return OFFICIAL_TECH_ICONS.JavaScript({ size, className });
  }
  if (cleanName.includes("typescript") || cleanName === "ts") {
    return OFFICIAL_TECH_ICONS.TypeScript({ size, className });
  }
  if (cleanName.includes("tailwind")) {
    return OFFICIAL_TECH_ICONS["Tailwind CSS"]({ size, className });
  }
  if (cleanName.includes("node")) {
    return OFFICIAL_TECH_ICONS["Node.js"]({ size, className });
  }
  if (cleanName.includes("express")) {
    return OFFICIAL_TECH_ICONS["Express.js"]({ size, className });
  }
  if (cleanName.includes("mongo")) {
    return OFFICIAL_TECH_ICONS.MongoDB({ size, className });
  }
  if (cleanName.includes("mysql")) {
    return OFFICIAL_TECH_ICONS.MySQL({ size, className });
  }
  if (cleanName.includes("postgres")) {
    return OFFICIAL_TECH_ICONS.PostgreSQL({ size, className });
  }
  if (cleanName.includes("docker")) {
    return OFFICIAL_TECH_ICONS.Docker({ size, className });
  }
  if (cleanName.includes("git") && !cleanName.includes("github")) {
    return OFFICIAL_TECH_ICONS.Git({ size, className });
  }
  if (cleanName.includes("github")) {
    return OFFICIAL_TECH_ICONS.GitHub({ size, className });
  }
  if (cleanName.includes("code") && cleanName.includes("vs")) {
    return OFFICIAL_TECH_ICONS["VS Code"]({ size, className });
  }
  if (cleanName.includes("postman")) {
    return OFFICIAL_TECH_ICONS.Postman({ size, className });
  }
  if (cleanName.includes("java") && !cleanName.includes("script")) {
    return OFFICIAL_TECH_ICONS.Java({ size, className });
  }
  if (cleanName.includes("jwt")) {
    return OFFICIAL_TECH_ICONS.JWT({ size, className });
  }
  if (cleanName.includes("auth")) {
    return OFFICIAL_TECH_ICONS.Authentication({ size, className });
  }
  if (cleanName.includes("rest") || cleanName.includes("api")) {
    return OFFICIAL_TECH_ICONS["REST APIs"]({ size, className });
  }

  // 3. Fallback to Lucide icon by iconKey
  const FallbackLucide = LUCIDE_FALLBACK_MAP[iconKey] || Code2;
  return <FallbackLucide size={size} className={className} />;
}
