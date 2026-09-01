"use client";

import { useCallback, useEffect, useState } from "react";

import { getBurningDetail, getBurnings } from "@/features/burn/api/burnings";
import type {
  BurningDetailResponse,
  BurningListItem,
} from "@/features/burn/types";

export type BurningHistoryItem = BurningListItem & {
  title: string;
};

type BurningHistoryState = {
  error: string | null;
  hasNext: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  items: BurningHistoryItem[];
  nextCursor: number | null;
};

const PAGE_SIZE = 20;

export function useBurningHistory(): BurningHistoryState & {
  loadMore: () => Promise<void>;
} {
  const [state, setState] = useState<BurningHistoryState>({
    error: null,
    hasNext: false,
    isLoading: true,
    isLoadingMore: false,
    items: [],
    nextCursor: null,
  });

  useEffect(() => {
    let isActive = true;

    void loadHistoryPage()
      .then((page) => {
        if (!isActive) return;
        setState({
          error: null,
          hasNext: page.hasNext,
          isLoading: false,
          isLoadingMore: false,
          items: page.items,
          nextCursor: page.nextCursor,
        });
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        setState((current) => ({
          ...current,
          error: getErrorMessage(error),
          isLoading: false,
        }));
      });

    return () => {
      isActive = false;
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (!state.hasNext || state.isLoadingMore || state.nextCursor === null) {
      return;
    }

    setState((current) => ({ ...current, isLoadingMore: true }));

    try {
      const page = await loadHistoryPage(state.nextCursor);
      setState((current) => ({
        ...current,
        error: null,
        hasNext: page.hasNext,
        isLoadingMore: false,
        items: [...current.items, ...page.items],
        nextCursor: page.nextCursor,
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        error: getErrorMessage(error),
        isLoadingMore: false,
      }));
    }
  }, [state.hasNext, state.isLoadingMore, state.nextCursor]);

  return { ...state, loadMore };
}

async function loadHistoryPage(cursor?: number) {
  const response = await getBurnings({ cursor, size: PAGE_SIZE });
  const details = await Promise.allSettled(
    response.items.map((item) => getBurningDetail(item.burningId)),
  );

  return {
    ...response,
    items: response.items.map((item, index) => ({
      ...item,
      title:
        details[index]?.status === "fulfilled"
          ? details[index].value.title?.trim() || "제목 없는 소각 기록"
          : "제목 없는 소각 기록",
    })),
  };
}

export function useBurningDetail(burningId: number | null) {
  const [detail, setDetail] = useState<BurningDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(burningId !== null);

  useEffect(() => {
    if (!burningId) return;
    let isActive = true;

    void getBurningDetail(burningId)
      .then((response) => {
        if (!isActive) return;
        setDetail(response);
        setError(null);
        setIsLoading(false);
      })
      .catch((requestError: unknown) => {
        if (!isActive) return;
        setError(getErrorMessage(requestError));
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [burningId]);

  return { detail, error, isLoading };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "소각 기록을 불러오지 못했어요.";
}
