"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthTokens } from "@/features/auth/types";

type AuthStore = {
  accessToken: string | null;
  clearTokens: () => void;
  hasHydrated: boolean;
  refreshToken: string | null;
  setHasHydrated: (hasHydrated: boolean) => void;
  setTokens: (tokens: AuthTokens) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      clearTokens: () => {
        set({
          accessToken: null,
          refreshToken: null,
        });
      },
      hasHydrated: false,
      refreshToken: null,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setTokens: ({ accessToken, refreshToken }) => {
        set({
          accessToken,
          refreshToken,
        });
      },
    }),
    {
      name: "maeum-bujeok:auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: ({ accessToken, refreshToken }) => ({
        accessToken,
        refreshToken,
      }),
      version: 1,
    },
  ),
);
