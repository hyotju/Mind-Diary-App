"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import FeedbackScreen, {
  ErrorGhostIcon,
  LoadingFlameIcon,
} from "@/components/common/FeedbackScreen";
import {
  getMyProfile,
  isOnboardingRequiredError,
} from "@/features/user/api/profile";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

type AuthGuardProps = {
  children: ReactNode;
};

const PUBLIC_PATHS = ["/onboarding", "/oauth/callback"];

export default function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const clearProfile = useUserStore((state) => state.clearProfile);
  const profile = useUserStore((state) => state.profile);
  const profileStatus = useUserStore((state) => state.profileStatus);
  const setProfile = useUserStore((state) => state.setProfile);
  const setProfileStatus = useUserStore((state) => state.setProfileStatus);
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!accessToken) {
      if (profileStatus !== "idle") {
        clearProfile();
      }
      return;
    }

    if (profileStatus !== "idle") {
      return;
    }

    setProfileStatus("loading");

    void getMyProfile()
      .then((memberProfile) => {
        if (useAuthStore.getState().accessToken) {
          setProfile(memberProfile);
        }
      })
      .catch((error: unknown) => {
        if (useAuthStore.getState().accessToken) {
          setProfileStatus(
            isOnboardingRequiredError(error)
              ? "onboarding-required"
              : "error",
          );
        }
      });
  }, [
    accessToken,
    clearProfile,
    hasHydrated,
    profileStatus,
    setProfile,
    setProfileStatus,
  ]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!accessToken && !isPublicPath) {
      router.replace("/onboarding");
      return;
    }

    if (!accessToken || profileStatus !== "success" || !profile) {
      if (accessToken && profileStatus === "onboarding-required") {
        router.replace("/onboarding");
      }

      return;
    }

    if (!profile.onboardingCompleted && !isPublicPath) {
      router.replace("/onboarding");
      return;
    }

    if (
      profile.onboardingCompleted &&
      (pathname === "/onboarding" || pathname.startsWith("/onboarding/"))
    ) {
      router.replace("/");
    }
  }, [
    accessToken,
    hasHydrated,
    isPublicPath,
    pathname,
    profile,
    profileStatus,
    router,
  ]);

  if (!hasHydrated) {
    return <AuthLoadingScreen />;
  }

  if (accessToken && profileStatus === "error") {
    return (
      <FeedbackScreen
        action={
          <button
            className="flex h-[38px] w-[129px] items-center justify-center rounded-[7px] bg-foreground text-[15px] font-medium leading-6 text-white"
            onClick={() => setProfileStatus("idle")}
            type="button"
          >
            다시 시도
          </button>
        }
        description="사용자 정보를 다시 불러와 주세요."
        icon={<ErrorGhostIcon />}
        title="정보를 불러오지 못했어요"
        topClassName="top-[293px]"
      />
    );
  }

  if (isPublicPath) {
    if (profile?.onboardingCompleted) {
      return <AuthLoadingScreen />;
    }

    return children;
  }

  if (
    !accessToken ||
    profileStatus === "idle" ||
    profileStatus === "loading" ||
    profileStatus === "onboarding-required"
  ) {
    return <AuthLoadingScreen />;
  }

  if (!profile?.onboardingCompleted) {
    return <AuthLoadingScreen />;
  }

  return children;
}

function AuthLoadingScreen() {
  return (
    <FeedbackScreen
      description="사용자 정보를 확인하고 있어요."
      icon={<LoadingFlameIcon />}
      title="잠시만 기다려주세요"
      topClassName="top-[317px]"
    />
  );
}
