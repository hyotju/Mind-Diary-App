import { isAxiosError } from "axios";

import type {
  CreateBurningRequest,
  CreateBurningResponse,
  BurningDetailResponse,
  BurningListResponse,
  TalismanCreationResponse,
} from "@/features/burn/types";
import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/api";

export class BurningApiError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "BurningApiError";
    this.code = code;
  }
}

export async function createBurning(
  request: CreateBurningRequest,
): Promise<CreateBurningResponse> {
  try {
    const response = await apiClient.post<ApiResponse<CreateBurningResponse>>(
      "/api/burnings",
      request,
    );
    const payload = response.data;

    if (!payload.success || !payload.data) {
      throw new BurningApiError(
        payload.message || "소각을 시작하지 못했어요.",
        payload.code,
      );
    }

    return payload.data;
  } catch (error) {
    if (error instanceof BurningApiError) {
      throw error;
    }

    if (isAxiosError<ApiResponse>(error)) {
      throw new BurningApiError(
        error.response?.data?.message || "소각을 시작하지 못했어요.",
        error.response?.data?.code,
      );
    }

    throw new BurningApiError("소각을 시작하지 못했어요.");
  }
}

export async function getBurningDetail(
  burningId: number,
): Promise<BurningDetailResponse> {
  return requestBurning<BurningDetailResponse>(
    "get",
    `/api/burnings/${burningId}`,
    "소각 정보를 불러오지 못했어요.",
  );
}

export async function getBurnings(
  options: { cursor?: number; size?: number } = {},
): Promise<BurningListResponse> {
  try {
    const response = await apiClient.get<ApiResponse<BurningListResponse>>(
      "/api/burnings",
      { params: options },
    );
    const payload = response.data;

    if (!payload.success || !payload.data) {
      throw new BurningApiError(
        payload.message || "소각 기록을 불러오지 못했어요.",
        payload.code,
      );
    }

    return payload.data;
  } catch (error) {
    if (error instanceof BurningApiError) {
      throw error;
    }

    if (isAxiosError<ApiResponse>(error)) {
      throw new BurningApiError(
        error.response?.data?.message || "소각 기록을 불러오지 못했어요.",
        error.response?.data?.code,
      );
    }

    throw new BurningApiError("소각 기록을 불러오지 못했어요.");
  }
}

export async function createTalisman(
  burningId: number,
): Promise<TalismanCreationResponse> {
  return requestBurning<TalismanCreationResponse>(
    "post",
    `/api/burnings/${burningId}/talisman`,
    "부적을 생성하지 못했어요.",
  );
}

async function requestBurning<T>(
  method: "get" | "post",
  url: string,
  fallbackMessage: string,
): Promise<T> {
  try {
    const response = await apiClient.request<ApiResponse<T>>({ method, url });
    const payload = response.data;

    if (!payload.success || !payload.data) {
      throw new BurningApiError(
        payload.message || fallbackMessage,
        payload.code,
      );
    }

    return payload.data;
  } catch (error) {
    if (error instanceof BurningApiError) {
      throw error;
    }

    if (isAxiosError<ApiResponse>(error)) {
      throw new BurningApiError(
        error.response?.data?.message || fallbackMessage,
        error.response?.data?.code,
      );
    }

    throw new BurningApiError(fallbackMessage);
  }
}
