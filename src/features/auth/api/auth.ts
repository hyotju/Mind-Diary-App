import { isAxiosError } from "axios";

import type {
  AuthTokens,
  LoginRequest,
  MemberOnboardingRequest,
  PasswordResetRequest,
  SignUpRequest,
  SmsSendRequest,
  SmsVerifyRequest,
} from "@/features/auth/types";
import { isAuthTokens } from "@/features/auth/utils";
import { API_BASE_URL, apiClient, publicApiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/api";

export class AuthApiError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "AuthApiError";
    this.code = code;
  }
}

export function redirectToGoogleLogin(): void {
  const apiBaseUrl = API_BASE_URL.replace(/\/$/, "");
  window.location.assign(`${apiBaseUrl}/api/auth/google`);
}

export async function sendSignupSms(phoneNumber: string): Promise<void> {
  await sendSms(phoneNumber, "SIGNUP");
}

export async function sendPasswordResetSms(phoneNumber: string): Promise<void> {
  await sendSms(phoneNumber, "PASSWORD_RESET");
}

export async function sendProfilePhoneSms(phoneNumber: string): Promise<void> {
  // Swagger currently exposes no phone-change purpose for an unused new number.
  await sendSms(phoneNumber, "SIGNUP");
}

export async function verifySmsCode(request: SmsVerifyRequest): Promise<void> {
  await postAuthRequest<SmsVerifyRequest>("/api/auth/sms/verify", request);
}

export async function resetPassword(
  request: PasswordResetRequest,
): Promise<void> {
  await postAuthRequest<PasswordResetRequest>(
    "/api/auth/password/reset",
    request,
  );
}

export async function signUp(request: SignUpRequest): Promise<void> {
  await postAuthRequest<SignUpRequest>("/api/auth/signup", request);
}

export async function completeOnboarding(
  request: MemberOnboardingRequest,
): Promise<void> {
  await postProtectedAuthRequest<MemberOnboardingRequest>(
    "/api/members/onboarding",
    request,
  );
}

export async function login(request: LoginRequest): Promise<AuthTokens> {
  const tokens = await postAuthRequest<LoginRequest, AuthTokens>(
    "/api/auth/login",
    request,
  );

  if (!isAuthTokens(tokens)) {
    throw new AuthApiError(
      "로그인 응답에서 인증 정보를 확인하지 못했어요.",
      "INVALID_LOGIN_RESPONSE",
    );
  }

  return tokens;
}

async function sendSms(
  phoneNumber: string,
  purpose: SmsSendRequest["purpose"],
): Promise<void> {
  await postAuthRequest<SmsSendRequest>("/api/auth/sms/send", {
    phoneNumber,
    purpose,
  });
}

async function postAuthRequest<TRequest, TData = unknown>(
  path: string,
  body: TRequest,
): Promise<TData | undefined> {
  try {
    const response = await publicApiClient.post<ApiResponse<TData>>(path, body);
    const payload = response.data;

    if (!payload.success) {
      throw new AuthApiError(
        payload.message || "요청을 처리하지 못했어요.",
        payload.code || String(response.status),
      );
    }

    return payload.data ?? undefined;
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }

    if (isAxiosError<ApiResponse>(error)) {
      throw new AuthApiError(
        error.response?.data?.message || "요청을 처리하지 못했어요.",
        error.response?.data?.code ||
          error.code ||
          String(error.response?.status ?? "UNKNOWN"),
      );
    }

    throw new AuthApiError("요청을 처리하지 못했어요.", "UNKNOWN");
  }
}

async function postProtectedAuthRequest<TRequest, TData = unknown>(
  path: string,
  body: TRequest,
): Promise<TData | undefined> {
  try {
    const response = await apiClient.post<ApiResponse<TData>>(path, body);
    const payload = response.data;

    if (!payload.success) {
      throw new AuthApiError(
        payload.message || "요청을 처리하지 못했어요.",
        payload.code || String(response.status),
      );
    }

    return payload.data ?? undefined;
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }

    if (isAxiosError<ApiResponse>(error)) {
      throw new AuthApiError(
        error.response?.data?.message || "요청을 처리하지 못했어요.",
        error.response?.data?.code ||
          error.code ||
          String(error.response?.status ?? "UNKNOWN"),
      );
    }

    throw new AuthApiError("요청을 처리하지 못했어요.", "UNKNOWN");
  }
}
