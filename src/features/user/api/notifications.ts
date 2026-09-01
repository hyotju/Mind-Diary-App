import { isAxiosError } from "axios";

import type {
  NotificationDays,
  NotificationSettings,
} from "@/features/user/types";
import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/api";

const NOTIFICATION_SETTINGS_PATH = "/api/mypage/notifications";
const NOTIFICATION_DAYS_PATH = "/api/mypage/notifications/days";

export class NotificationApiError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "NotificationApiError";
    this.code = code;
  }
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  return getNotificationData(
    NOTIFICATION_SETTINGS_PATH,
    isNotificationSettings,
  );
}

export async function getNotificationDays(): Promise<NotificationDays> {
  return getNotificationData(NOTIFICATION_DAYS_PATH, isNotificationDays);
}

export async function updateNotificationSettings(
  request: NotificationSettings,
): Promise<void> {
  await patchNotificationSettings(NOTIFICATION_SETTINGS_PATH, request);
}

export async function updateNotificationDays(
  request: NotificationDays,
): Promise<void> {
  await patchNotificationSettings(NOTIFICATION_DAYS_PATH, request);
}

async function patchNotificationSettings<T extends object>(
  path: string,
  request: T,
): Promise<void> {
  try {
    const response = await apiClient.patch<ApiResponse>(path, request);

    if (!response.data.success) {
      throw new NotificationApiError(
        response.data.message || "알림 설정을 변경하지 못했어요.",
        response.data.code,
      );
    }
  } catch (error) {
    if (error instanceof NotificationApiError) {
      throw error;
    }

    if (isAxiosError<ApiResponse>(error)) {
      throw new NotificationApiError(
        error.response?.data.message || "알림 설정을 변경하지 못했어요.",
        error.response?.data.code,
      );
    }

    throw new NotificationApiError("알림 설정을 변경하지 못했어요.");
  }
}

async function getNotificationData<T>(
  path: string,
  isData: (value: unknown) => value is T,
): Promise<T> {
  try {
    const response = await apiClient.get<ApiResponse<unknown>>(path);
    const payload = response.data;

    if (!payload.success || !isData(payload.data)) {
      throw new NotificationApiError(
        payload.message || "알림 설정을 불러오지 못했어요.",
        payload.code,
      );
    }

    return payload.data;
  } catch (error) {
    if (error instanceof NotificationApiError) {
      throw error;
    }

    if (isAxiosError<ApiResponse>(error)) {
      throw new NotificationApiError(
        error.response?.data.message || "알림 설정을 불러오지 못했어요.",
        error.response?.data.code,
      );
    }

    throw new NotificationApiError("알림 설정을 불러오지 못했어요.");
  }
}

function isNotificationSettings(value: unknown): value is NotificationSettings {
  return (
    isRecord(value) &&
    typeof value.diaryReminderEnabled === "boolean" &&
    typeof value.fortuneActionEnabled === "boolean"
  );
}

function isNotificationDays(value: unknown): value is NotificationDays {
  return (
    isRecord(value) &&
    typeof value.mondayEnabled === "boolean" &&
    typeof value.tuesdayEnabled === "boolean" &&
    typeof value.wednesdayEnabled === "boolean" &&
    typeof value.thursdayEnabled === "boolean" &&
    typeof value.fridayEnabled === "boolean" &&
    typeof value.saturdayEnabled === "boolean" &&
    typeof value.sundayEnabled === "boolean"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
