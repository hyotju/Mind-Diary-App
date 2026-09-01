"use client";

import { useEffect, useState } from "react";

import {
  AuthApiError,
  resetPassword,
  sendPasswordResetSms,
  verifySmsCode,
} from "@/features/auth/api/auth";
import AuthNoticeDialog from "@/features/auth/components/common/AuthNoticeDialog";
import PasswordStep from "@/features/auth/components/common/PasswordStep";
import VerificationStep from "@/features/auth/components/common/VerificationStep";

type PasswordResetFlowProps = {
  onExit: () => void;
};

type PasswordResetStep = "verification" | "password";

const SMS_LIMIT_SECONDS = 3 * 60;

export default function PasswordResetFlow({ onExit }: PasswordResetFlowProps) {
  const [step, setStep] = useState<PasswordResetStep>("verification");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isUnregisteredNumber, setIsUnregisteredNumber] = useState(false);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [remainingSeconds]);

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    setCode("");
    setRemainingSeconds(0);
    setVerificationError(null);
  };

  const handleSendCode = async () => {
    setIsSending(true);
    setVerificationError(null);

    try {
      await sendPasswordResetSms(phoneNumber.trim());
      setCode("");
      setRemainingSeconds(SMS_LIMIT_SECONDS);
    } catch (error) {
      if (isUnregisteredNumberError(error)) {
        setIsUnregisteredNumber(true);
      } else {
        setVerificationError(getErrorMessage(error));
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (remainingSeconds <= 0 || !code.trim()) {
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      await verifySmsCode({
        code: code.trim(),
        phoneNumber: phoneNumber.trim(),
      });
      setStep("password");
    } catch {
      setVerificationError("인증번호가 잘못 입력되었어요.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || password !== confirmPassword) {
      return;
    }

    setIsSubmitting(true);
    setPasswordError(null);

    try {
      await resetPassword({
        newPassword: password,
        phoneNumber: phoneNumber.trim(),
      });
      onExit();
    } catch {
      setPasswordError("비밀번호가 잘못 입력되었어요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {step === "verification" ? (
        <VerificationStep
          code={code}
          errorMessage={verificationError}
          isSending={isSending}
          isVerifying={isVerifying}
          name={name}
          onBack={onExit}
          onCodeChange={(value) => {
            setCode(value);
            setVerificationError(null);
          }}
          onNameChange={setName}
          onNext={handleVerifyCode}
          onPhoneNumberChange={handlePhoneNumberChange}
          onSendCode={handleSendCode}
          phoneNumber={phoneNumber}
          phoneNumberLabel="가입한 전화번호를 입력해주세요."
          preserveActionColors
          remainingSeconds={remainingSeconds}
          submitLabel="확인"
          title="비밀번호 찾기"
        />
      ) : null}

      {step === "password" ? (
        <PasswordStep
          buttonLabel="설정"
          confirmPassword={confirmPassword}
          confirmPasswordErrorMessage={passwordError}
          confirmPasswordLabel="한번 더 입력해주세요."
          errorMessage={null}
          isSubmitting={isSubmitting}
          onBack={() => setStep("verification")}
          onConfirmPasswordChange={(value) => {
            setConfirmPassword(value);
            setPasswordError(null);
          }}
          onPasswordChange={(value) => {
            setPassword(value);
            setPasswordError(null);
          }}
          onSubmit={handleResetPassword}
          password={password}
          passwordErrorMessage={passwordError}
          passwordLabel="새로운 비밀번호를 입력해주세요."
          submittingLabel="설정 중"
          title="새 비밀번호 설정"
        />
      ) : null}

      {isUnregisteredNumber ? (
        <AuthNoticeDialog
          message="등록되지 않은 번호입니다."
          onConfirm={() => setIsUnregisteredNumber(false)}
        />
      ) : null}
    </>
  );
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "요청을 처리하지 못했어요. 다시 시도해주세요.";
}

function isUnregisteredNumberError(error: unknown): boolean {
  if (!(error instanceof AuthApiError)) {
    return false;
  }

  return (
    error.message.includes("등록되지 않은") ||
    error.message.includes("가입되지 않은")
  );
}
