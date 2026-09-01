"use client";

import BottomNavigation from "@/components/layout/BottomNavigation";
import { MAIN_NAVIGATION_ITEMS } from "@/constants/navigation";
import ServerTalismanCard from "@/features/report/components/ServerTalismanCard";
import TalismanPageHeader from "@/features/report/components/TalismanPageHeader";
import { useTalismanDetail } from "@/features/report/hooks/useTalismanDetail";

type SavedTalismanDetailPageProps = {
  talismanId: string;
};

export default function SavedTalismanDetailPage({
  talismanId,
}: SavedTalismanDetailPageProps) {
  const parsedTalismanId = Number(talismanId);
  const validTalismanId =
    Number.isInteger(parsedTalismanId) && parsedTalismanId > 0
      ? parsedTalismanId
      : null;
  const { error, isLoading, talisman } = useTalismanDetail(validTalismanId);

  return (
    <main className="h-dvh overflow-hidden bg-gray-100 text-foreground">
      <div className="relative mx-auto h-dvh w-full max-w-[395px] overflow-hidden bg-background px-6 pb-[calc(116px+env(safe-area-inset-bottom))] pt-[28px]">
        <TalismanPageHeader backHref="/report/talismans" />

        {talisman ? (
          <div className="mt-[25px]">
            <ServerTalismanCard talisman={talisman} />
          </div>
        ) : (
          <div className="mt-[25px] flex aspect-[345/476] w-full items-center justify-center border border-dashed border-gray-200 text-sm text-gray-400">
            {isLoading
              ? "부적을 불러오고 있어요."
              : "저장된 부적을 찾을 수 없어요."}
          </div>
        )}

        <p aria-live="polite" className="sr-only">
          {error}
        </p>

        <BottomNavigation activeValue="report" items={MAIN_NAVIGATION_ITEMS} />
      </div>
    </main>
  );
}
