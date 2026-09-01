import Image from "next/image";
import Link from "next/link";

import TermsScrollArea from "@/features/user/components/account/TermsScrollArea";
import { SERVICE_TERMS } from "@/features/user/serviceTerms";

const SERVICE_TERM_LINES = SERVICE_TERMS.split("\n");

export default function ServiceTermsPage() {
  return (
    <main className="h-dvh overflow-hidden bg-gray-100 text-foreground">
      <div className="relative mx-auto h-dvh w-full max-w-[393px] overflow-hidden bg-background">
        <header className="absolute left-6 right-6 top-[70px] z-10 grid h-7 grid-cols-[28px_1fr_28px] items-center">
          <Link
            aria-label="마이 화면으로 돌아가기"
            className="flex size-7 items-center justify-center"
            href="/my"
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
            서비스 이용약관
          </h1>
        </header>

        <section
          aria-label="서비스 이용약관 전문"
          className="absolute left-6 right-6 top-[128px] h-[calc(100dvh-111px)] overflow-hidden rounded-lg border border-gray-100 bg-white shadow-[0_4px_20px_rgba(18,18,18,0.05)]"
        >
          <TermsScrollArea>
            {SERVICE_TERM_LINES.map((line, index) => (
              <p className="whitespace-pre-wrap break-words" key={index}>
                {line}
              </p>
            ))}
          </TermsScrollArea>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-2 bottom-0 h-[37px] bg-gradient-to-b from-transparent to-white"
          />
        </section>
      </div>
    </main>
  );
}
