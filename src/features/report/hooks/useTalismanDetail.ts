"use client";

import { useEffect, useState } from "react";

import { getTalisman } from "@/features/report/api/talismans";
import type { TalismanItem } from "@/features/report/types";

export function useTalismanDetail(talismanId: number | null) {
  const [talisman, setTalisman] = useState<TalismanItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRequestPending, setIsRequestPending] = useState(talismanId !== null);

  useEffect(() => {
    if (!talismanId) {
      return;
    }

    const controller = new AbortController();

    void getTalisman(talismanId, controller.signal)
      .then((response) => {
        setTalisman(response);
        setError(null);
        setIsRequestPending(false);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "부적을 불러오지 못했어요.",
          );
          setIsRequestPending(false);
        }
      });

    return () => controller.abort();
  }, [talismanId]);

  return {
    error,
    isLoading: talismanId !== null && isRequestPending,
    talisman,
  };
}
