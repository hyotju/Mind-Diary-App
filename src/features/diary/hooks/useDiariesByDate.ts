"use client";

import { useCallback, useEffect, useState } from "react";

import { getDiariesByDate } from "@/features/diary/api/diaries";
import type { DiarySummary } from "@/features/diary/types";

type DiariesByDateState = {
  diaries: DiarySummary[];
  error: string | null;
  requestKey: string;
};

export function useDiariesByDate(date: string | null) {
  const [reloadKey, setReloadKey] = useState(0);
  const requestKey = date ? `${date}:${reloadKey}` : null;
  const [state, setState] = useState<DiariesByDateState>({
    diaries: [],
    error: null,
    requestKey: "",
  });

  useEffect(() => {
    if (!date || !requestKey) {
      return;
    }

    const controller = new AbortController();

    void getDiariesByDate(date, controller.signal)
      .then((diaries) => {
        setState({ diaries, error: null, requestKey });
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            diaries: [],
            error: getErrorMessage(requestError),
            requestKey,
          });
        }
      });

    return () => controller.abort();
  }, [date, requestKey]);

  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);
  const isCurrentRequest =
    requestKey !== null && state.requestKey === requestKey;

  return {
    diaries: isCurrentRequest ? state.diaries : [],
    error: isCurrentRequest ? state.error : null,
    isLoading: requestKey !== null && !isCurrentRequest,
    refetch,
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "해당 날짜의 일기를 불러오지 못했어요.";
}
