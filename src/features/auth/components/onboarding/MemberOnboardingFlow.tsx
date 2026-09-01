"use client";

import { useState } from "react";

import SajuProfileStep from "@/features/auth/components/signup/SajuProfileStep";
import TermsStep from "@/features/auth/components/signup/TermsStep";
import { useCompleteOnboarding } from "@/features/auth/hooks/useCompleteOnboarding";
import type { SignUpTerms } from "@/features/auth/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

type MemberOnboardingStep = "saju" | "terms";

type MemberOnboardingFlowProps = {
  onExit: () => void;
};

const INITIAL_TERMS: SignUpTerms = {
  marketingAgreed: false,
  privacyAndSensitiveAgreed: false,
  termsAgreed: false,
};

export default function MemberOnboardingFlow({
  onExit,
}: MemberOnboardingFlowProps) {
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const clearProfile = useUserStore((state) => state.clearProfile);
  const { isSubmitting, submitOnboarding } = useCompleteOnboarding();
  const [step, setStep] = useState<MemberOnboardingStep>("terms");
  const [terms, setTerms] = useState<SignUpTerms>(INITIAL_TERMS);

  const handleExit = () => {
    clearTokens();
    clearProfile();
    onExit();
  };

  return step === "terms" ? (
    <TermsStep
      onBack={handleExit}
      onNext={() => setStep("saju")}
      onTermsChange={setTerms}
      terms={terms}
    />
  ) : (
    <SajuProfileStep
      isSubmitting={isSubmitting}
      onBack={() => setStep("terms")}
      onConfirm={async (profile) => {
        try {
          await submitOnboarding(profile, terms);
        } catch (error) {
          window.alert(
            error instanceof Error
              ? error.message
              : "기본정보를 저장하지 못했어요.",
          );
        }
      }}
    />
  );
}
