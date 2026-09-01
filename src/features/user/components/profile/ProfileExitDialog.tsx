"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

type ProfileExitDialogProps = {
  onContinue: () => void;
  onExit: () => void;
};

export default function ProfileExitDialog({
  onContinue,
  onExit,
}: ProfileExitDialogProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onContinue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onContinue]);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] mx-auto flex w-full max-w-[395px] items-center justify-center bg-[rgba(18,18,18,0.5)] px-[25px] backdrop-blur-[2.5px]"
      initial={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
    >
      <motion.section
        animate={{ opacity: 1, scale: 1, y: 0 }}
        aria-describedby="profile-exit-description"
        aria-labelledby="profile-exit-title"
        aria-modal="true"
        className="relative h-[157px] w-full max-w-[344px] rounded-[15px] border border-orange-300 bg-white text-center shadow-[0_4px_20px_rgba(254,215,165,0.05)]"
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        role="dialog"
        transition={{
          duration: shouldReduceMotion ? 0 : 0.22,
          ease: "easeOut",
        }}
      >
        <div className="absolute left-1/2 top-8 w-[243px] -translate-x-1/2">
          <h2
            className="text-lg font-medium leading-6 text-foreground"
            id="profile-exit-title"
          >
            수정 중인 내용이 있어요.
          </h2>
          <p
            className="mt-px text-xs leading-6 text-gray-500"
            id="profile-exit-description"
          >
            저장하지 않고 나갈까요?
          </p>
        </div>

        <div className="absolute left-[33px] right-[33px] top-[89px] grid grid-cols-2 gap-[17px]">
          <button
            className="flex h-[38px] items-center justify-center rounded-[7px] border border-gray-200 bg-white text-[15px] font-medium leading-6 text-gray-500"
            onClick={onExit}
            type="button"
          >
            나가기
          </button>
          <button
            autoFocus
            className="flex h-[38px] items-center justify-center rounded-[7px] bg-orange-500 text-[15px] font-medium leading-6 text-white active:opacity-90"
            onClick={onContinue}
            type="button"
          >
            계속 수정
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}
