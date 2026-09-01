import { isAxiosError } from "axios";

import type {
  CreateSajuAnalysisResponse,
  SajuAnalysis,
} from "@/features/user/types";
import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/api";

const SAJU_ANALYSES_PATH = "/api/saju/analyses";

export class SajuAnalysisApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "SajuAnalysisApiError";
    this.code = code;
    this.status = status;
  }
}

export async function createSajuAnalysis(): Promise<CreateSajuAnalysisResponse> {
  try {
    const response =
      await apiClient.post<ApiResponse<CreateSajuAnalysisResponse>>(
        SAJU_ANALYSES_PATH,
      );
    const payload = response.data;

    if (!payload.success || !payload.data) {
      throw new SajuAnalysisApiError(
        payload.message || "사주 분석을 시작하지 못했어요.",
        payload.code,
      );
    }

    return payload.data;
  } catch (error) {
    if (error instanceof SajuAnalysisApiError) {
      throw error;
    }

    if (isAxiosError<ApiResponse>(error)) {
      throw new SajuAnalysisApiError(
        error.response?.data?.message || "사주 분석을 시작하지 못했어요.",
        error.response?.data?.code,
        error.response?.status,
      );
    }

    throw new SajuAnalysisApiError("사주 분석을 시작하지 못했어요.");
  }
}

export async function getLatestSajuAnalysis(
  signal?: AbortSignal,
): Promise<SajuAnalysis> {
  return getSajuAnalysis(`${SAJU_ANALYSES_PATH}/latest`, signal);
}

export async function getSajuAnalysisById(
  analysisId: number,
  signal?: AbortSignal,
): Promise<SajuAnalysis> {
  return getSajuAnalysis(`${SAJU_ANALYSES_PATH}/${analysisId}`, signal);
}

async function getSajuAnalysis(
  path: string,
  signal?: AbortSignal,
): Promise<SajuAnalysis> {
  try {
    const response = await apiClient.get<ApiResponse<SajuAnalysis>>(path, {
      signal,
    });
    const payload = response.data;

    if (!payload.success || !payload.data) {
      throw new SajuAnalysisApiError(
        payload.message || "사주 분석 결과를 불러오지 못했어요.",
        payload.code,
      );
    }

    return payload.data;
  } catch (error) {
    if (error instanceof SajuAnalysisApiError) {
      throw error;
    }

    if (isAxiosError<ApiResponse>(error)) {
      throw new SajuAnalysisApiError(
        error.response?.data?.message || "사주 분석 결과를 불러오지 못했어요.",
        error.response?.data?.code,
        error.response?.status,
      );
    }

    throw new SajuAnalysisApiError("사주 분석 결과를 불러오지 못했어요.");
  }
}
