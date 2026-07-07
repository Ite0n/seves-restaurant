"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUp } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  amount?: number;
  as?: "div" | "section" | "li" | "article" | "header";
};

export default function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  amount = 0.25,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
