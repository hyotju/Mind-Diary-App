import { isAxiosError } from "axios";

import type {
  EmotionStat,
  GenerateWeeklyReportResponse,
  NextWeekFlow,
  NextWeekFlowStart,
  ReportBurning,
  WeeklyReportPeriod,
  WeeklyReportSummary,
} from "@/features/report/types";
import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/api";

const REPORTS_PATH = "/api/reports";

export class ReportApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "ReportApiError";
    this.code = code;
    this.status = status;
  }
}

export async function getWeeklyReportPeriods(
  signal?: AbortSignal,
): Promise<WeeklyReportPeriod[]> {
  return getReportData<WeeklyReportPeriod[]>(`${REPORTS_PATH}/weeks`, signal);
}

export async function generateWeeklyReport(
  weekStart: string,
): Promise<GenerateWeeklyReportResponse> {
  return postReportData<GenerateWeeklyReportResponse>(
    `${REPORTS_PATH}/weekly/generate`,
    { weekStart },
  );
}

export async function getWeeklyReport(
  startDate: string,
  signal?: AbortSignal,
): Promise<WeeklyReportSummary> {
  return getReportData<WeeklyReportSummary>(`${REPORTS_PATH}/weekly`, signal, {
    startDate,
  });
}

export async function getWeeklyReportSummary(
  summaryId: number,
  signal?: AbortSignal,
): Promise<WeeklyReportSummary> {
  return getReportData<WeeklyReportSummary>(
    `${REPORTS_PATH}/weekly-summary/${summaryId}`,
    signal,
  );
}

export async function getReportEmotionStats(
  reportId: number,
  signal?: AbortSignal,
): Promise<EmotionStat[]> {
  const data = await getReportData<unknown>(
    `${REPORTS_PATH}/weekly/${reportId}/emotion-stats`,
    signal,
  );

  const stats = getArrayField(data, ["emotionStats", "items", "stats"]);

  if (!stats || !stats.every(isEmotionStat)) {
    throw new ReportApiError("감정 통계 응답 형식이 올바르지 않아요.");
  }

  return stats;
}

export async function getReportBurnings(
  reportId: number,
  signal?: AbortSignal,
): Promise<ReportBurning[]> {
  const data = await getReportData<unknown>(
    `${REPORTS_PATH}/weekly/${reportId}/burnings`,
    signal,
  );

  const burnings = getArrayField(data, ["burnings", "items"]);

  if (burnings && burnings.every(isReportBurning)) {
    return burnings;
  }

  throw new ReportApiError("소각 기록 응답 형식이 올바르지 않아요.");
}

export async function getReportNextWeekFlow(
  reportId: number,
  signal?: AbortSignal,
): Promise<NextWeekFlow | null> {
  try {
    return await getReportData<NextWeekFlow>(
      `${REPORTS_PATH}/weekly/${reportId}/next-week-flow`,
      signal,
    );
  } catch (error) {
    if (error instanceof ReportApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function generateNextWeekFlow(
  weekStart: string,
): Promise<NextWeekFlowStart> {
  return postReportData<NextWeekFlowStart>(`${REPORTS_PATH}/next-week-flow`, {
    weekStart,
  });
}

export async function getNextWeekFlow(
  flowId: number,
  signal?: AbortSignal,
): Promise<NextWeekFlow> {
  return getReportData<NextWeekFlow>(
    `${REPORTS_PATH}/next-week-flow/${flowId}`,
    signal,
  );
}

type QueryParams = Record<string, number | string>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getArrayField(value: unknown, fieldNames: string[]): unknown[] | null {
  if (Array.isArray(value)) {
    return value;
  }

  if (!isRecord(value)) {
    return null;
  }

  for (const fieldName of fieldNames) {
    const field = value[fieldName];

    if (Array.isArray(field)) {
      return field;
    }
  }

  return null;
}

function isEmotionStat(value: unknown): value is EmotionStat {
  return (
    isRecord(value) &&
    typeof value.emotion === "string" &&
    typeof value.count === "number"
  );
}

function isReportBurning(value: unknown): value is ReportBurning {
  return (
    isRecord(value) &&
    typeof value.burningId === "number" &&
    typeof value.burnedAt === "string"
  );
}

async function getReportData<TData>(
  path: string,
  signal?: AbortSignal,
  params?: QueryParams,
): Promise<TData> {
  try {
    const response = await apiClient.get<ApiResponse<TData>>(path, {
      params,
      signal,
    });
    const payload = response.data;

    if (!payload.success || payload.data == null) {
      throw new ReportApiError(
        payload.message || "리포트를 불러오지 못했어요.",
        payload.code,
      );
    }

    return payload.data;
  } catch (error) {
    if (error instanceof ReportApiError) {
      throw error;
    }

    if (isAxiosError<ApiResponse>(error)) {
      throw new ReportApiError(
        error.response?.data?.message || "리포트를 불러오지 못했어요.",
        error.response?.data?.code,
        error.response?.status,
      );
    }

    throw new ReportApiError("리포트를 불러오지 못했어요.");
  }
}

async function postReportData<TData>(
  path: string,
  request: Record<string, string>,
): Promise<TData> {
  try {
    const response = await apiClient.post<ApiResponse<TData>>(path, request);
    const payload = response.data;

    if (!payload.success || payload.data == null) {
      throw new ReportApiError(
        payload.message || "리포트를 생성하지 못했어요.",
        payload.code,
      );
    }

    return payload.data;
  } catch (error) {
    if (error instanceof ReportApiError) {
      throw error;
    }

    if (isAxiosError<ApiResponse>(error)) {
      throw new ReportApiError(
        error.response?.data?.message || "리포트를 생성하지 못했어요.",
        error.response?.data?.code,
        error.response?.status,
      );
    }

    throw new ReportApiError("리포트를 생성하지 못했어요.");
  }
}
