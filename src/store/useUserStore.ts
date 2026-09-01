"use client";

import { create } from "zustand";

import type { MemberProfile } from "@/features/user/types";

export type ProfileStatus =
  | "error"
  | "idle"
  | "loading"
  | "onboarding-required"
  | "success";

type UserStore = {
  clearProfile: () => void;
  profile: MemberProfile | null;
  profileStatus: ProfileStatus;
  setProfile: (profile: MemberProfile) => void;
  setProfileStatus: (status: ProfileStatus) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  clearProfile: () => set({ profile: null, profileStatus: "idle" }),
  profile: null,
  profileStatus: "idle",
  setProfile: (profile) => set({ profile, profileStatus: "success" }),
  setProfileStatus: (profileStatus) => set({ profileStatus }),
}));
