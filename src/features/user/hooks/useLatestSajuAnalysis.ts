"use client";

import { useEffect, useState } from "react";

import {
  getLatestSajuAnalysis,
  getSajuAnalysisById,
} from "@/features/user/api/sajuAnalyses";
import type { SajuAnalysis } from "@/features/user/types";

const ANALYSIS_POLL_INTERVAL_MS = 2000;

type SajuAnalysisState = {
  analysis: SajuAnalysis | null;
  error: string | null;
  isLoading: boolean;
};

export function useLatestSajuAnalysis(): SajuAnalysisState {
  const [state, setState] = useState<SajuAnalysisState>({
    analysis: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadAnalysis = async () => {
      try {
        let analysis = await getLatestSajuAnalysis(controller.signal);
        setState({ analysis, error: null, isLoading: false });

        while (
          !controller.signal.aborted &&
          (analysis.status === "PENDING" || analysis.status === "PROCESSING")
        ) {
          await waitForNextPoll(controller.signal);

          if (controller.signal.aborted) {
            return;
          }

          analysis = await getSajuAnalysisById(
            analysis.analysisId,
            controller.signal,
          );
          setState({ analysis, error: null, isLoading: false });
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          error:
            error instanceof Error
              ? error.message
              : "사주 분석 결과를 불러오지 못했어요.",
          isLoading: false,
        }));
      }
    };

    void loadAnalysis();
    return () => controller.abort();
  }, []);

  return state;
}

function waitForNextPoll(signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(resolve, ANALYSIS_POLL_INTERVAL_MS);

    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}
