"use client";

import { motion, useReducedMotion } from "framer-motion";
import { easeReveal, motionTokens } from "@/lib/tokens";

type Props = {
  children: React.ReactNode;
  /** Stagger delay in seconds. */
  delay?: number;
  className?: string;
};

/**
 * Section reveal: gentle fade + rise when scrolled into view (style guide §8).
 * Honors prefers-reduced-motion (renders instantly, no transform).
 */
export default function Reveal({ children, delay = 0, className }: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: motionTokens.reveal.y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: motionTokens.reveal.duration, delay, ease: easeReveal }}
    >
      {children}
    </motion.div>
  );
}
