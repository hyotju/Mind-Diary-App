import { isAxiosError } from "axios";

import type { HomeSummary } from "@/features/home/types";
import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/api";

const HOME_SUMMARY_PATH = "/api/home/summary";

export class HomeSummaryApiError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "HomeSummaryApiError";
    this.code = code;
  }
}

export async function getDailyFortune(
  signal?: AbortSignal,
): Promise<HomeSummary> {
  try {
    const response = await apiClient.get<ApiResponse<HomeSummary>>(
      HOME_SUMMARY_PATH,
      { signal },
    );
    const payload = response.data;

    if (!payload.success || !payload.data) {
      throw new HomeSummaryApiError(
        payload.message || "오늘의 운세를 불러오지 못했어요.",
        payload.code,
      );
    }

    return payload.data;
  } catch (error) {
    if (error instanceof HomeSummaryApiError) {
      throw error;
    }

    if (isAxiosError<ApiResponse>(error)) {
      throw new HomeSummaryApiError(
        error.response?.data?.message || "오늘의 운세를 불러오지 못했어요.",
        error.response?.data?.code,
      );
    }

    throw new HomeSummaryApiError("오늘의 운세를 불러오지 못했어요.");
  }
}
