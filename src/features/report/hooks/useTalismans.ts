"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { PENDING_REPORT_TALISMAN_ID_STORAGE_KEY } from "@/features/burn/utils";
import {
  getMyTalismans,
  getTalisman,
} from "@/features/report/api/talismans";
import type { TalismanItem, TalismanList } from "@/features/report/types";

const TALISMAN_LIST_POLL_INTERVAL_MS = 700;
const TALISMAN_LIST_POLL_LIMIT = 3;

type TalismansState = {
  error: string | null;
  hasNext: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  items: TalismanItem[];
  nextCursor: number | null;
};

export function useTalismans(size = 3) {
  const pathname = usePathname();
  const [state, setState] = useState<TalismansState>({
    error: null,
    hasNext: false,
    isLoading: true,
    isLoadingMore: false,
    items: [],
    nextCursor: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    void getTalismansWithPendingSync(size, controller.signal)
      .then((response) => {
        setState({
          error: null,
          hasNext: response.hasNext,
          isLoading: false,
          isLoadingMore: false,
          items: response.items,
          nextCursor: response.nextCursor,
        });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState((current) => ({
            ...current,
            error: getErrorMessage(error),
            isLoading: false,
          }));
        }
      });

    return () => controller.abort();
  }, [pathname, size]);

  const loadMore = useCallback(async () => {
    const { hasNext, isLoadingMore, nextCursor } = state;

    if (!hasNext || isLoadingMore || nextCursor == null) {
      return;
    }

    setState((current) => ({ ...current, isLoadingMore: true }));

    try {
      const response = await getMyTalismans({ cursor: nextCursor, size });
      setState((current) => ({
        ...current,
        error: null,
        hasNext: response.hasNext,
        isLoadingMore: false,
        items: mergeTalismanItems(current.items, response.items),
        nextCursor: response.nextCursor,
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        error: getErrorMessage(error),
        isLoadingMore: false,
      }));
    }
  }, [size, state]);

  return { ...state, loadMore };
}

async function getTalismansWithPendingSync(
  size: number,
  signal: AbortSignal,
): Promise<TalismanList> {
  const pendingTalismanId = getPendingTalismanId();
  let response = await getMyTalismans({ size }, signal);

  if (!pendingTalismanId) {
    return response;
  }

  for (let attempt = 0; attempt < TALISMAN_LIST_POLL_LIMIT; attempt += 1) {
    const hasPendingTalisman = response.items.some(
      (talisman) => talisman.talismanId === pendingTalismanId,
    );

    if (hasPendingTalisman) {
      sessionStorage.removeItem(PENDING_REPORT_TALISMAN_ID_STORAGE_KEY);
      return response;
    }

    await waitForNextListPoll(signal);
    response = await getMyTalismans({ size }, signal);
  }

  try {
    const pendingTalisman = await getTalisman(pendingTalismanId, signal);

    if (pendingTalisman.generationStatus === "COMPLETED") {
      const items = mergeTalismanItems([pendingTalisman], response.items);

      return {
        ...response,
        count: items.length,
        items,
      };
    }
  } catch (error) {
    if (signal.aborted) {
      throw error;
    }

    // The list response remains usable when the recently generated detail is unavailable.
  }

  return response;
}

function mergeTalismanItems(
  currentItems: TalismanItem[],
  nextItems: TalismanItem[],
): TalismanItem[] {
  const itemsById = new Map<number, TalismanItem>();

  for (const item of [...currentItems, ...nextItems]) {
    itemsById.set(item.talismanId, item);
  }

  return Array.from(itemsById.values());
}

function getPendingTalismanId(): number | null {
  const value = Number(
    sessionStorage.getItem(PENDING_REPORT_TALISMAN_ID_STORAGE_KEY),
  );

  return Number.isInteger(value) && value > 0 ? value : null;
}

function waitForNextListPoll(signal: AbortSignal): Promise<void> {
  if (signal.aborted) {
    return Promise.reject(new DOMException("요청이 취소되었습니다.", "AbortError"));
  }

  return new Promise((resolve, reject) => {
    const handleAbort = () => {
      window.clearTimeout(timeoutId);
      reject(new DOMException("요청이 취소되었습니다.", "AbortError"));
    };
    const timeoutId = window.setTimeout(() => {
      signal.removeEventListener("abort", handleAbort);
      resolve();
    }, TALISMAN_LIST_POLL_INTERVAL_MS);

    signal.addEventListener("abort", handleAbort, { once: true });
  });
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "부적을 불러오지 못했어요.";
}
