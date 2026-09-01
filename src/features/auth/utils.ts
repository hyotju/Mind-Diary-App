import type { AuthTokens } from "@/features/auth/types";

export function isAuthTokens(value: unknown): value is AuthTokens {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const tokens = value as Record<string, unknown>;

  return (
    typeof tokens.accessToken === "string" &&
    typeof tokens.refreshToken === "string"
  );
}
