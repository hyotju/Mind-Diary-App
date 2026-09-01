"use client";

import BottomNavigation from "@/components/layout/BottomNavigation";
import { MAIN_NAVIGATION_ITEMS } from "@/constants/navigation";
import DailyFortuneCard from "@/features/home/components/DailyFortuneCard";
import EmotionMascotSection from "@/features/home/components/EmotionMascotSection";
import HomeHeader from "@/features/home/components/HomeHeader";
import WriteDiaryButton from "@/features/home/components/WriteDiaryButton";
import { useHomeSummary } from "@/features/home/hooks/useHomeSummary";
import { getTodayDateLabel } from "@/features/home/utils";

const LOADING_LUCK_MESSAGE = "오늘의 행운을 불러오고 있어요.";
const LOADING_ENERGY_MESSAGE = "오늘의 기운을 살펴보고 있어요.";

export default function HomePage() {
  const { error, isLoading, summary } = useHomeSummary();
  const luckyMessage =
    summary?.todayLuck ??
    (isLoading ? LOADING_LUCK_MESSAGE : "오늘의 행운을 불러오지 못했어요.");
  const energyMessage =
    summary?.todayEnergy ??
    (isLoading ? LOADING_ENERGY_MESSAGE : "오늘의 기운을 불러오지 못했어요.");

  return (
    <main className="min-h-dvh bg-gray-100 text-foreground">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[395px] flex-col overflow-hidden bg-background px-6 pb-[calc(126px+env(safe-area-inset-bottom))] pt-[28px]">
        <h1 className="text-center text-xl font-medium leading-[23px] text-foreground">
          홈
        </h1>
        <HomeHeader dateLabel={getTodayDateLabel()} />
        <EmotionMascotSection />
        <DailyFortuneCard
          energyMessage={energyMessage}
          luckyMessage={luckyMessage}
        />
        <p aria-live="polite" className="sr-only">
          {error}
        </p>
        <WriteDiaryButton />
        <BottomNavigation activeValue="home" items={MAIN_NAVIGATION_ITEMS} />
      </div>
    </main>
  );
}
