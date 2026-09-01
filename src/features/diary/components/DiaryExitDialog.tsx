"use client";

import { motion, useReducedMotion } from "motion/react";

type DiaryExitDialogProps = {
  description: string;
  onClose: () => void;
  onPrimary: () => void;
  onSecondary: () => void;
  primaryLabel: string;
  secondaryLabel: string;
  title: string;
};

export default function DiaryExitDialog({
  description,
  onClose,
  onPrimary,
  onSecondary,
  primaryLabel,
  secondaryLabel,
  title,
}: DiaryExitDialogProps) {
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
        aria-describedby="diary-exit-dialog-description"
        aria-labelledby="diary-exit-dialog-title"
        aria-modal="true"
        className="relative w-full max-w-[344px] rounded-[15px] border border-orange-300 bg-white px-8 py-8 text-center shadow-[0_4px_20px_rgba(254,215,165,0.05)]"
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        role="dialog"
        transition={{
          duration: shouldReduceMotion ? 0 : 0.22,
          ease: "easeOut",
        }}
      >
        <button
          aria-label="닫기"
          autoFocus
          className="absolute right-[19px] top-[17px] flex size-6 items-center justify-center rounded-lg text-gray-500"
          onClick={onClose}
          type="button"
        >
          <CloseIcon />
        </button>

        <h2
          className="text-lg font-medium leading-6 text-foreground"
          id="diary-exit-dialog-title"
        >
          {title}
        </h2>
        <p
          className="mt-px text-xs leading-6 text-gray-500"
          id="diary-exit-dialog-description"
        >
          {description}
        </p>

        <div className="mt-[18px] grid grid-cols-2 gap-[17px]">
          <button
            className="flex h-[38px] items-center justify-center rounded-[7px] border border-gray-200 bg-white text-[15px] font-medium leading-6 text-gray-500"
            onClick={onSecondary}
            type="button"
          >
            {secondaryLabel}
          </button>
          <button
            className="flex h-[38px] items-center justify-center rounded-[7px] bg-orange-500 text-[15px] font-medium leading-6 text-white active:opacity-90"
            onClick={onPrimary}
            type="button"
          >
            {primaryLabel}
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
      <path
        d="m7 7 10 10M17 7 7 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}
