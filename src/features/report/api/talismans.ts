import { isAxiosError } from "axios";

import type { TalismanItem, TalismanList } from "@/features/report/types";
import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/api";

const TALISMANS_PATH = "/api/talismans";

export class TalismanApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "TalismanApiError";
    this.code = code;
    this.status = status;
  }
}

export async function getMyTalismans(
  options: { cursor?: number; size?: number } = {},
  signal?: AbortSignal,
): Promise<TalismanList> {
  return getTalismanData<TalismanList>(TALISMANS_PATH, signal, options);
}

export async function getTalisman(
  talismanId: number,
  signal?: AbortSignal,
): Promise<TalismanItem> {
  return getTalismanData<TalismanItem>(
    `${TALISMANS_PATH}/${talismanId}`,
    signal,
  );
}

async function getTalismanData<TData>(
  path: string,
  signal?: AbortSignal,
  params?: { cursor?: number; size?: number },
): Promise<TData> {
  try {
    const response = await apiClient.get<ApiResponse<TData>>(path, {
      params,
      signal,
    });
    const payload = response.data;

    if (!payload.success || payload.data == null) {
      throw new TalismanApiError(
        payload.message || "부적을 불러오지 못했어요.",
        payload.code,
      );
    }

    return payload.data;
  } catch (error) {
    if (error instanceof TalismanApiError) {
      throw error;
    }

    if (isAxiosError<ApiResponse>(error)) {
      throw new TalismanApiError(
        error.response?.data?.message || "부적을 불러오지 못했어요.",
        error.response?.data?.code,
        error.response?.status,
      );
    }

    throw new TalismanApiError("부적을 불러오지 못했어요.");
  }
}
