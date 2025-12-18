import { motion } from "framer-motion";
import clsx from "clsx";

export default function MovingBorder({ children, borderRadius = 12, className }) {
  return (
    <div className={clsx("relative p-[2px] overflow-hidden", className)} style={{ borderRadius }}>
      <motion.div
        className="absolute inset-0 bg-[conic-gradient(var(--tw-gradient-stops))]"
        style={{
          backgroundImage:
            "conic-gradient(from 0deg, #ff8800 0%, #ff3c00 25%, transparent 60%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      ></motion.div>

      <div className="relative z-10 bg-black text-white px-5 py-3 rounded-[10px]">
        {children}
      </div>
    </div>
  );
}
