export type SmsSendRequest = {
  phoneNumber: string;
  purpose: "PASSWORD_RESET" | "SIGNUP";
};

export type SmsVerifyRequest = {
  code: string;
  phoneNumber: string;
};

export type LoginRequest = {
  password: string;
  phoneNumber: string;
};

export type PasswordResetRequest = {
  newPassword: string;
  phoneNumber: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type TokenReissueRequest = {
  refreshToken: string;
};

export type LogoutRequest = {
  refreshToken: string;
};

export type SignUpRequest = {
  name: string;
  password: string;
  phoneNumber: string;
};

export type SignUpTerms = {
  marketingAgreed: boolean;
  privacyAndSensitiveAgreed: boolean;
  termsAgreed: boolean;
};

export type CalendarType = "LUNAR" | "LUNAR_LEAP" | "SOLAR";

export type Gender = "FEMALE" | "MALE" | "NONE";

export type SajuProfileDraft = {
  birthDate: string;
  birthTime: string | null;
  calendarType: CalendarType;
  gender: Gender;
};

export type MemberOnboardingRequest = {
  birthDate: string;
  birthTime: string | null;
  calendarType: CalendarType;
  gender: Gender;
  marketingAgreed: boolean;
  privacyAgreed: boolean;
  sensitiveDataAgreed: boolean;
  termsAgreed: boolean;
};
