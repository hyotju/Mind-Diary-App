"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  AuthApiError,
  sendProfilePhoneSms,
  verifySmsCode,
} from "@/features/auth/api/auth";
import { formatProfilePhoneNumber } from "@/features/user/utils";
import { useProfileEditStore } from "@/store/useProfileEditStore";
import { useUserStore } from "@/store/useUserStore";

const SMS_LIMIT_SECONDS = 3 * 60;

export function usePhoneChange() {
  const router = useRouter();
  const currentPhoneNumber = useUserStore(
    (state) => state.profile?.phoneNumber ?? "",
  );
  const setVerifiedPhoneNumber = useProfileEditStore(
    (state) => state.setVerifiedPhoneNumber,
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [hasSentCode, setHasSentCode] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [remainingSeconds]);

  const phoneNumberDigits = useMemo(
    () => phoneNumber.replace(/\D/g, ""),
    [phoneNumber],
  );
  const canSend =
    phoneNumberDigits.length === 11 &&
    phoneNumberDigits !== currentPhoneNumber.replace(/\D/g, "") &&
    !isSending;
  const canVerify =
    hasSentCode && remainingSeconds > 0 && code.length === 6 && !isVerifying;

  const changePhoneNumber = (value: string): void => {
    setPhoneNumber(formatProfilePhoneNumber(value));
    setCode("");
    setRemainingSeconds(0);
    setHasSentCode(false);
    setError(null);
  };

  const sendCode = async (): Promise<void> => {
    if (!canSend) {
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      await sendProfilePhoneSms(phoneNumberDigits);
      setCode("");
      setHasSentCode(true);
      setRemainingSeconds(SMS_LIMIT_SECONDS);
    } catch (sendError) {
      setError(
        sendError instanceof AuthApiError
          ? sendError.message
          : "인증번호를 전송하지 못했어요.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const verifyCode = async (): Promise<void> => {
    if (!canVerify) {
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      await verifySmsCode({ code, phoneNumber: phoneNumberDigits });
      setVerifiedPhoneNumber(phoneNumberDigits);
      router.replace("/my/profile");
    } catch (verifyError) {
      setError(
        verifyError instanceof AuthApiError
          ? verifyError.message
          : "인증번호가 올바르지 않아요.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return {
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
  };
}
