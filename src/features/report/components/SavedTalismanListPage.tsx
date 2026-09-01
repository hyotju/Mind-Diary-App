"use client";

import Link from "next/link";

import ServerTalismanCard from "@/features/report/components/ServerTalismanCard";
import TalismanPageHeader from "@/features/report/components/TalismanPageHeader";
import { useTalismans } from "@/features/report/hooks/useTalismans";

const TALISMAN_PAGE_SIZE = 12;

export default function SavedTalismanListPage() {
  const { error, hasNext, isLoading, isLoadingMore, items, loadMore } =
    useTalismans(TALISMAN_PAGE_SIZE);

  return (
    <main className="h-dvh overflow-hidden bg-gray-100 text-foreground">
      <div className="mx-auto h-dvh w-full max-w-[395px] overflow-y-auto bg-background px-6 pb-[32px] pt-[28px]">
        <TalismanPageHeader backHref="/report" />

        <section className="mt-[21px]" aria-labelledby="saved-talisman-title">
          <h2
            className="text-xl font-medium leading-[22px]"
            id="saved-talisman-title"
          >
            나의 부적
          </h2>

          {items.length > 0 ? (
            <>
              <div className="mt-[25px] grid grid-cols-3 gap-x-[23.1px] gap-y-[21.65px]">
                {items.map((talisman) => (
                  <Link
                    aria-label={`${talisman.title ?? "마음부적"} 자세히 보기`}
                    className="outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                    href={`/report/talismans/${talisman.talismanId}`}
                    key={talisman.talismanId}
                  >
                    <ServerTalismanCard talisman={talisman} variant="list" />
                  </Link>
                ))}
              </div>

              {hasNext ? (
                <button
                  className="mx-auto mt-6 flex h-10 items-center justify-center px-4 text-sm font-medium text-gray-500 disabled:text-gray-300"
                  disabled={isLoadingMore}
                  onClick={() => void loadMore()}
                  type="button"
                >
                  {isLoadingMore ? "불러오는 중" : "더보기"}
                </button>
              ) : null}
            </>
          ) : (
            <div className="mt-[25px] flex h-[150px] items-center justify-center border border-dashed border-gray-200 text-sm text-gray-400">
              {isLoading
                ? "부적을 불러오고 있어요."
                : "저장한 부적이 아직 없어요."}
            </div>
          )}

          <p aria-live="polite" className="sr-only">
            {error}
          </p>
        </section>
      </div>
    </main>
  );
}
