import Image from "next/image";

import AuthPrimaryButton from "@/features/auth/components/common/AuthPrimaryButton";
import SignupHeader from "@/features/auth/components/common/SignupHeader";
import type { SignUpTerms } from "@/features/auth/types";

type TermsStepProps = {
  onBack: () => void;
  onNext: () => void;
  onTermsChange: (terms: SignUpTerms) => void;
  terms: SignUpTerms;
};

const TERMS_DETAIL_MESSAGE = "약관을 준비중입니다.";

export default function TermsStep({
  onBack,
  onNext,
  onTermsChange,
  terms,
}: TermsStepProps) {
  const isAllAgreed =
    terms.termsAgreed &&
    terms.privacyAndSensitiveAgreed &&
    terms.marketingAgreed;
  const canContinue = terms.termsAgreed && terms.privacyAndSensitiveAgreed;

  const showTermsNotice = () => {
    window.alert(TERMS_DETAIL_MESSAGE);
  };

  return (
    <section className="absolute inset-0 bg-white text-foreground">
      <SignupHeader onBack={onBack} />

      <div className="absolute left-6 right-6 top-32">
        <p className="text-xl font-medium leading-[27px]">
          이용약관에 동의해주세요.
        </p>

        <AgreementRow
          checked={isAllAgreed}
          className="ml-[-5px] mt-[38px] h-[57px] w-[345px] rounded-lg bg-gray-100 px-5"
          label="약관 전체 동의"
          onChange={(checked) =>
            onTermsChange({
              marketingAgreed: checked,
              privacyAndSensitiveAgreed: checked,
              termsAgreed: checked,
            })
          }
        />

        <div className="mt-[9px]">
          <AgreementRow
            checked={terms.termsAgreed}
            indented
            label="[필수] 마음부적 이용약관 동의"
            onChange={(checked) =>
              onTermsChange({ ...terms, termsAgreed: checked })
            }
            onDetail={showTermsNotice}
          />
          <AgreementRow
            checked={terms.privacyAndSensitiveAgreed}
            className="mt-3"
            indented
            label="[필수] 개인정보·민감정보 수집"
            onChange={(checked) =>
              onTermsChange({
                ...terms,
                privacyAndSensitiveAgreed: checked,
              })
            }
            onDetail={showTermsNotice}
          />
          <AgreementRow
            checked={terms.marketingAgreed}
            className="mt-3"
            indented
            label="[선택] 마케팅 및 푸시알림 수신 동의"
            onChange={(checked) =>
              onTermsChange({ ...terms, marketingAgreed: checked })
            }
            onDetail={showTermsNotice}
          />
        </div>

        <div className="ml-5 mt-[18px] flex flex-col gap-[26px]">
          <TermsSubRow label="마음부적 서비스 관련 수집 및 이용" />
          <TermsSubRow label="마음부적 서비스 관련 제공" />
          <TermsSubRow
            label="전자적 전송매체를 통한 광고성 정보"
            showSafeBadge={false}
          />
        </div>
      </div>

      <div className="absolute inset-x-6 bottom-[51px]">
        <AuthPrimaryButton
          disabled={!canContinue}
          onClick={onNext}
          type="button"
          variant="light"
        >
          다음
        </AuthPrimaryButton>
      </div>
    </section>
  );
}

type AgreementRowProps = {
  checked: boolean;
  className?: string;
  indented?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  onDetail?: () => void;
};

function AgreementRow({
  checked,
  className = "",
  indented = false,
  label,
  onChange,
  onDetail,
}: AgreementRowProps) {
  return (
    <div className={`flex h-[48px] items-center ${className}`}>
      <label
        className={`flex min-w-0 flex-1 cursor-pointer items-center gap-3 ${
          indented ? "pl-[15px]" : ""
        }`}
      >
        <input
          checked={checked}
          className="peer sr-only"
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
        />
        <span className="flex size-[22px] shrink-0 items-center justify-center rounded-[5px] border border-gray-400 bg-white text-base font-semibold leading-none text-transparent peer-checked:border-orange-500 peer-checked:bg-orange-500 peer-checked:text-white">
          ✓
        </span>
        <span className="truncate text-lg font-medium leading-[23px]">
          {label}
        </span>
      </label>
      {onDetail ? (
        <button
          aria-label={`${label} 상세 보기`}
          className="ml-2 flex size-7 shrink-0 items-center justify-center text-gray-400 outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          onClick={onDetail}
          type="button"
        >
          <ChevronRightIcon />
        </button>
      ) : null}
    </div>
  );
}

type TermsSubRowProps = {
  label: string;
  showSafeBadge?: boolean;
};

function TermsSubRow({ label, showSafeBadge = true }: TermsSubRowProps) {
  return (
    <div className="flex h-[26px] items-center text-gray-400">
      <span
        aria-hidden="true"
        className="mr-[18px] text-xl leading-none text-orange-500"
      >
        ✓
      </span>
      <span className="min-w-0 flex-1 truncate text-base font-medium leading-[22px]">
        {label}
      </span>
      {showSafeBadge ? (
        <span className="ml-2 rounded-[9px] bg-orange-100 px-1.5 text-xs font-medium leading-[21px] text-orange-400">
          안심
        </span>
      ) : null}
      <button
        aria-label={`${label} 상세 보기`}
        className="ml-1 flex size-7 shrink-0 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        onClick={() => window.alert(TERMS_DETAIL_MESSAGE)}
        type="button"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <Image
      alt=""
      className="rotate-90"
      height={8.33}
      src="/figma/auth/terms-chevron.svg"
      width={14.33}
    />
  );
}
