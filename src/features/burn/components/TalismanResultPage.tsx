"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { MAIN_NAVIGATION_ITEMS } from "@/constants/navigation";
import TalismanCard from "@/features/burn/components/TalismanCard";
import UnsavedTalismanDialog from "@/features/burn/components/UnsavedTalismanDialog";
import type { GeneratedTalisman } from "@/features/burn/types";
import {
  GENERATED_TALISMAN_STORAGE_KEY,
  parseGeneratedTalisman,
  PENDING_REPORT_TALISMAN_ID_STORAGE_KEY,
  TALISMAN_RETURN_PATH_STORAGE_KEY,
} from "@/features/burn/utils";
import type { MouseEvent as ReactMouseEvent } from "react";

export default function TalismanResultPage() {
  const router = useRouter();
  const serializedTalisman = useSyncExternalStore(
    subscribeToGeneratedTalisman,
    getGeneratedTalismanSnapshot,
    getServerGeneratedTalismanSnapshot,
  );
  const talisman = useMemo<GeneratedTalisman | null>(
    () => parseGeneratedTalisman(serializedTalisman),
    [serializedTalisman],
  );
  const returnHref = useSyncExternalStore(
    subscribeToGeneratedTalisman,
    getTalismanReturnPathSnapshot,
    getServerGeneratedTalismanSnapshot,
  );
  const [isSaved, setIsSaved] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const handleSave = () => {
    if (!talisman) {
      return;
    }

    const talismanId = Number(talisman.id);

    if (Number.isInteger(talismanId) && talismanId > 0) {
      sessionStorage.setItem(
        PENDING_REPORT_TALISMAN_ID_STORAGE_KEY,
        String(talismanId),
      );
    }

    setIsSaved(true);
  };

  const handleNavigationCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (isSaved || pendingHref) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const link = target.closest<HTMLAnchorElement>("a[href]");
    const href = link?.getAttribute("href");

    if (!href || !href.startsWith("/")) {
      return;
    }

    event.preventDefault();
    setPendingHref(href);
  };

  const handleExit = () => {
    if (!pendingHref) {
      return;
    }

    const href = pendingHref;
    setPendingHref(null);
    router.push(href);
  };

  return (
    <main className="h-dvh overflow-hidden bg-gray-100 text-foreground">
      <div
        className="relative mx-auto h-dvh w-full max-w-[395px] overflow-y-auto bg-background px-6 pb-[calc(116px+env(safe-area-inset-bottom))] pt-[28px]"
        onClickCapture={handleNavigationCapture}
      >
        <header className="grid grid-cols-[28px_1fr_28px] items-center">
          <Link
            aria-label={
              returnHref
                ? "소각 기록 상세로 돌아가기"
                : "개운지침 화면으로 돌아가기"
            }
            className="flex size-7 items-center justify-center"
            href={returnHref ?? "/burn/fortune"}
          >
            <BackIcon />
          </Link>
          <h1 className="text-center text-xl font-medium leading-[23px]">
            부적
          </h1>
        </header>

        <SourceDate occurredAt={talisman?.source.occurredAt ?? null} />

        <div className="mt-4">
          {talisman ? (
            <TalismanCard talisman={talisman} />
          ) : (
            <div className="flex aspect-[345/476] items-center justify-center rounded-[15px] bg-gray-100 px-8 text-center text-gray-500">
              생성된 부적을 찾지 못했어요.
              <br />
              개운지침에서 다시 생성해 주세요.
            </div>
          )}
        </div>

        <button
          className="mt-5 flex h-[57px] w-full items-center justify-center rounded-lg bg-orange-500 text-xl font-semibold leading-[23px] text-white active:opacity-90 disabled:opacity-60"
          disabled={!talisman}
          onClick={handleSave}
          type="button"
        >
          {isSaved ? "저장 완료" : "저장하기"}
        </button>

        <BottomNavigation activeValue="burn" items={MAIN_NAVIGATION_ITEMS} />

        {pendingHref ? (
          <UnsavedTalismanDialog
            onClose={() => setPendingHref(null)}
            onExit={handleExit}
          />
        ) : null}
      </div>
    </main>
  );
}

function subscribeToGeneratedTalisman(): () => void {
  return () => undefined;
}

function getGeneratedTalismanSnapshot(): string | null {
  return sessionStorage.getItem(GENERATED_TALISMAN_STORAGE_KEY);
}

function getTalismanReturnPathSnapshot(): string | null {
  const value = sessionStorage.getItem(TALISMAN_RETURN_PATH_STORAGE_KEY);

  return value?.startsWith("/burn/history/") ? value : null;
}

function getServerGeneratedTalismanSnapshot(): null {
  return null;
}

type SourceDateProps = {
  occurredAt: string | null;
};

function SourceDate({ occurredAt }: SourceDateProps) {
  if (!occurredAt) {
    return null;
  }

  const dateParts = new Intl.DateTimeFormat("ko-KR", {
    day: "2-digit",
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Seoul",
    weekday: "long",
    year: "numeric",
  }).formatToParts(new Date(occurredAt));
  const dateLabel = `${getDatePart(dateParts, "year")}.${getDatePart(dateParts, "month")}.${getDatePart(dateParts, "day")}`;
  const dayPeriod =
    getDatePart(dateParts, "dayPeriod") === "오전" ? "AM" : "PM";
  const timeLabel = `${dayPeriod} ${getDatePart(dateParts, "hour")}:${getDatePart(dateParts, "minute")}`;

  return (
    <section className="mt-[28px]">
      <p className="text-lg leading-normal text-foreground">
        {dateLabel}
        <span className="ml-3">{getDatePart(dateParts, "weekday")}</span>
      </p>
      <p className="mt-0.5 text-[13px] leading-normal text-gray-500">
        {timeLabel}
      </p>
    </section>
  );
}

function getDatePart(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string {
  return parts.find((part) => part.type === type)?.value ?? "";
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
