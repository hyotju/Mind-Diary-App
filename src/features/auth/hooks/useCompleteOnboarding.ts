"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { completeOnboarding } from "@/features/auth/api/auth";
import type { SajuProfileDraft, SignUpTerms } from "@/features/auth/types";
import { createSajuAnalysis } from "@/features/user/api/sajuAnalyses";
import { getMyProfile } from "@/features/user/api/profile";
import { useUserStore } from "@/store/useUserStore";

export function useCompleteOnboarding() {
  const router = useRouter();
  const setProfile = useUserStore((state) => state.setProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitOnboarding = async (
    profile: SajuProfileDraft,
    terms: SignUpTerms,
  ): Promise<void> => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await completeOnboarding({
        birthDate: profile.birthDate.replaceAll("-", ""),
        birthTime: profile.birthTime,
        calendarType: profile.calendarType,
        gender: profile.gender,
        marketingAgreed: terms.marketingAgreed,
        privacyAgreed: terms.privacyAndSensitiveAgreed,
        sensitiveDataAgreed: terms.privacyAndSensitiveAgreed,
        termsAgreed: terms.termsAgreed,
      });

      const memberProfile = await getMyProfile();
      setProfile(memberProfile);

      try {
        await createSajuAnalysis();
      } catch {
        // Onboarding is complete even if the asynchronous analysis cannot start.
      }

      router.replace("/");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, submitOnboarding };
}
