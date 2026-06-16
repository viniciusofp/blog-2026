"use client";

import { motion } from "motion/react";

export type FadeInProps = { children: React.ReactNode; className?: string };

export default function FadeIn({ children, className }: FadeInProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 5 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      viewport={{ once: true }}
      {...{ className }}
    >
      {children}
    </motion.main>
  );
}
