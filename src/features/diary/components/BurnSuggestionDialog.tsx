"use client";

import { motion, useReducedMotion } from "motion/react";

type BurnSuggestionDialogProps = {
  onBurn: () => void;
  onClose: () => void;
  onLater: () => void;
};

export default function BurnSuggestionDialog({
  onBurn,
  onClose,
  onLater,
}: BurnSuggestionDialogProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] mx-auto flex w-full max-w-[395px] items-center justify-center bg-[rgba(18,18,18,0.5)] px-[25px] backdrop-blur-[2.5px]"
      initial={{ opacity: 0 }}
      onClick={onClose}
      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
    >
      <motion.section
        animate={{ opacity: 1, scale: 1, y: 0 }}
        aria-describedby="burn-suggestion-description"
        aria-modal="true"
        className="relative h-[158px] w-full max-w-[344px] rounded-[15px] border border-orange-300 bg-white px-[30px] pb-[29px] pt-[29px] text-center shadow-[0_4px_20px_rgba(254,215,165,0.05)]"
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        transition={{
          duration: shouldReduceMotion ? 0 : 0.22,
          ease: "easeOut",
        }}
      >
        <p
          className="text-[14px] font-medium leading-6 text-foreground"
          id="burn-suggestion-description"
        >
          오늘의 일기에 무거운 감정이 많이 담겨 있어요.
          <br />
          잠시 내려놓고 마음을 정리하는 시간을 가져볼까요?
        </p>

        <div className="mt-[13px] flex items-center justify-center gap-6">
          <button
            className="flex h-[38px] w-[129px] items-center justify-center whitespace-nowrap rounded-[7px] border border-gray-200 bg-white text-[15px] font-medium leading-6 text-gray-500"
            onClick={onLater}
            type="button"
          >
            나중에 하기
          </button>
          <button
            autoFocus
            className="flex h-[38px] w-[129px] items-center justify-center whitespace-nowrap rounded-[7px] bg-orange-500 text-[15px] font-medium leading-6 text-white active:opacity-90"
            onClick={onBurn}
            type="button"
          >
            소각하기
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}
