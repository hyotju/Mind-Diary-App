export type ReportGenerationStatus =
  "COMPLETED" | "FAILED" | "FALLBACK_COMPLETED" | "PENDING" | "PROCESSING";

export type WeeklyReportPeriod = {
  generationStatus: ReportGenerationStatus;
  periodEnd: string;
  periodStart: string;
  reportId: number;
};

export type WeeklyReportSummary = {
  emotionReportId: number;
  generatedAt: string | null;
  generationStatus: ReportGenerationStatus;
  insightSummary: string | null;
  modelName: string | null;
  periodEnd: string;
  periodStart: string;
  reportVersion: string | null;
  summaryId: number;
};

export type GenerateWeeklyReportResponse = {
  emotionReportId: number;
  generationStatus: ReportGenerationStatus;
  message: string;
  periodEnd: string;
  periodStart: string;
  reportType: "MONTHLY" | "WEEKLY";
};

export type EmotionStat = {
  count: number;
  emotion: string;
};

export type ReportBurning = {
  analysisStatus: ReportGenerationStatus;
  burnedAt: string;
  burningId: number;
  hasTalisman: boolean;
  sourceType: "DIARY" | "DIRECT";
};

export type NextWeekFlowStatus = "COMPLETED" | "FAILED" | "PROCESSING";

export type NextWeekFlow = {
  adviceText: string | null;
  emotionReportId: number;
  flowId: number;
  generatedAt: string | null;
  generationStatus: NextWeekFlowStatus;
  modelName: string | null;
  periodEnd: string;
  periodStart: string;
  reportVersion: string | null;
  title: string | null;
};

export type NextWeekFlowStart = {
  emotionReportId: number;
  flowId: number;
  generationStatus: NextWeekFlowStatus;
  message: string;
  weekStart: string;
};

export type WeeklyReportView = {
  burnCount: number;
  emotionStats: EmotionStat[];
  nextWeekFlow: NextWeekFlow | null;
  summary: WeeklyReportSummary;
};

export type TalismanGenerationStatus = "COMPLETED" | "FAILED" | "PROCESSING";

export type TalismanItem = {
  burnRitualId: number;
  createdAt: string;
  designType: string | null;
  generationStatus: TalismanGenerationStatus;
  imageUrl: string | null;
  message: string | null;
  recordedAt: string;
  talismanId: number;
  title: string | null;
  usedSaju: string | null;
};

export type TalismanList = {
  count: number;
  hasNext: boolean;
  items: TalismanItem[];
  nextCursor: number | null;
};
