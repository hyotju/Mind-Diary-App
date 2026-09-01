"use client";

import Image from "next/image";
import Link from "next/link";

import BottomNavigation from "@/components/layout/BottomNavigation";
import { MAIN_NAVIGATION_ITEMS } from "@/constants/navigation";
import AccountMenuSection from "@/features/user/components/account/AccountMenuSection";
import FiveElementGaugeSection from "@/features/user/components/main/FiveElementGaugeSection";
import MemberName from "@/features/user/components/main/MemberName";
import MyMenuSection from "@/features/user/components/main/MyMenuSection";
import {
  CONVENIENCE_MENU_ITEMS,
  SUPPORT_MENU_ITEMS,
} from "@/features/user/constants/menu";
import { FIVE_ELEMENT_ORDER } from "@/features/user/constants/saju";
import { useLatestSajuAnalysis } from "@/features/user/hooks/useLatestSajuAnalysis";
import type {
  FiveElementGaugeValue,
  SajuAnalysisStatus,
} from "@/features/user/types";

export default function MyPage() {
  const { analysis, error, isLoading } = useLatestSajuAnalysis();
  const elements = analysis?.elements;
  const gaugeValues: FiveElementGaugeValue[] | null = elements
    ? FIVE_ELEMENT_ORDER.map((element) => ({
        element,
        percentage: elements[element],
      }))
    : null;
  const gaugeStatusMessage = getGaugeStatusMessage(
    analysis?.status,
    error,
    isLoading,
  );

  return (
    <main className="h-dvh overflow-hidden bg-gray-100 text-foreground">
      <div className="relative mx-auto h-dvh w-full max-w-[393px] overflow-hidden bg-background">
        <div className="h-full overflow-y-auto px-6 pb-[calc(116px+env(safe-area-inset-bottom))] pt-[25px]">
          <header className="grid h-7 grid-cols-[28px_1fr_28px] items-center">
            <Link
              aria-label="홈으로 돌아가기"
              className="flex size-7 items-center justify-center"
              href="/"
            >
              <Image
                alt=""
                className="-rotate-90"
                height={28}
                src="/figma/my/back-arrow.svg"
                width={28}
              />
            </Link>
            <h1 className="text-center text-xl font-medium leading-[23px]">
              마이
            </h1>
          </header>

          <section
            className="mt-[31px] flex h-[59px] items-center justify-between"
            aria-label="프로필"
          >
            <div className="flex items-center gap-[21px]">
              <div className="relative size-[59px] shrink-0 rounded-full bg-orange-100 shadow-[0_5.364px_26.818px_rgba(18,18,18,0.05)]">
                <Image
                  alt=""
                  className="absolute left-[13.41px] top-[9.39px]"
                  height={40}
                  src="/figma/my/profile-flame-v2.svg"
                  width={32}
                />
              </div>
              <p className="whitespace-nowrap text-xl font-semibold leading-[22px]">
                <MemberName /> 님
              </p>
            </div>

            <Link
              className="flex h-[29px] shrink-0 items-center rounded-[50px] bg-orange-500 px-[15px] text-[13px] font-medium leading-normal text-white"
              href="/my/profile"
            >
              프로필 수정
            </Link>
          </section>

          <FiveElementGaugeSection
            statusMessage={gaugeStatusMessage}
            values={gaugeValues}
          />
          <MyMenuSection
            className="w-[164px]"
            items={CONVENIENCE_MENU_ITEMS}
            title="생활편의"
          />
          <MyMenuSection items={SUPPORT_MENU_ITEMS} title="고객 지원" />
          <AccountMenuSection />
        </div>

        <BottomNavigation activeValue="my" items={MAIN_NAVIGATION_ITEMS} />
      </div>
    </main>
  );
}

function getGaugeStatusMessage(
  status: SajuAnalysisStatus | undefined,
  error: string | null,
  isLoading: boolean,
): string {
  if (error) {
    return error;
  }

  if (isLoading || status === "PENDING" || status === "PROCESSING") {
    return "오행 분석 결과를 불러오고 있어요.";
  }

  if (status === "FAILED") {
    return "오행 분석을 완료하지 못했어요.";
  }

  return "오행 분석 결과를 불러왔어요.";
}
