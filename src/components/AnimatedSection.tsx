"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

export interface AnimatedSectionProps extends HTMLMotionProps<"div"> {
  /** Delay en segundos, para escalonar (stagger) varios bloques entre sí. */
  delay?: number;
}

/**
 * Patrón estándar de animación de entrada al viewport: fade in + leve
 * desplazamiento hacia arriba, una sola vez, respetando
 * prefers-reduced-motion. Ver regla en CLAUDE.md.
 */
export default function AnimatedSection({
  delay = 0,
  children,
  ...props
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const visible = { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={shouldReduceMotion ? visible : { opacity: 0, y: 24 }}
      whileInView={visible}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: "easeOut",
        delay: shouldReduceMotion ? 0 : delay,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
