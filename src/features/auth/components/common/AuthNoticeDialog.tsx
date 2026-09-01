"use client";

import { motion, useReducedMotion } from "motion/react";

type AuthNoticeDialogProps = {
  contentPosition?: "default" | "lower";
  message: string;
  onConfirm: () => void;
};

export default function AuthNoticeDialog({
  contentPosition = "default",
  message,
  onConfirm,
}: AuthNoticeDialogProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[70] mx-auto flex w-full max-w-[393px] items-center justify-center bg-[rgba(18,18,18,0.5)]"
      initial={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
    >
      <motion.section
        animate={{ opacity: 1, scale: 1 }}
        aria-labelledby="auth-notice-title"
        aria-modal="true"
        className="relative h-[157px] w-[345px] overflow-hidden rounded-[15px] border border-orange-300 bg-white shadow-[0_4px_20px_rgba(254,215,165,0.05)]"
        initial={{ opacity: 0, scale: 0.98 }}
        role="dialog"
        transition={{
          duration: shouldReduceMotion ? 0 : 0.22,
          ease: "easeOut",
        }}
      >
        <div
          className={`absolute left-[43px] flex w-[258px] flex-col items-center gap-[22px] ${
            contentPosition === "lower" ? "top-[39px]" : "top-[35px]"
          }`}
        >
          <h2
            className="h-6 w-[243px] text-center text-lg font-medium leading-6 text-foreground"
            id="auth-notice-title"
          >
            {message}
          </h2>
          <button
            autoFocus
            className="flex h-[38px] w-[258px] items-center justify-center rounded-[7px] bg-orange-500 text-[15px] font-medium leading-6 text-white active:opacity-90"
            onClick={onConfirm}
            type="button"
          >
            확인
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}
