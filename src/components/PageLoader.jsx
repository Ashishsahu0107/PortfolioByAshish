import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let current = 0;
    const steps = [
      { target: 30, delay: 80 },
      { target: 65, delay: 50 },
      { target: 85, delay: 100 },
      { target: 100, delay: 60 },
    ];

    let stepIndex = 0;

    const runStep = () => {
      if (stepIndex >= steps.length) {
        setTimeout(() => {
          setDone(true);
          setTimeout(() => onComplete?.(), 600);
        }, 200);
        return;
      }
      const step = steps[stepIndex++];
      const increment = () => {
        current += 1;
        setProgress(current);
        if (current < step.target) {
          setTimeout(increment, step.delay);
        } else {
          setTimeout(runStep, 150);
        }
      };
      increment();
    };

    const t = setTimeout(runStep, 200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            background: "#050505",
            zIndex: 9990,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.025em",
            }}
          >
            <span style={{ color: "#2563eb" }}>&lt;</span>
            ASHISH
            <span style={{ color: "#2563eb" }}>/&gt;</span>
          </motion.div>

          {/* Status */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Initializing Experience...
          </motion.p>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div className="w-48 sm:w-64 h-[2px] bg-white/10 relative overflow-hidden rounded-full mt-2">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 shadow-[0_0_10px_#2563eb] transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              {progress}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
