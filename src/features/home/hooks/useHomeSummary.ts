"use client";

import { useEffect, useState } from "react";

import { getDailyFortune } from "@/features/home/api/getDailyFortune";
import type { HomeSummary } from "@/features/home/types";

type HomeSummaryState = {
  error: string | null;
  isLoading: boolean;
  summary: HomeSummary | null;
};

export function useHomeSummary(): HomeSummaryState {
  const [state, setState] = useState<HomeSummaryState>({
    error: null,
    isLoading: true,
    summary: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    void getDailyFortune(controller.signal)
      .then((summary) => {
        setState({ error: null, isLoading: false, summary });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          error:
            error instanceof Error
              ? error.message
              : "오늘의 운세를 불러오지 못했어요.",
          isLoading: false,
          summary: null,
        });
      });

    return () => controller.abort();
  }, []);

  return state;
}
