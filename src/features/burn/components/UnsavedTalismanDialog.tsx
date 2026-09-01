"use client";

import { motion, useReducedMotion } from "motion/react";

type UnsavedTalismanDialogProps = {
  onClose: () => void;
  onExit: () => void;
};

export default function UnsavedTalismanDialog({
  onClose,
  onExit,
}: UnsavedTalismanDialogProps) {
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
        aria-describedby="unsaved-talisman-description"
        aria-labelledby="unsaved-talisman-title"
        aria-modal="true"
        className="relative h-[157px] w-full max-w-[344px] rounded-[15px] border border-orange-300 bg-white text-center shadow-[0_4px_20px_rgba(254,215,165,0.05)]"
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        role="dialog"
        transition={{
          duration: shouldReduceMotion ? 0 : 0.22,
          ease: "easeOut",
        }}
      >
        <button
          aria-label="알림 닫기"
          autoFocus
          className="absolute right-[19px] top-[17px] flex size-6 items-center justify-center rounded-lg text-gray-500"
          onClick={onClose}
          type="button"
        >
          <CloseIcon />
        </button>

        <div className="absolute left-1/2 top-8 w-[243px] -translate-x-1/2">
          <h2
            className="text-lg font-medium leading-6 text-foreground"
            id="unsaved-talisman-title"
          >
            부적이 소멸해요!
          </h2>
          <p
            className="mt-px text-xs leading-6 text-gray-500"
            id="unsaved-talisman-description"
          >
            부적을 저장하지 않고 나갈까요?
          </p>
        </div>

        <button
          className="absolute left-1/2 top-[89px] flex h-[38px] w-[129px] -translate-x-1/2 items-center justify-center rounded-[7px] bg-orange-500 text-[15px] font-medium leading-6 text-white active:opacity-90"
          onClick={onExit}
          type="button"
        >
          나가기
        </button>
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
