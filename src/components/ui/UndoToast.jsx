import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function UndoToast({
  message,
  onUndo,
  duration = 5000, // ms
}) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
    }, 50);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg
                 flex items-center gap-4"
    >
      {/* Countdown Ring */}
      <div className="relative w-8 h-8 shrink-0">
  <svg
    viewBox="0 0 36 36"
    className="w-full h-full -rotate-90"
  >
    {/* background ring */}
    <circle
      cx="18"
      cy="18"
      r="16"
      stroke="rgba(255,255,255,0.25)"
      strokeWidth="3"
      fill="none"
    />

    {/* progress ring */}
    <circle
      cx="18"
      cy="18"
      r="16"
      stroke="white"
      strokeWidth="3"
      fill="none"
      strokeDasharray={2 * Math.PI * 16}
      strokeDashoffset={
        ((100 - progress) / 100) * 2 * Math.PI * 16
      }
      strokeLinecap="round"
    />
  </svg>
</div>


      <span className="text-sm">{message}</span>

      <button
        onClick={onUndo}
        className="text-sm font-semibold underline"
      >
        Undo
      </button>
    </motion.div>
  );
}
