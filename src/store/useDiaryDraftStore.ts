"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EmotionId } from "@/features/diary/constants";

export type DiaryDraft = {
  content: string;
  emotionId: EmotionId;
  savedAt: string;
};

type DiaryDraftStore = {
  drafts: Record<string, DiaryDraft>;
  removeDraft: (date: string) => void;
  saveDraft: (date: string, draft: Omit<DiaryDraft, "savedAt">) => void;
};

export const useDiaryDraftStore = create<DiaryDraftStore>()(
  persist(
    (set) => ({
      drafts: {},
      removeDraft: (date) => {
        set((state) => {
          const nextDrafts = { ...state.drafts };
          delete nextDrafts[date];
          return { drafts: nextDrafts };
        });
      },
      saveDraft: (date, draft) => {
        set((state) => ({
          drafts: {
            ...state.drafts,
            [date]: { ...draft, savedAt: new Date().toISOString() },
          },
        }));
      },
    }),
    {
      name: "maeum-bujeok:diary-drafts",
      version: 1,
    },
  ),
);
