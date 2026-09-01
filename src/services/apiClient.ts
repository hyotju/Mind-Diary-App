"use client";

import axios, { type AxiosError } from "axios";
import createAuthRefresh from "axios-auth-refresh";

import type { AuthTokens, TokenReissueRequest } from "@/features/auth/types";
import { isAuthTokens } from "@/features/auth/utils";
import { useAuthStore } from "@/store/useAuthStore";
import type { ApiResponse } from "@/types/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://maumbujeok.p-e.kr";

const axiosConfig = {
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

export const publicApiClient = axios.create(axiosConfig);
export const apiClient = axios.create(axiosConfig);

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

const refreshAuth = async (failedRequest: AxiosError): Promise<void> => {
  const { clearTokens, refreshToken, setTokens } = useAuthStore.getState();

  if (!refreshToken) {
    clearTokens();
    throw new Error("저장된 리프레시 토큰이 없습니다.");
  }

  try {
    const response = await publicApiClient.post<ApiResponse<AuthTokens>>(
      "/api/auth/reissue",
      {
        refreshToken,
      } satisfies TokenReissueRequest,
    );
    const payload = response.data;

    if (!payload.success || !isAuthTokens(payload.data)) {
      throw new Error(payload.message || "토큰을 재발급하지 못했어요.");
    }

    setTokens(payload.data);

    if (failedRequest.response) {
      failedRequest.response.config.headers.set(
        "Authorization",
        `Bearer ${payload.data.accessToken}`,
      );
    }
  } catch (error) {
    clearTokens();
    throw error;
  }
};

createAuthRefresh(apiClient, refreshAuth, {
  deduplicateRefresh: true,
  maxRetries: 1,
  onRetry: (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return config;
  },
  statusCodes: [401, 403],
});
