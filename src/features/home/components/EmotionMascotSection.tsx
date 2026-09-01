"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

export default function EmotionMascotSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label="오늘의 감정 캐릭터"
      className="relative mt-[30px] h-[211px]"
    >
      <motion.div
        animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
        className="absolute left-1/2 top-[14px] size-[223px] -translate-x-1/2"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Image
          alt=""
          aria-hidden="true"
          className="size-full"
          height={223}
          priority
          src="/images/home/emotion-glow.svg"
          unoptimized
          width={223}
        />
      </motion.div>
      <motion.div
        animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
        className="absolute left-1/2 top-0 h-[211px] w-[291px] -translate-x-1/2"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Image
          alt=""
          aria-hidden="true"
          className="size-full"
          height={211}
          priority
          src="/images/home/emotion-sparkles.svg"
          unoptimized
          width={291}
        />
      </motion.div>
      <motion.div
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: [0, -5, 0] }}
        className="absolute left-1/2 top-[27px] z-10 h-[181.12px] w-[155.016px] -translate-x-1/2"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        transition={
          shouldReduceMotion
            ? undefined
            : {
                opacity: { duration: 0.35 },
                y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
              }
        }
      >
        <Image
          alt="오늘의 감정 마스코트"
          className="size-full"
          height={181}
          priority
          src="/images/home/emotion-mascot.svg"
          unoptimized
          width={155}
        />
      </motion.div>
    </section>
  );
}
