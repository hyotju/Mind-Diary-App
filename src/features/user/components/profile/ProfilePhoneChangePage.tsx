"use client";

import Image from "next/image";
import Link from "next/link";

import { usePhoneChange } from "@/features/user/hooks/usePhoneChange";

export default function ProfilePhoneChangePage() {
  const {
    canSend,
    canVerify,
    changePhoneNumber,
    code,
    error,
    hasSentCode,
    isSending,
    isVerifying,
    phoneNumber,
    remainingSeconds,
    sendCode,
    setCode,
    verifyCode,
  } = usePhoneChange();

  return (
    <main className="h-dvh overflow-hidden bg-gray-100 text-foreground">
      <div className="relative mx-auto h-dvh w-full max-w-[393px] overflow-hidden bg-background">
        <header className="relative flex h-[54px] items-center justify-center">
          <Link
            aria-label="프로필 수정으로 돌아가기"
            className="absolute left-4 top-[13px] flex size-7 items-center justify-center"
            href="/my/profile"
          >
            <Image
              alt=""
              height={24}
              src="/figma/my/profile-phone-back.svg"
              width={24}
            />
          </Link>
          <h1 className="text-xl font-semibold leading-[30px]">
            전화번호 변경
          </h1>
        </header>

        <section className="px-8 pt-8">
          <label
            className="block text-sm font-semibold leading-[21px]"
            htmlFor="new-phone-number"
          >
            새 전화번호
          </label>
          <div className="mt-2 flex h-[37px] gap-2">
            <input
              className="min-w-0 flex-1 border-b-[1.6px] border-orange-500 bg-transparent pb-[9.6px] text-base leading-normal text-foreground outline-none placeholder:text-gray-300"
              id="new-phone-number"
              inputMode="tel"
              onChange={(event) => changePhoneNumber(event.target.value)}
              placeholder="010-0000-0000"
              value={phoneNumber}
            />
            <button
              className="h-[37px] shrink-0 rounded-lg bg-orange-500 px-4 text-sm font-semibold leading-[21px] text-white"
              disabled={!canSend}
              onClick={() => void sendCode()}
              type="button"
            >
              {isSending
                ? "전송 중"
                : hasSentCode
                  ? "다시 전송"
                  : "인증번호 전송"}
            </button>
          </div>

          {hasSentCode ? (
            <div className="mt-6">
              <label
                className="block text-sm font-semibold leading-[21px]"
                htmlFor="phone-verification-code"
              >
                인증번호
              </label>
              <div className="relative mt-2 h-[37px] border-b-[1.6px] border-orange-500">
                <input
                  autoComplete="one-time-code"
                  className="h-full w-full bg-transparent pb-[9.6px] pr-14 text-base leading-normal text-foreground outline-none placeholder:text-gray-300"
                  id="phone-verification-code"
                  inputMode="numeric"
                  maxLength={6}
                  onChange={(event) => {
                    setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                  }}
                  placeholder="6자리 인증번호"
                  value={code}
                />
                <span className="absolute right-0 top-0 text-sm leading-[21px] text-orange-400">
                  {formatTimer(remainingSeconds)}
                </span>
              </div>
            </div>
          ) : null}

          {error ? (
            <p aria-live="polite" className="mt-3 text-sm text-red-500">
              {error}
            </p>
          ) : null}
        </section>

        <button
          className="absolute bottom-[51px] left-6 right-6 h-[57px] rounded-lg bg-orange-500 text-xl font-semibold leading-[23px] text-white"
          disabled={!canVerify}
          onClick={() => void verifyCode()}
          type="button"
        >
          {isVerifying ? "확인 중" : "확인"}
        </button>
      </div>
    </main>
  );
}

function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}
