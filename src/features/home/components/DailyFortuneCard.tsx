"use client";

import { motion, useReducedMotion } from "motion/react";

type DailyFortuneCardProps = {
  energyMessage: string;
  luckyMessage: string;
};

export default function DailyFortuneCard({
  energyMessage,
  luckyMessage,
}: DailyFortuneCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      aria-label="오늘의 운세 요약"
      className="mt-[25px] rounded-[15px] border border-gray-200 bg-background px-[25px] py-[29px] shadow-[0_4px_20px_rgba(18,18,18,0.05)]"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
      transition={{ delay: 0.16, duration: 0.42, ease: "easeOut" }}
    >
      <FortuneItem title="오늘의 행운" description={luckyMessage} />
      <FortuneItem
        className="mt-[18px]"
        title="오늘의 기운"
        description={energyMessage}
      />
    </motion.section>
  );
}

type FortuneItemProps = {
  className?: string;
  description: string;
  title: string;
};

function FortuneItem({ className = "", description, title }: FortuneItemProps) {
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold leading-normal text-orange-500">
        {title}
      </h2>
      <p className="mt-[6px] whitespace-pre-line text-base leading-normal text-gray-500">
        {description}
      </p>
    </div>
  );
}
