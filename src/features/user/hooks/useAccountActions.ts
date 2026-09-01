"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { logout, withdrawMember } from "@/features/user/api/account";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

export type AccountDialogType = "logout" | "withdraw";

export function useAccountActions() {
  const router = useRouter();
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const clearProfile = useUserStore((state) => state.clearProfile);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const [activeDialog, setActiveDialog] = useState<AccountDialogType | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeDialog = (): void => {
    if (!isSubmitting) {
      setActiveDialog(null);
    }
  };

  const confirmLogout = async (): Promise<void> => {
    setIsSubmitting(true);

    try {
      if (refreshToken) {
        await logout({ refreshToken });
      }
    } catch {
      // Local logout must still complete when server-side token revocation fails.
    } finally {
      clearTokens();
      clearProfile();
      setActiveDialog(null);
      setIsSubmitting(false);
      router.replace("/onboarding");
      router.refresh();
    }
  };

  const confirmWithdrawal = async (): Promise<void> => {
    setIsSubmitting(true);

    try {
      await withdrawMember();
      clearTokens();
      clearProfile();
      setActiveDialog(null);
      router.replace("/onboarding");
      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "회원탈퇴에 실패했어요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activeDialog,
    closeDialog,
    confirmLogout,
    confirmWithdrawal,
    isSubmitting,
    openDialog: setActiveDialog,
  };
}
