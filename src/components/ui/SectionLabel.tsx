"use client";

import { motion } from "framer-motion";
import { EASE_LUXE } from "@/lib/motion";

export default function SectionLabel({
  children,
  align = "center",
}: {
  children: React.ReactNode;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.9, ease: EASE_LUXE }}
      className={`flex items-center gap-3 ${
        align === "center" ? "justify-center" : "justify-start"
      }`}
    >
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
      <span className="text-[0.65rem] uppercase tracking-luxe text-gold/80">
        {children}
      </span>
      <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/60" />
    </motion.div>
  );
}
