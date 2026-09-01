"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import FeedbackScreen, {
  LoadingFlameIcon,
} from "@/components/common/FeedbackScreen";
import LoginScreen from "@/features/auth/components/login/LoginScreen";
import MemberOnboardingFlow from "@/features/auth/components/onboarding/MemberOnboardingFlow";
import PasswordResetFlow from "@/features/auth/components/password-reset/PasswordResetFlow";
import ServiceIntroScreen from "@/features/auth/components/onboarding/ServiceIntroScreen";
import WelcomeScreen from "@/features/auth/components/onboarding/WelcomeScreen";
import SignupFlow from "@/features/auth/components/signup/SignupFlow";

import { redirectToGoogleLogin } from "@/features/auth/api/auth";
import {
  SERVICE_INTRO_COMPLETED_STORAGE_KEY,
  SERVICE_INTRO_STEPS,
} from "@/features/auth/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

type OnboardingView =
  | "initializing"
  | "intro"
  | "login"
  | "member-onboarding"
  | "password-reset"
  | "signup"
  | "welcome";

type SignupReturnView = "login" | "welcome";

export default function OnboardingFlow() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const profile = useUserStore((state) => state.profile);
  const profileStatus = useUserStore((state) => state.profileStatus);
  const introCompletion = useSyncExternalStore(
    subscribeToServiceIntroStorage,
    getServiceIntroCompletion,
    getServerServiceIntroCompletion,
  );
  const [selectedView, setView] = useState<OnboardingView | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [signupReturnView, setSignupReturnView] =
    useState<SignupReturnView>("welcome");
  const view: OnboardingView =
    selectedView ??
    (introCompletion === null
      ? "initializing"
      : introCompletion
        ? "welcome"
        : "intro");

  const handleNext = () => {
    const isLastStep = currentStep === SERVICE_INTRO_STEPS.length - 1;

    if (isLastStep) {
      markServiceIntroCompleted();
      setView("welcome");
      return;
    }

    setCurrentStep((step) => step + 1);
  };

  useEffect(() => {
    if (view !== "welcome" || profileStatus !== "success" || !profile) {
      return;
    }

    if (profile.onboardingCompleted) {
      router.replace("/");
    }
  }, [profile, profileStatus, router, view]);

  const openSignup = (returnView: SignupReturnView): void => {
    setSignupReturnView(returnView);
    setView("signup");
  };

  const currentView =
    view === "welcome" &&
    (profileStatus === "onboarding-required" ||
      (profileStatus === "success" && profile && !profile.onboardingCompleted))
      ? "member-onboarding"
      : view;

  if (
    view === "initializing" ||
    (accessToken &&
      view === "welcome" &&
      profileStatus !== "success" &&
      profileStatus !== "onboarding-required")
  ) {
    return (
      <FeedbackScreen
        description="사용자 정보를 확인하고 있어요."
        icon={<LoadingFlameIcon />}
        title="잠시만 기다려주세요"
        topClassName="top-[317px]"
      />
    );
  }

  return (
    <main className="min-h-dvh bg-navy-900 text-orange-100">
      <div className="relative mx-auto h-dvh min-h-[700px] w-full max-w-[393px] overflow-hidden bg-navy-900">
        {currentView === "welcome" && (
          <WelcomeScreen
            onGoogleLogin={redirectToGoogleLogin}
            onLogin={() => setView("login")}
            onSignup={() => openSignup("welcome")}
          />
        )}

        {currentView === "intro" && (
          <ServiceIntroScreen
            currentStep={currentStep}
            onNext={handleNext}
            step={SERVICE_INTRO_STEPS[currentStep]}
            totalSteps={SERVICE_INTRO_STEPS.length}
          />
        )}

        {currentView === "login" && (
          <LoginScreen
            onPasswordReset={() => setView("password-reset")}
            onSignup={() => openSignup("login")}
          />
        )}

        {currentView === "password-reset" && (
          <PasswordResetFlow onExit={() => setView("login")} />
        )}

        {currentView === "signup" && (
          <SignupFlow onExit={() => setView(signupReturnView)} />
        )}

        {currentView === "member-onboarding" && (
          <MemberOnboardingFlow onExit={() => setView("welcome")} />
        )}
      </div>
    </main>
  );
}

function subscribeToServiceIntroStorage(): () => void {
  return () => undefined;
}

function getServiceIntroCompletion(): boolean {
  try {
    return (
      window.localStorage.getItem(SERVICE_INTRO_COMPLETED_STORAGE_KEY) ===
      "true"
    );
  } catch {
    return false;
  }
}

function getServerServiceIntroCompletion(): null {
  return null;
}

function markServiceIntroCompleted(): void {
  try {
    window.localStorage.setItem(SERVICE_INTRO_COMPLETED_STORAGE_KEY, "true");
  } catch {
    // The intro can still continue when browser storage is unavailable.
  }
}
