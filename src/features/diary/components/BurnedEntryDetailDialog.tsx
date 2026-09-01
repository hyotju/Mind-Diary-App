"use client";

import { motion, useReducedMotion } from "motion/react";
import { formatShortKoreanDate } from "@/features/diary/utils";

type BurnedEntryDetailDialogProps = {
  date: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function BurnedEntryDetailDialog({
  date,
  onClose,
  onConfirm,
}: BurnedEntryDetailDialogProps) {
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
        aria-describedby="burned-entry-dialog-date"
        aria-labelledby="burned-entry-dialog-title"
        aria-modal="true"
        className="relative w-full max-w-[344px] rounded-[15px] border border-orange-300 bg-white px-8 pb-8 pt-8 text-center shadow-[0_4px_20px_rgba(254,215,165,0.05)]"
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
          id="burned-entry-dialog-title"
        >
          소각된 일기입니다.
          <br />
          확인 하시겠습니까?
        </h2>
        <p
          className="mt-px text-xs font-medium leading-6 text-orange-500"
          id="burned-entry-dialog-date"
        >
          {formatShortKoreanDate(date)}
        </p>

        <button
          className="mx-auto mt-[18px] flex h-[38px] w-[129px] items-center justify-center rounded-[7px] bg-orange-500 text-[15px] font-medium leading-6 text-white active:opacity-90"
          onClick={onConfirm}
          type="button"
        >
          확인하기
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
