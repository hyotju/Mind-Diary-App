import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import BottomNavigation from "@/components/layout/BottomNavigation";
import { MAIN_NAVIGATION_ITEMS } from "@/constants/navigation";

type NotificationPageShellProps = {
  backHref: string;
  children: ReactNode;
};

export default function NotificationPageShell({
  backHref,
  children,
}: NotificationPageShellProps) {
  return (
    <main className="h-dvh overflow-hidden bg-gray-100 text-foreground">
      <div className="relative mx-auto h-dvh w-full max-w-[393px] overflow-hidden bg-background">
        <header className="absolute left-6 right-6 top-7 grid h-7 grid-cols-[28px_1fr_28px] items-center">
          <Link
            aria-label="이전 화면으로 돌아가기"
            className="flex size-7 items-center justify-center"
            href={backHref}
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
            알림 설정
          </h1>
        </header>

        {children}

        <BottomNavigation activeValue="my" items={MAIN_NAVIGATION_ITEMS} />
      </div>
    </main>
  );
}
