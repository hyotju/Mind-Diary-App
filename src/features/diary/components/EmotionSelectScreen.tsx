"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { EmotionId } from "@/features/diary/constants";
import EmotionGrid from "@/features/diary/components/EmotionGrid";
import EmotionRequiredDialog from "@/features/diary/components/EmotionRequiredDialog";
import { getDiaryDateLabel, getTodayDateString } from "@/features/diary/utils";

const TODAY = getTodayDateString();

export default function EmotionSelectScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const diaryDate = searchParams.get("date") ?? TODAY;
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionId | null>(null);
  const [isEmotionRequiredDialogOpen, setIsEmotionRequiredDialogOpen] =
    useState(false);

  const mainTitle =
    diaryDate === TODAY ? "오늘의 감정을 선택해주세요." : "감정을 선택해주세요.";

  const handleSelect = (emotionId: EmotionId) => {
    setSelectedEmotion((current) => (current === emotionId ? null : emotionId));
  };

  const handleNext = () => {
    if (!selectedEmotion) {
      setIsEmotionRequiredDialogOpen(true);
      return;
    }

    router.push(`/diary/new/write?date=${diaryDate}&emotion=${selectedEmotion}`);
  };

  return (
    <main className="min-h-dvh bg-gray-100 text-foreground">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[395px] flex-col bg-background px-6 pb-[calc(42px+env(safe-area-inset-bottom))] pt-[28px]">
        <header className="grid grid-cols-[28px_1fr_28px] items-center">
          <BackLink />
          <h1 className="text-center text-xl font-medium leading-[23px] text-foreground">
            일기
          </h1>
        </header>

        <section className="mt-[30px]">
          <h2 className="text-xl font-medium leading-[27px] text-foreground">
            {mainTitle}
          </h2>
          <p className="mt-[3px] text-[13px] leading-[25px] tracking-[0.02em] text-gray-500">
            {getDiaryDateLabel(diaryDate)}
          </p>
        </section>

        <div className="mt-[62px]">
          <EmotionGrid onSelect={handleSelect} selectedEmotionId={selectedEmotion} />
        </div>

        <button
          className="mt-[146px] flex h-[57px] w-full items-center justify-center rounded-lg bg-orange-500 text-xl font-semibold leading-[23px] text-white transition-opacity active:opacity-90"
          onClick={handleNext}
          type="button"
        >
          다음으로 이동
        </button>

        {isEmotionRequiredDialogOpen ? (
          <EmotionRequiredDialog
            onClose={() => setIsEmotionRequiredDialogOpen(false)}
          />
        ) : null}
      </div>
    </main>
  );
}

function BackLink() {
  return (
    <Link
      aria-label="날짜 선택 화면으로 돌아가기"
      className="flex size-7 items-center justify-center"
      href="/diary/new"
    >
      <BackIcon />
    </Link>
  );
}

function BackIcon() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 28 28">
      <path
        d="M17 7 10 14l7 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}
