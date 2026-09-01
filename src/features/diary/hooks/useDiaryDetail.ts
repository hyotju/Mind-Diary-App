"use client";

import { useCallback, useEffect, useState } from "react";

import { getDiaryDetail } from "@/features/diary/api/diaries";
import type { DiaryDetail } from "@/features/diary/types";

const ANALYSIS_POLL_INTERVAL_MS = 2000;

type DiaryDetailState = {
  diary: DiaryDetail | null;
  error: string | null;
  requestKey: string;
};

export function useDiaryDetail(
  diaryId: number | null,
  options: { pollAnalysis?: boolean } = {},
) {
  const [reloadKey, setReloadKey] = useState(0);
  const requestKey = diaryId ? `${diaryId}:${reloadKey}` : null;
  const [state, setState] = useState<DiaryDetailState>({
    diary: null,
    error: null,
    requestKey: "",
  });

  useEffect(() => {
    if (!diaryId || !requestKey) {
      return;
    }

    const controller = new AbortController();

    void getDiaryDetail(diaryId, controller.signal)
      .then((diary) => {
        setState({ diary, error: null, requestKey });
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            diary: null,
            error: getErrorMessage(requestError),
            requestKey,
          });
        }
      });

    return () => controller.abort();
  }, [diaryId, requestKey]);

  const isCurrentDiary = Boolean(
    diaryId && state.requestKey.startsWith(`${diaryId}:`),
  );
  const diary = isCurrentDiary ? state.diary : null;
  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    if (options.pollAnalysis === false) {
      return;
    }

    const status = diary?.analysis?.status;

    if (status !== "PENDING" && status !== "PROCESSING") {
      return;
    }

    const timer = window.setTimeout(refetch, ANALYSIS_POLL_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [diary?.analysis?.status, options.pollAnalysis, refetch, reloadKey]);

  return {
    diary,
    error: isCurrentDiary ? state.error : null,
    isLoading: requestKey !== null && !isCurrentDiary,
    refetch,
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "일기를 불러오지 못했어요.";
}
