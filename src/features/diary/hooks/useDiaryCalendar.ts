"use client";

import { useCallback, useEffect, useState } from "react";

import { getDiaryCalendar } from "@/features/diary/api/diaries";
import type { DiaryCalendarDay } from "@/features/diary/types";

type CalendarState = {
  days: DiaryCalendarDay[];
  error: string | null;
  requestKey: string;
};

export function useDiaryCalendar(month: string) {
  const [reloadKey, setReloadKey] = useState(0);
  const requestKey = `${month}:${reloadKey}`;
  const [state, setState] = useState<CalendarState>({
    days: [],
    error: null,
    requestKey: "",
  });

  useEffect(() => {
    const controller = new AbortController();
    const [year, monthNumber] = month.split("-").map(Number);

    void getDiaryCalendar(year, monthNumber, controller.signal)
      .then((response) => {
        setState({ days: response.days, error: null, requestKey });
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            days: [],
            error: getErrorMessage(requestError),
            requestKey,
          });
        }
      });

    return () => controller.abort();
  }, [month, requestKey]);

  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);
  const isCurrentRequest = state.requestKey === requestKey;

  return {
    days: isCurrentRequest ? state.days : [],
    error: isCurrentRequest ? state.error : null,
    isLoading: !isCurrentRequest,
    refetch,
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "일기 달력을 불러오지 못했어요.";
}
