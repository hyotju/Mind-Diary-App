"use client";

import { create } from "zustand";

type ProfileEditStore = {
  clearVerifiedPhoneNumber: () => void;
  setVerifiedPhoneNumber: (phoneNumber: string) => void;
  verifiedPhoneNumber: string | null;
};

export const useProfileEditStore = create<ProfileEditStore>((set) => ({
  clearVerifiedPhoneNumber: () => set({ verifiedPhoneNumber: null }),
  setVerifiedPhoneNumber: (verifiedPhoneNumber) =>
    set({ verifiedPhoneNumber }),
  verifiedPhoneNumber: null,
}));
