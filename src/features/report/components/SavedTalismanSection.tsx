"use client";

import Link from "next/link";

import ServerTalismanCard from "@/features/report/components/ServerTalismanCard";
import { useTalismans } from "@/features/report/hooks/useTalismans";

export default function SavedTalismanSection() {
  const { error, isLoading, items } = useTalismans(3);

  return (
    <section className="mt-[26px] px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium leading-[23px]">나의 부적</h2>
        <Link
          className="flex h-[29px] items-center justify-center rounded-full border border-gray-400 px-[13px] text-[13px] font-medium leading-normal text-gray-500"
          href="/report/talismans"
        >
          더보기
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="mt-[17px] grid grid-cols-3 gap-x-[23.28px]">
          {items.slice(0, 3).map((talisman) => (
            <Link
              aria-label={`${talisman.title ?? "마음부적"} 자세히 보기`}
              href={`/report/talismans/${talisman.talismanId}`}
              key={talisman.talismanId}
            >
              <ServerTalismanCard talisman={talisman} variant="report" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-[17px] flex h-[150px] items-center justify-center border border-dashed border-gray-200 text-sm text-gray-400">
          {isLoading ? "부적을 불러오고 있어요." : "저장한 부적이 아직 없어요."}
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {error}
      </p>
    </section>
  );
}
