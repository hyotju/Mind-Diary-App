"use client";

import Link from "next/link";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { MAIN_NAVIGATION_ITEMS } from "@/constants/navigation";
import EmotionSummarySection from "@/features/report/components/EmotionSummarySection";
import NextWeekSection from "@/features/report/components/NextWeekSection";
import SavedTalismanSection from "@/features/report/components/SavedTalismanSection";
import { useWeeklyReport } from "@/features/report/hooks/useWeeklyReport";
import {
  formatWeeklyPeriod,
  getDiaryCount,
  toEmotionChartItems,
} from "@/features/report/utils";
import MemberName from "@/features/user/components/main/MemberName";

export default function ReportPage() {
  const {
    canMoveNext,
    canMovePrevious,
    error,
    isLoading,
    moveNext,
    movePrevious,
    report,
    selectedPeriod,
  } = useWeeklyReport();
  const emotionStats = report?.emotionStats ?? [];

  return (
    <main className="h-dvh overflow-hidden bg-gray-100 text-foreground">
      <div className="relative mx-auto h-dvh w-full max-w-[395px] overflow-y-auto bg-background pb-[calc(116px+env(safe-area-inset-bottom))] pt-[28px]">
        <header className="px-6">
          <div className="grid grid-cols-[28px_1fr_28px] items-center">
            <Link
              aria-label="홈으로 돌아가기"
              className="flex size-7 items-center justify-start"
              href="/"
            >
              <ChevronLeftIcon />
            </Link>
            <h1 className="text-center text-xl font-medium leading-[23px]">
              감정 리포트
            </h1>
          </div>

          <section className="mt-[27px]">
            <h2 className="text-xl font-semibold leading-[23px]">
              <MemberName /> 님
            </h2>
            <div className="mt-2.5 flex gap-[25px] text-lg leading-[22px]">
              <ReportCount
                label="일기"
                value={String(getDiaryCount(emotionStats))}
              />
              <ReportCount
                label="소각"
                value={String(report?.burnCount ?? 0)}
              />
            </div>
          </section>

          <div className="mt-[25px] flex items-center justify-center gap-2.5">
            <button
              aria-label="이전 주"
              className="text-orange-500 disabled:text-gray-300"
              disabled={!canMovePrevious}
              onClick={movePrevious}
              type="button"
            >
              <SmallChevronLeftIcon />
            </button>
            <p className="text-xl font-semibold leading-[23px] text-orange-500">
              {selectedPeriod
                ? formatWeeklyPeriod(selectedPeriod)
                : "리포트 없음"}
            </p>
            <button
              aria-label="다음 주"
              className="rotate-180 text-orange-500 disabled:text-gray-300"
              disabled={!canMoveNext}
              onClick={moveNext}
              type="button"
            >
              <SmallChevronLeftIcon />
            </button>
          </div>
        </header>

        <EmotionSummarySection
          chartItems={toEmotionChartItems(emotionStats)}
          isLoading={isLoading}
          summary={report?.summary.insightSummary ?? null}
        />
        <SavedTalismanSection />
        <NextWeekSection
          advice={report?.nextWeekFlow?.adviceText ?? null}
          generationStatus={report?.nextWeekFlow?.generationStatus ?? null}
          isLoading={isLoading}
          title={report?.nextWeekFlow?.title ?? null}
        />

        <p aria-live="polite" className="sr-only">
          {error}
        </p>

        <BottomNavigation activeValue="report" items={MAIN_NAVIGATION_ITEMS} />
      </div>
    </main>
  );
}

type ReportCountProps = {
  label: string;
  value: string;
};

function ReportCount({ label, value }: ReportCountProps) {
  return (
    <p className="flex gap-[9px]">
      <span className="font-medium text-gray-500">{label}</span>
      <span className="font-semibold text-orange-500">{value}</span>
    </p>
  );
}

function ChevronLeftIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-3" fill="none" viewBox="0 0 12 20">
      <path
        d="M10 2 2 10l8 8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function SmallChevronLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3 w-1.5"
      fill="none"
      viewBox="0 0 6 12"
    >
      <path
        d="M5 1 1 6l4 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
