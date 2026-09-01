"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import FeedbackScreen, {
  ErrorGhostIcon,
  LoadingFlameIcon,
} from "@/components/common/FeedbackScreen";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

export default function OAuthCallbackScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (!accessToken || !refreshToken || hasProcessedRef.current) {
      return;
    }

    hasProcessedRef.current = true;
    window.history.replaceState(window.history.state, "", "/oauth/callback");
    useUserStore.getState().clearProfile();
    useAuthStore.getState().setTokens({ accessToken, refreshToken });
    router.replace("/onboarding");
  }, [accessToken, refreshToken, router]);

  if (!accessToken || !refreshToken) {
    return (
      <FeedbackScreen
        action={
          <button
            className="flex h-[38px] w-[129px] items-center justify-center rounded-[7px] bg-foreground text-[15px] font-medium leading-6 text-white"
            onClick={() => router.replace("/onboarding")}
            type="button"
          >
            시작 화면으로
          </button>
        }
        description="다시 Google 로그인을 진행해 주세요."
        icon={<ErrorGhostIcon />}
        title="Google 로그인 인증 정보를 확인하지 못했어요."
        topClassName="top-[293px]"
      />
    );
  }

  return (
    <FeedbackScreen
      description="사용자 정보를 확인하고 있어요."
      icon={<LoadingFlameIcon />}
      title="Google 로그인 중"
      topClassName="top-[317px]"
    />
  );
}
