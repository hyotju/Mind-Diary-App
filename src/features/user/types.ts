export type FiveElement = "earth" | "fire" | "metal" | "water" | "wood";

export type FiveElementGaugeValue = {
  element: FiveElement;
  percentage: number;
  fillPercentage?: number;
};

export type MyMenuItem = {
  action?: "logout" | "withdraw";
  href?: string;
  iconHasBackground: boolean;
  iconSize: number;
  iconSrc: string;
  label: string;
};

export type SajuAnalysisStatus =
  "COMPLETED" | "FAILED" | "PENDING" | "PROCESSING";

export type CreateSajuAnalysisResponse = {
  analysisId: number;
  status: SajuAnalysisStatus;
};

export type FiveElementsBalance = Record<FiveElement, number>;

export type SajuAnalysis = {
  analysisId: number;
  analyzedAt: string | null;
  elements: FiveElementsBalance | null;
  failureCode: string | null;
  modelName: string | null;
  status: SajuAnalysisStatus;
};

export type NotificationSettings = {
  diaryReminderEnabled: boolean;
  fortuneActionEnabled: boolean;
};

export type NotificationDays = {
  fridayEnabled: boolean;
  mondayEnabled: boolean;
  saturdayEnabled: boolean;
  sundayEnabled: boolean;
  thursdayEnabled: boolean;
  tuesdayEnabled: boolean;
  wednesdayEnabled: boolean;
};

export type AuthProvider = "GOOGLE" | "LOCAL";

export type MemberProfile = {
  birthDate: string | null;
  birthTime: string | null;
  calendarType: "LUNAR" | "LUNAR_LEAP" | "SOLAR" | null;
  email: string | null;
  gender: "FEMALE" | "MALE" | "NONE" | null;
  marketingAgreed: boolean;
  name: string;
  onboardingCompleted: boolean;
  onboardingCompletedAt: string | null;
  phoneNumber: string;
  privacyAgreed: boolean;
  provider: AuthProvider;
  sensitiveDataAgreed: boolean;
  termsAgreed: boolean;
};

export type MemberProfileUpdateRequest = {
  birthDate: string;
  birthTime: string | null;
  gender: Exclude<MemberProfile["gender"], null>;
  name: string;
  phoneNumber: string;
};

export type MemberProfileUpdateResponse = {
  profile: MemberProfile;
  reauthenticationRequired: boolean;
};
