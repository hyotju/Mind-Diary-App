import type { EmotionId } from "@/features/diary/constants";

export type DiaryStatus = "BURNED" | "STORED";

export type DiaryAnalysisStatus =
  "COMPLETED" | "FAILED" | "FALLBACK_COMPLETED" | "PENDING" | "PROCESSING";

export type DiaryEmotionCode =
  | "ANGRY"
  | "ANXIOUS"
  | "COMFORTABLE"
  | "EXCITED"
  | "HAPPY"
  | "JOYFUL"
  | "LETHARGIC"
  | "NORMAL"
  | "SAD";

export type DiarySummary = {
  burningId: number | null;
  content: string;
  createdAt: string;
  diaryId: number;
  recordedDate: string;
  selectedEmotion: DiaryEmotionCode;
  selectedEmotionLabel: string;
  status: DiaryStatus;
  title: string;
  updatedAt: string;
};

export type DiaryImage = {
  sortOrder: number;
  uploadId: string;
  url: string;
};

export type DiaryAnalysis = {
  attemptCount: number;
  createdAt: string;
  empathyResponse: string | null;
  failureCode: string | null;
  negativeIntensity: number | null;
  reportEmotion: string | null;
  safetyLevel: "CAUTION" | "CRISIS" | "NORMAL" | null;
  salpuriRecommended: boolean | null;
  status: DiaryAnalysisStatus;
  summary: string | null;
};

export type DiaryDetail = DiarySummary & {
  analysis: DiaryAnalysis | null;
  images: DiaryImage[];
};

export type DiaryCalendarDay = {
  burningId: number | null;
  date: string;
  diaryId: number | null;
  status: DiaryStatus;
};

export type DiaryCalendarResponse = {
  days: DiaryCalendarDay[];
  month: number;
  year: number;
};

export type CreateDiaryRequest = {
  content: string;
  imageUploadIds?: string[];
  recordedDate?: string;
  selectedEmotion: DiaryEmotionCode;
};

export type CreateDiaryResponse = {
  analysisStatus: DiaryAnalysisStatus;
  diaryId: number;
  recordedDate: string;
};

export type UpdateDiaryRequest = {
  content?: string;
  imageUploadIds?: string[];
  selectedEmotion?: DiaryEmotionCode;
};

export type UpdateDiaryResponse = {
  analysisRestarted: boolean;
  analysisStatus: DiaryAnalysisStatus;
  diaryId: number;
  recordedDate: string;
  updatedAt: string;
};

export type PresignedUpload = {
  expiresAt: string;
  uploadId: string;
  uploadUrl: string;
};

export type EditableDiaryImage =
  | {
      kind: "existing";
      uploadId: string;
      url: string;
    }
  | {
      file: File;
      id: string;
      kind: "new";
      url: string;
    };

export type DiaryDraftInput = {
  content: string;
  emotionId: EmotionId;
};
