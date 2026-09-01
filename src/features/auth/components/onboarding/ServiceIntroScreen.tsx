import AuthPrimaryButton from "@/features/auth/components/common/AuthPrimaryButton";
import type { ServiceIntroStep } from "@/features/auth/constants";

type ServiceIntroScreenProps = {
  currentStep: number;
  onNext: () => void;
  step: ServiceIntroStep;
  totalSteps: number;
};

export default function ServiceIntroScreen({
  currentStep,
  onNext,
  step,
  totalSteps,
}: ServiceIntroScreenProps) {
  return (
    <section aria-labelledby="intro-title" className="absolute inset-0">
      <div className="absolute left-1/2 top-[325px] flex -translate-x-1/2 flex-col items-center text-center">
        <h1
          className="h-8 whitespace-nowrap text-[30px] font-bold leading-[35px] text-orange-400"
          id="intro-title"
        >
          {step.title}
        </h1>
        <p className="mt-[29px] w-[281px] whitespace-pre-line text-base font-medium leading-[22px] text-orange-100">
          {step.description}
        </p>
      </div>

      <div
        aria-label={`${totalSteps}단계 중 ${currentStep + 1}단계`}
        className="absolute left-1/2 top-[456px] flex -translate-x-1/2 items-center gap-1.5"
        role="status"
      >
        {Array.from({ length: totalSteps }, (_, index) => (
          <span
            className={
              index === currentStep
                ? "h-[8px] w-8 rounded-full bg-orange-500"
                : "size-[8px] rounded-full bg-orange-200"
            }
            key={index}
          />
        ))}
      </div>

      <div className="absolute inset-x-6 bottom-[50px]">
        <AuthPrimaryButton onClick={onNext} type="button">
          다음
        </AuthPrimaryButton>
      </div>
    </section>
  );
}
