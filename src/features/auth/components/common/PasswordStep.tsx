import AuthPrimaryButton from "@/features/auth/components/common/AuthPrimaryButton";
import SignupField from "@/features/auth/components/common/SignupField";
import SignupHeader from "@/features/auth/components/common/SignupHeader";

type PasswordStepProps = {
  buttonLabel?: string;
  confirmPassword: string;
  confirmPasswordErrorMessage?: string | null;
  confirmPasswordLabel?: string;
  errorMessage: string | null;
  isSubmitting: boolean;
  onBack: () => void;
  onConfirmPasswordChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  password: string;
  passwordErrorMessage?: string | null;
  passwordLabel?: string;
  submittingLabel?: string;
  title?: string;
};

export default function PasswordStep({
  buttonLabel = "가입",
  confirmPassword,
  confirmPasswordErrorMessage,
  confirmPasswordLabel = "한번 더 입력해주세요.",
  errorMessage,
  isSubmitting,
  onBack,
  onConfirmPasswordChange,
  onPasswordChange,
  onSubmit,
  password,
  passwordErrorMessage,
  passwordLabel = "비밀번호를 입력해주세요.",
  submittingLabel = "가입 중",
  title,
}: PasswordStepProps) {
  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;
  const hasMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <section className="absolute inset-0 bg-white text-foreground">
      <SignupHeader onBack={onBack} title={title} />

      <div className="absolute left-6 right-6 top-32">
        <PasswordFieldGroup
          errorMessage={passwordErrorMessage}
          label={passwordLabel}
        >
          <SignupField
            autoComplete="new-password"
            endAdornment={password ? <FieldCheck /> : null}
            id="signup-password"
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="비밀번호"
            type="password"
            value={password}
          />
        </PasswordFieldGroup>

        <PasswordFieldGroup
          className="mt-[25px]"
          errorMessage={
            confirmPasswordErrorMessage ??
            (hasMismatch ? "비밀번호가 일치하지 않아요." : null)
          }
          label={confirmPasswordLabel}
        >
          <SignupField
            autoComplete="new-password"
            endAdornment={confirmPassword ? <FieldCheck /> : null}
            id="signup-password-confirm"
            onChange={(event) => onConfirmPasswordChange(event.target.value)}
            placeholder="비밀번호"
            type="password"
            value={confirmPassword}
          />
        </PasswordFieldGroup>

        {errorMessage ? (
          <p className="mt-[-2px] text-right text-[13px] leading-[27px] text-red-500">
            {errorMessage}
          </p>
        ) : null}
      </div>

      <div className="absolute inset-x-6 bottom-[51px]">
        <AuthPrimaryButton
          disabled={!passwordsMatch || isSubmitting}
          onClick={onSubmit}
          type="button"
          variant="light"
        >
          {isSubmitting ? submittingLabel : buttonLabel}
        </AuthPrimaryButton>
      </div>
    </section>
  );
}

type PasswordFieldGroupProps = {
  children: React.ReactNode;
  className?: string;
  errorMessage?: string | null;
  label: string;
};

function PasswordFieldGroup({
  children,
  className = "",
  errorMessage,
  label,
}: PasswordFieldGroupProps) {
  return (
    <div className={`h-[133px] ${className}`}>
      <label className="mb-[15px] block text-xl font-medium leading-[27px]">
        {label}
      </label>
      {children}
      <p className="mt-[7px] min-h-[27px] text-right text-[13px] leading-[27px] text-red-500">
        {errorMessage}
      </p>
    </div>
  );
}

function FieldCheck() {
  return (
    <span
      aria-hidden="true"
      className="ml-3 text-2xl font-light leading-none text-orange-400"
    >
      ✓
    </span>
  );
}
