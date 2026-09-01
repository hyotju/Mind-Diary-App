"use client";

import { useState } from "react";
import EmotionGrid from "@/features/diary/components/EmotionGrid";
import type { EmotionId } from "@/features/diary/constants";

type EmotionReselectPopoverProps = {
  currentEmotionId: EmotionId;
  onClose: () => void;
  onConfirm: (emotionId: EmotionId) => void;
};

export default function EmotionReselectPopover({
  currentEmotionId,
  onClose,
  onConfirm,
}: EmotionReselectPopoverProps) {
  const [pendingEmotionId, setPendingEmotionId] =
    useState<EmotionId>(currentEmotionId);

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[59] bg-[rgba(18,18,18,0.5)] backdrop-blur-[2.5px]"
        onClick={onClose}
      />
      <div
        aria-label="감정 다시 선택하기"
        aria-modal="true"
        className="absolute left-0 right-0 top-full z-[60] mt-2 rounded-[20px] bg-white px-6 pb-6 pt-8 shadow-[0_4px_20px_rgba(18,18,18,0.05)]"
        role="dialog"
      >
        <EmotionGrid onSelect={setPendingEmotionId} selectedEmotionId={pendingEmotionId} />

        <button
          className="mt-6 flex h-[57px] w-full items-center justify-center rounded-lg bg-orange-500 text-xl font-semibold leading-[23px] text-white transition-opacity active:opacity-90"
          onClick={() => onConfirm(pendingEmotionId)}
          type="button"
        >
          다음으로 이동
        </button>
      </div>
    </>
  );
}
