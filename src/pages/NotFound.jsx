import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.15) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-md"
      >
        <div className="font-mono font-black text-[clamp(6rem,20vw,16rem)] leading-none tracking-tighter mb-4 bg-gradient-to-br from-blue-600/30 to-sky-400/15 bg-clip-text text-transparent select-none">
          404
        </div>

        <h1 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-tight mb-4">
          Page not found
        </h1>

        <p className="text-[0.95rem] text-[var(--text-secondary)] leading-[1.7] mb-10">
          The page you are looking for doesn't exist or has been moved. Check
          the URL or head back home.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all whitespace-nowrap cursor-pointer bg-gradient-to-br from-blue-600 to-sky-500 text-white hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)]"
        >
          <ArrowLeft size={16} /> Return Home
        </Link>
      </motion.div>
    </div>
  );
}
