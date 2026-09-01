import AuthPrimaryButton from "@/features/auth/components/common/AuthPrimaryButton";
import SignupField from "@/features/auth/components/common/SignupField";
import SignupHeader from "@/features/auth/components/common/SignupHeader";

type VerificationStepProps = {
  code: string;
  errorMessage: string | null;
  isSending: boolean;
  isVerifying: boolean;
  name: string;
  onBack: () => void;
  onCodeChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onNext: () => void;
  onPhoneNumberChange: (value: string) => void;
  onSendCode: () => void;
  phoneNumber: string;
  phoneNumberLabel?: string;
  preserveActionColors?: boolean;
  remainingSeconds: number;
  submitLabel?: string;
  title?: string;
};

export default function VerificationStep({
  code,
  errorMessage,
  isSending,
  isVerifying,
  name,
  onBack,
  onCodeChange,
  onNameChange,
  onNext,
  onPhoneNumberChange,
  onSendCode,
  phoneNumber,
  phoneNumberLabel = "전화번호를 입력해주세요.",
  preserveActionColors = false,
  remainingSeconds,
  submitLabel = "다음",
  title,
}: VerificationStepProps) {
  const hasActiveTimer = remainingSeconds > 0;
  const canSendCode = name.trim().length > 0 && phoneNumber.trim().length > 0;
  const canContinue =
    canSendCode && code.trim().length > 0 && hasActiveTimer && !isVerifying;

  return (
    <section className="absolute inset-0 bg-white text-foreground">
      <SignupHeader onBack={onBack} title={title} />

      <div className="absolute left-6 right-6 top-32">
        <FieldGroup label="이름을 입력해주세요.">
          <SignupField
            autoComplete="name"
            id="signup-name"
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="이름"
            value={name}
          />
        </FieldGroup>

        <FieldGroup className="mt-[25px]" label={phoneNumberLabel}>
          <div className="flex gap-[13px]">
            <SignupField
              autoComplete="tel"
              className="w-[242px]"
              id="signup-phone"
              inputMode="tel"
              onChange={(event) => onPhoneNumberChange(event.target.value)}
              placeholder="전화번호"
              value={phoneNumber}
            />
            <button
              className={`h-[57px] w-[90px] shrink-0 rounded-lg bg-foreground text-lg leading-[23px] text-white disabled:bg-gray-100 disabled:text-gray-400 ${
                preserveActionColors
                  ? "disabled:!bg-foreground disabled:!text-white"
                  : ""
              }`}
              disabled={!canSendCode || isSending}
              onClick={onSendCode}
              type="button"
            >
              {isSending ? "전송 중" : "인증"}
            </button>
          </div>
        </FieldGroup>

        <FieldGroup className="mt-[25px]" label="인증번호를 입력해주세요.">
          <SignupField
            autoComplete="one-time-code"
            endAdornment={
              <span className="ml-3 shrink-0 text-lg leading-[23px] text-orange-400">
                {formatTimer(remainingSeconds)}
              </span>
            }
            hasError={Boolean(errorMessage)}
            id="signup-verification-code"
            inputMode="numeric"
            maxLength={6}
            onChange={(event) =>
              onCodeChange(event.target.value.replace(/\D/g, ""))
            }
            placeholder="인증번호"
            value={code}
          />
        </FieldGroup>

        {errorMessage ? (
          <p className="mt-1.5 text-right text-[13px] leading-[27px] text-red-500">
            {errorMessage}
          </p>
        ) : null}
        {!hasActiveTimer && code ? (
          <p className="mt-1.5 text-right text-[13px] leading-[27px] text-red-500">
            인증 시간이 만료되었어요. 다시 인증해주세요.
          </p>
        ) : null}
      </div>

      <div className="absolute inset-x-6 bottom-[51px]">
        <AuthPrimaryButton
          className={
            preserveActionColors
              ? "disabled:!bg-orange-500 disabled:!text-white"
              : ""
          }
          disabled={!canContinue}
          onClick={onNext}
          type="button"
          variant="light"
        >
          {isVerifying ? "확인 중" : submitLabel}
        </AuthPrimaryButton>
      </div>
    </section>
  );
}

type FieldGroupProps = {
  children: React.ReactNode;
  className?: string;
  label: string;
};

function FieldGroup({ children, className = "", label }: FieldGroupProps) {
  return (
    <div className={className}>
      <label className="mb-[15px] block text-xl font-medium leading-[27px]">
        {label}
      </label>
      {children}
    </div>
  );
}

function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}
