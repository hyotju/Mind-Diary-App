"use client";

import { motion, useReducedMotion } from "motion/react";
import { formatShortKoreanDate } from "@/features/diary/utils";

type BurnedDiaryDialogProps = {
  date: string;
  onClose: () => void;
};

export default function BurnedDiaryDialog({
  date,
  onClose,
}: BurnedDiaryDialogProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] mx-auto flex w-full max-w-[395px] items-center justify-center bg-[rgba(18,18,18,0.5)] px-[25px] backdrop-blur-[2.5px]"
      initial={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
    >
      <motion.section
        animate={{ opacity: 1, scale: 1, y: 0 }}
        aria-describedby="burned-diary-date"
        aria-labelledby="burned-diary-title"
        aria-modal="true"
        className="relative h-[149px] w-full max-w-[344px] rounded-[15px] border border-orange-300 bg-white text-center shadow-[0_4px_20px_rgba(254,215,165,0.05)]"
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        role="dialog"
        transition={{
          duration: shouldReduceMotion ? 0 : 0.22,
          ease: "easeOut",
        }}
      >
        <div className="absolute left-1/2 top-7 w-[243px] -translate-x-1/2">
          <h2
            className="text-lg font-medium leading-6 text-foreground"
            id="burned-diary-title"
          >
            이미 소각된 일기입니다.
          </h2>
          <p
            className="mt-px text-xs font-medium leading-6 text-orange-500"
            id="burned-diary-date"
          >
            {formatShortKoreanDate(date)}
          </p>
        </div>

        <button
          autoFocus
          className="absolute left-1/2 top-[85px] flex h-[38px] w-[129px] -translate-x-1/2 items-center justify-center rounded-[7px] bg-orange-500 text-[15px] font-medium leading-6 text-white active:opacity-90"
          onClick={onClose}
          type="button"
        >
          확인했어요
        </button>
      </motion.section>
    </motion.div>
  );
}
