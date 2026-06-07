"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { brand } from "@/lib/content";
import { easeReveal, motionTokens } from "@/lib/tokens";
import styles from "./Overture.module.css";

const SEEN_KEY = "vw-overture-seen";

/**
 * "The Overture" — the brand opening sequence (style guide §2).
 * Plays once per session; honors prefers-reduced-motion by not playing at all.
 */
export default function Overture() {
  const reduce = useReducedMotion();
  // Start hidden; decide on mount to avoid SSR/client flash.
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduce) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SEEN_KEY)) return;
    sessionStorage.setItem(SEEN_KEY, "1");
    setShow(true);
    const t = window.setTimeout(
      () => setShow(false),
      motionTokens.overture.total * 1000
    );
    return () => window.clearTimeout(t);
  }, [reduce]);

  const { markIn, markInDelay, liftDelay, lift } = motionTokens.overture;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.overture}
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.span
            className={styles.mark}
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [12, 0, 0, -40],
            }}
            transition={{
              duration: liftDelay + lift - markInDelay,
              delay: markInDelay,
              ease: easeReveal,
              times: [
                0,
                markIn / (liftDelay + lift - markInDelay),
                (liftDelay - markInDelay) / (liftDelay + lift - markInDelay),
                1,
              ],
            }}
          >
            {brand.wordmark}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
