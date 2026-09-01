"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect } from "react";

import type { AccountDialogType } from "@/features/user/hooks/useAccountActions";

type AccountActionDialogProps = {
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  type: AccountDialogType;
};

export default function AccountActionDialog({
  isSubmitting,
  onCancel,
  onConfirm,
  type,
}: AccountActionDialogProps) {
  const shouldReduceMotion = useReducedMotion();
  const isWithdrawal = type === "withdraw";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] mx-auto flex w-full max-w-[395px] items-center justify-center bg-[rgba(18,18,18,0.5)] px-[25px] backdrop-blur-[2.5px]"
      initial={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
    >
      <motion.section
        animate={{ opacity: 1, scale: 1, y: 0 }}
        aria-describedby={isWithdrawal ? "withdraw-description" : undefined}
        aria-labelledby="account-action-title"
        aria-modal="true"
        className={`relative w-full max-w-[343px] rounded-[15px] border border-orange-300 bg-white text-center shadow-[0_4px_20px_rgba(254,215,165,0.05)] ${
          isWithdrawal ? "h-[267px]" : "h-[139px]"
        }`}
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        role="dialog"
        transition={{
          duration: shouldReduceMotion ? 0 : 0.22,
          ease: "easeOut",
        }}
      >
        {isWithdrawal ? (
          <WithdrawDialogContent
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        ) : (
          <LogoutDialogContent
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        )}
      </motion.section>
    </motion.div>
  );
}

type DialogContentProps = Pick<
  AccountActionDialogProps,
  "isSubmitting" | "onCancel" | "onConfirm"
>;

function LogoutDialogContent({
  isSubmitting,
  onCancel,
  onConfirm,
}: DialogContentProps) {
  return (
    <>
      <h2
        className="absolute left-1/2 top-9 w-[284px] -translate-x-1/2 text-lg font-medium leading-6"
        id="account-action-title"
      >
        로그아웃 하시겠습니까?
      </h2>
      <DialogButtons
        confirmLabel="확인"
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        onConfirm={onConfirm}
        topClassName="top-[78px]"
      />
    </>
  );
}

function WithdrawDialogContent({
  isSubmitting,
  onCancel,
  onConfirm,
}: DialogContentProps) {
  return (
    <>
      <Image
        alt=""
        className="absolute left-1/2 top-[23px] size-12 -translate-x-1/2"
        height={48}
        src="/figma/my/account-trash.svg"
        width={48}
      />
      <h2
        className="absolute left-1/2 top-[83px] w-[284px] -translate-x-1/2 text-lg font-bold leading-6 text-orange-500"
        id="account-action-title"
      >
        정말 탈퇴하시겠어요?
      </h2>
      <p
        className="absolute left-1/2 top-[115px] w-[284px] -translate-x-1/2 text-base font-medium leading-6"
        id="withdraw-description"
      >
        회원 탈퇴시 모든 감정 기록이 사라지며,
        <br />
        기존 계정 정보는 복구가 불가능합니다.
        <br />
        정말로 탈퇴하시겠습니까?
      </p>
      <DialogButtons
        confirmLabel="탈퇴하기"
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        onConfirm={onConfirm}
        topClassName="top-[203px]"
      />
    </>
  );
}

type DialogButtonsProps = DialogContentProps & {
  confirmLabel: string;
  topClassName: string;
};

function DialogButtons({
  confirmLabel,
  isSubmitting,
  onCancel,
  onConfirm,
  topClassName,
}: DialogButtonsProps) {
  return (
    <div
      className={`absolute left-1/2 flex -translate-x-1/2 gap-6 ${topClassName}`}
    >
      <button
        className="flex h-9 w-[129px] items-center justify-center rounded-[7px] border border-gray-200 bg-white text-[15px] font-medium leading-6 text-gray-500 disabled:cursor-wait"
        disabled={isSubmitting}
        onClick={onCancel}
        type="button"
      >
        취소
      </button>
      <button
        className="flex h-9 w-[129px] items-center justify-center rounded-[7px] bg-orange-500 text-[15px] font-medium leading-6 text-white active:opacity-90 disabled:cursor-wait"
        disabled={isSubmitting}
        onClick={onConfirm}
        type="button"
      >
        {confirmLabel}
      </button>
    </div>
  );
}
