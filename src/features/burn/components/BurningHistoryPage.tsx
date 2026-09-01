"use client";

import Image from "next/image";
import Link from "next/link";

import BottomNavigation from "@/components/layout/BottomNavigation";
import { MAIN_NAVIGATION_ITEMS } from "@/constants/navigation";
import BurnNavigationTabs from "@/features/burn/components/BurnNavigationTabs";
import { useBurningHistory } from "@/features/burn/hooks/useBurningHistory";

const HISTORY_ASSETS = {
  character: "/figma/burn/history-character.svg",
  flame: "/figma/burn/history-flame.svg",
} as const;

export default function BurningHistoryPage() {
  const { error, hasNext, isLoading, isLoadingMore, items, loadMore } =
    useBurningHistory();
  const groups = groupByMonth(items);

  return (
    <main className="h-dvh overflow-hidden bg-gray-100 text-foreground">
      <div className="relative mx-auto h-dvh w-full max-w-[395px] overflow-y-auto bg-background px-6 pb-[calc(110px+env(safe-area-inset-bottom))] pt-[28px]">
        <h1 className="text-center text-xl font-medium leading-[23px]">소각</h1>

        <div className="mt-[18px]">
          <BurnNavigationTabs activeTab="history" />
        </div>

        <section className="mt-[17px]">
          {groups.map(([month, monthItems]) => (
            <div className="mb-[17px]" key={month}>
              <MonthDivider month={month} />
              <div className="mt-[17px] flex flex-col gap-[17px]">
                {monthItems.map((item) => (
                  <Link
                    className="flex h-[77px] items-center rounded-lg border border-gray-100 bg-white px-7 shadow-[0_4px_20px_rgba(18,18,18,0.05)] outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    href={`/burn/history/${item.burningId}`}
                    key={item.burningId}
                  >
                    <span className="relative flex size-[39px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-100">
                      <Image
                        alt=""
                        height={item.hasTalisman ? 27 : 20}
                        src={
                          item.hasTalisman
                            ? HISTORY_ASSETS.character
                            : HISTORY_ASSETS.flame
                        }
                        unoptimized
                        width={item.hasTalisman ? 22 : 20}
                      />
                    </span>
                    <span className="ml-4 min-w-0">
                      <strong className="block truncate text-[15px] font-medium leading-[22px] text-black">
                        {item.title}
                      </strong>
                      <time
                        className="block text-[13px] leading-[20px] text-gray-500"
                        dateTime={item.burnedAt}
                      >
                        {formatDate(item.burnedAt)}
                      </time>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {isLoading ? (
            <p className="py-20 text-center text-sm text-gray-400">
              소각 기록을 불러오고 있어요.
            </p>
          ) : null}
          {!isLoading && items.length === 0 ? (
            <p className="py-20 text-center text-sm text-gray-400">
              아직 소각 기록이 없어요.
            </p>
          ) : null}
          {hasNext ? (
            <button
              className="mx-auto flex h-10 items-center justify-center px-4 text-sm text-gray-500 disabled:text-gray-300"
              disabled={isLoadingMore}
              onClick={() => void loadMore()}
              type="button"
            >
              {isLoadingMore ? "불러오는 중" : "더보기"}
            </button>
          ) : null}
          <p aria-live="polite" className="sr-only">
            {error}
          </p>
        </section>

        <BottomNavigation activeValue="burn" items={MAIN_NAVIGATION_ITEMS} />
      </div>
    </main>
  );
}

function MonthDivider({ month }: { month: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-px flex-1 bg-gray-200" />
      <span className="px-2 text-[13px] leading-[20px] text-gray-400">
        {month}
      </span>
      <span className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

function groupByMonth<T extends { burnedAt: string }>(items: T[]) {
  const groups = new Map<string, T[]>();

  items.forEach((item) => {
    const month = formatMonth(item.burnedAt);
    groups.set(month, [...(groups.get(month) ?? []), item]);
  });

  return Array.from(groups.entries());
}

function formatMonth(value: string): string {
  return formatDate(value).slice(0, 7);
}

function formatDate(value: string): string {
  const date = new Date(value);
  const parts = new Intl.DateTimeFormat("ko-KR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Seoul",
    year: "numeric",
  }).formatToParts(date);

  return `${getDatePart(parts, "year")}.${getDatePart(parts, "month")}.${getDatePart(parts, "day")}`;
}

function getDatePart(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}
