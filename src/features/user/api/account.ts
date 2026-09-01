import { isAxiosError } from "axios";

import type { LogoutRequest } from "@/features/auth/types";
import { apiClient, publicApiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/api";

const LOGOUT_PATH = "/api/auth/logout";
const WITHDRAW_PATH = "/api/members/withdraw";

export class AccountApiError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "AccountApiError";
    this.code = code;
  }
}

export async function logout(request: LogoutRequest): Promise<void> {
  await requestAccountAction(() =>
    publicApiClient.post<ApiResponse>(LOGOUT_PATH, request),
  );
}

export async function withdrawMember(): Promise<void> {
  await requestAccountAction(() =>
    apiClient.delete<ApiResponse>(WITHDRAW_PATH),
  );
}

async function requestAccountAction(
  request: () => Promise<{ data: ApiResponse }>,
): Promise<void> {
  try {
    const response = await request();

    if (!response.data.success) {
      throw new AccountApiError(response.data.message, response.data.code);
    }
  } catch (error) {
    if (error instanceof AccountApiError) {
      throw error;
    }

    if (isAxiosError<ApiResponse>(error)) {
      throw new AccountApiError(
        error.response?.data.message || "요청을 처리하지 못했어요.",
        error.response?.data.code,
      );
    }

    throw new AccountApiError("요청을 처리하지 못했어요.");
  }
}
