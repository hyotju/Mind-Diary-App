import { isAxiosError } from "axios";

import type {
  CreateDiaryRequest,
  CreateDiaryResponse,
  DiaryCalendarResponse,
  DiaryDetail,
  DiarySummary,
  UpdateDiaryRequest,
  UpdateDiaryResponse,
} from "@/features/diary/types";
import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/api";

export class DiaryApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "DiaryApiError";
    this.code = code;
    this.status = status;
  }
}

export async function getDiaryCalendar(
  year: number,
  month: number,
  signal?: AbortSignal,
): Promise<DiaryCalendarResponse> {
  return getDiaryData<DiaryCalendarResponse>("/api/diaries/calendar", {
    params: { month, year },
    signal,
  });
}

export async function getDiariesByDate(
  date: string,
  signal?: AbortSignal,
): Promise<DiarySummary[]> {
  return getDiaryData<DiarySummary[]>("/api/diaries/by-date", {
    params: { date },
    signal,
  });
}

export async function getDiaryDetail(
  diaryId: number,
  signal?: AbortSignal,
): Promise<DiaryDetail> {
  return getDiaryData<DiaryDetail>(`/api/diaries/${diaryId}`, { signal });
}

export async function createDiary(
  request: CreateDiaryRequest,
): Promise<CreateDiaryResponse> {
  return mutateDiary<CreateDiaryResponse>(() =>
    apiClient.post<ApiResponse<CreateDiaryResponse>>("/api/diaries", request),
  );
}

export async function updateDiary(
  diaryId: number,
  request: UpdateDiaryRequest,
): Promise<UpdateDiaryResponse> {
  return mutateDiary<UpdateDiaryResponse>(() =>
    apiClient.patch<ApiResponse<UpdateDiaryResponse>>(
      `/api/diaries/${diaryId}`,
      request,
    ),
  );
}

export async function deleteDiary(diaryId: number): Promise<void> {
  try {
    await apiClient.delete(`/api/diaries/${diaryId}`);
  } catch (error) {
    throw toDiaryApiError(error, "일기를 삭제하지 못했어요.");
  }
}

type GetDiaryConfig = {
  params?: Record<string, number | string>;
  signal?: AbortSignal;
};

async function getDiaryData<TData>(
  path: string,
  config: GetDiaryConfig,
): Promise<TData> {
  try {
    const response = await apiClient.get<ApiResponse<TData>>(path, config);
    return unwrapDiaryData(response.data);
  } catch (error) {
    throw toDiaryApiError(error, "일기 정보를 불러오지 못했어요.");
  }
}

async function mutateDiary<TData>(
  request: () => Promise<{ data: ApiResponse<TData> }>,
): Promise<TData> {
  try {
    const response = await request();
    return unwrapDiaryData(response.data);
  } catch (error) {
    throw toDiaryApiError(error, "일기를 저장하지 못했어요.");
  }
}

function unwrapDiaryData<TData>(payload: ApiResponse<TData>): TData {
  if (!payload.success || payload.data == null) {
    throw new DiaryApiError(
      payload.message || "요청을 처리하지 못했어요.",
      payload.code,
    );
  }

  return payload.data;
}

function toDiaryApiError(
  error: unknown,
  fallbackMessage: string,
): DiaryApiError {
  if (error instanceof DiaryApiError) {
    return error;
  }

  if (isAxiosError<ApiResponse>(error)) {
    return new DiaryApiError(
      error.response?.data?.message || fallbackMessage,
      error.response?.data?.code,
      error.response?.status,
    );
  }

  return new DiaryApiError(fallbackMessage);
}
