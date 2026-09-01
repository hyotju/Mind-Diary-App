"use client";

import { motion, useReducedMotion } from "motion/react";

type EmotionRequiredDialogProps = {
  onClose: () => void;
};

export default function EmotionRequiredDialog({
  onClose,
}: EmotionRequiredDialogProps) {
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
        aria-labelledby="emotion-required-title"
        aria-modal="true"
        className="relative flex w-full max-w-[344px] flex-col items-center gap-4 rounded-[15px] border border-orange-300 bg-white px-6 py-8 text-center shadow-[0_4px_20px_rgba(254,215,165,0.05)]"
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        role="dialog"
        transition={{
          duration: shouldReduceMotion ? 0 : 0.22,
          ease: "easeOut",
        }}
      >
        <p
          className="text-lg font-medium leading-6 text-foreground"
          id="emotion-required-title"
        >
          오늘의 감정을 선택 해주세요.
        </p>

        <button
          autoFocus
          className="flex w-[129px] items-center justify-center rounded-[7px] bg-orange-500 px-[45px] py-[7px] text-[15px] font-medium leading-6 text-white active:opacity-90"
          onClick={onClose}
          type="button"
        >
          확인
        </button>
      </motion.section>
    </motion.div>
  );
}
