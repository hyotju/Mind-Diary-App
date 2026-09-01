"use client";

import Image from "next/image";
import Link from "next/link";

import BottomNavigation from "@/components/layout/BottomNavigation";
import { MAIN_NAVIGATION_ITEMS } from "@/constants/navigation";
import CreateTalismanButton from "@/features/burn/components/CreateTalismanButton";
import TalismanCard from "@/features/burn/components/TalismanCard";
import { useBurningDetail } from "@/features/burn/hooks/useBurningHistory";
import { toGeneratedTalisman } from "@/features/burn/utils";

type BurningHistoryDetailPageProps = {
  burningId: string;
};

export default function BurningHistoryDetailPage({
  burningId,
}: BurningHistoryDetailPageProps) {
  const parsedBurningId = Number(burningId);
  const validBurningId =
    Number.isInteger(parsedBurningId) && parsedBurningId > 0
      ? parsedBurningId
      : null;
  const { detail, error, isLoading } = useBurningDetail(validBurningId);
  const talisman = detail ? toGeneratedTalisman(detail) : null;

  return (
    <main className="h-dvh overflow-hidden bg-gray-100 text-foreground">
      <div className="relative mx-auto h-dvh w-full max-w-[395px] overflow-y-auto bg-background px-5 pb-[calc(110px+env(safe-area-inset-bottom))] pt-[28px]">
        <header className="grid grid-cols-[28px_1fr_28px] items-center">
          <Link
            aria-label="소각 기록 목록으로 돌아가기"
            className="flex size-7 items-center justify-center"
            href="/burn/history"
          >
            <Image
              alt=""
              className="-rotate-90"
              height={8}
              src="/figma/burn/history-back.svg"
              unoptimized
              width={14}
            />
          </Link>
          <h1 className="text-center text-xl font-medium leading-[23px]">
            소각
          </h1>
        </header>

        {detail ? (
          <>
            <DateHeader burnedAt={detail.burnedAt} />

            <div className="mt-[20px] flex flex-col gap-[15px]">
              <InformationCard
                icon="flame"
                text={detail.sourceContent || "기록된 소각 내용이 없어요."}
                title="내가 태운 마음"
              />
              <InformationCard
                icon="star"
                text={detail.guidance || "개운지침을 준비하고 있어요."}
                title="오늘의 개운지침"
              />
            </div>

            <section className="mt-[21px]">
              {talisman ? (
                <TalismanCard talisman={talisman} />
              ) : (
                <>
                  <div className="flex aspect-[288/385] w-full flex-col items-center justify-center rounded-[15px] border border-gray-200 bg-gray-100 text-center text-[13px] leading-[22px] text-gray-400">
                    <Image
                      alt=""
                      height={36}
                      src="/figma/burn/history-lock.svg"
                      unoptimized
                      width={36}
                    />
                    <p className="mt-[13px]">
                      이날은 부적을 생성하지
                      <br />
                      않았어요.
                    </p>
                  </div>
                  {validBurningId ? (
                    <div className="mt-[25px]">
                      <CreateTalismanButton
                        burningId={validBurningId}
                        returnHref={`/burn/history/${validBurningId}`}
                      />
                    </div>
                  ) : null}
                </>
              )}
            </section>
          </>
        ) : (
          <div className="flex min-h-[600px] items-center justify-center text-sm text-gray-400">
            {isLoading ? "소각 기록을 불러오고 있어요." : error}
          </div>
        )}

        <BottomNavigation activeValue="burn" items={MAIN_NAVIGATION_ITEMS} />
      </div>
    </main>
  );
}

type DateHeaderProps = {
  burnedAt: string;
};

function DateHeader({ burnedAt }: DateHeaderProps) {
  const date = new Date(burnedAt);
  const dateParts = new Intl.DateTimeFormat("ko-KR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Seoul",
    weekday: "long",
    year: "numeric",
  }).formatToParts(date);

  return (
    <div className="mt-[22px] text-center">
      <time className="text-lg font-medium leading-[27px]" dateTime={burnedAt}>
        {`${getDatePart(dateParts, "year")}.${getDatePart(dateParts, "month")}.${getDatePart(dateParts, "day")}`}
      </time>
      <p className="mt-0.5 text-[15px] leading-[22px] text-gray-500">
        {getDatePart(dateParts, "weekday")}
      </p>
    </div>
  );
}

type InformationCardProps = {
  icon: "flame" | "star";
  text: string;
  title: string;
};

function InformationCard({ icon, text, title }: InformationCardProps) {
  return (
    <section className="rounded-[15px] border border-gray-200 bg-white px-5 py-[18px] shadow-[0_4px_20px_rgba(18,18,18,0.05)]">
      <h2 className="flex items-center gap-1.5 text-[15px] font-semibold leading-[22px]">
        {icon === "flame" ? (
          <Image
            alt=""
            height={15}
            src="/figma/burn/history-flame.svg"
            unoptimized
            width={15}
          />
        ) : (
          <span
            className="text-lg leading-none text-[#ffbf34]"
            aria-hidden="true"
          >
            ★
          </span>
        )}
        {title}
      </h2>
      <p className="mt-2 whitespace-pre-wrap text-[13px] leading-[21px] text-gray-500">
        {text}
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
