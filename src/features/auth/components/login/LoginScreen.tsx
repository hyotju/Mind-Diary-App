"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AuthApiError, login } from "@/features/auth/api/auth";
import AuthPrimaryButton from "@/features/auth/components/common/AuthPrimaryButton";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

type LoginScreenProps = {
  onPasswordReset: () => void;
  onSignup: () => void;
};

export default function LoginScreen({
  onPasswordReset,
  onSignup,
}: LoginScreenProps) {
  const router = useRouter();
  const clearProfile = useUserStore((state) => state.clearProfile);
  const setTokens = useAuthStore((state) => state.setTokens);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit =
    phoneNumber.trim().length > 0 && password.length > 0 && !isSubmitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);

    try {
      const tokens = await login({
        password,
        phoneNumber: phoneNumber.trim(),
      });
      clearProfile();
      setTokens(tokens);
      router.replace("/");
    } catch (error) {
      const message =
        error instanceof AuthApiError
          ? error.message
          : "로그인에 실패했습니다. 다시 시도해주세요.";

      window.alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="login-title" className="absolute inset-0">
      <div className="absolute left-1/2 top-[135px] flex w-[183px] -translate-x-1/2 flex-col items-center">
        <Image
          alt=""
          className="h-[142px] w-[162px] max-w-none"
          height={142}
          priority
          src="/figma/auth/login-character.svg"
          width={162}
        />
        <div className="mt-[41px] text-center">
          <h1
            className="h-8 font-logo text-[30px] font-extrabold leading-[35px] text-orange-400"
            id="login-title"
          >
            마음부적
          </h1>
          <p className="mt-2.5 w-[281px] text-base font-medium leading-[22px] text-orange-100">
            마음을 기록하고,
            <br />
            따뜻한 위로를 건네받는 공간
          </p>
        </div>
      </div>

      <form
        className="absolute left-1/2 top-[463px] w-[345px] -translate-x-1/2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-3.5">
          <label className="sr-only" htmlFor="login-phone-number">
            전화번호
          </label>
          <input
            autoComplete="tel"
            className="h-[57px] rounded-lg border border-[rgba(230,230,230,0.6)] bg-transparent px-[17px] text-lg leading-[23px] text-gray-100 outline-none placeholder:text-[rgba(230,230,230,0.6)]"
            id="login-phone-number"
            inputMode="tel"
            name="phoneNumber"
            onChange={(event) => setPhoneNumber(event.target.value)}
            placeholder="아이디 입력"
            type="text"
            value={phoneNumber}
          />
          <label className="sr-only" htmlFor="login-password">
            비밀번호
          </label>
          <input
            autoComplete="current-password"
            className="h-[57px] rounded-lg border border-[rgba(230,230,230,0.6)] bg-transparent px-[17px] text-lg leading-[23px] text-gray-100 outline-none placeholder:text-[rgba(230,230,230,0.6)]"
            id="login-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호 입력"
            type="password"
            value={password}
          />
        </div>
        <AuthPrimaryButton
          className="mt-[25px]"
          disabled={!canSubmit}
          type="submit"
        >
          로그인
        </AuthPrimaryButton>
      </form>

      <nav
        aria-label="계정 찾기 및 가입"
        className="absolute left-1/2 top-[688px] flex -translate-x-1/2 items-center gap-[18px] whitespace-nowrap text-[13px] leading-[23px] text-[rgba(230,230,230,0.7)]"
      >
        <button onClick={onPasswordReset} type="button">
          비밀번호 찾기
        </button>
        <span
          aria-hidden="true"
          className="h-[19px] w-px bg-[rgba(230,230,230,0.7)]"
        />
        <button onClick={onSignup} type="button">
          회원가입
        </button>
      </nav>
    </section>
  );
}
