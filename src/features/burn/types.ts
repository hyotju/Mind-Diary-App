export const TALISMAN_TEMPLATE_KEYS = [
  "talisman-01",
  "talisman-02",
  "talisman-03",
  "talisman-04",
  "talisman-05",
  "talisman-06",
  "talisman-07",
  "talisman-08",
  "talisman-09",
  "talisman-10",
  "talisman-11",
  "talisman-12",
  "talisman-13",
] as const;

export type TalismanTemplateKey = (typeof TALISMAN_TEMPLATE_KEYS)[number];

export type TalismanSource = {
  occurredAt: string | null;
  referenceId: string | null;
  type: "diary" | "emotion";
};

export type GeneratedTalisman = {
  generatedAt: string;
  id: string;
  phrase: string;
  source: TalismanSource;
  templateKey: TalismanTemplateKey;
};

export type CreateBurningRequest =
  | {
      content: string;
      diaryId?: never;
      sourceType: "DIRECT";
    }
  | {
      content?: never;
      diaryId: number;
      sourceType: "DIARY";
    };

export type CreateBurningResponse = {
  analysisStatus:
    "COMPLETED" | "FAILED" | "FALLBACK_COMPLETED" | "PENDING" | "PROCESSING";
  burnedAt: string;
  burningId: number;
  sourceType: "DIARY" | "DIRECT";
};

export type BurningDetailResponse = {
  analysisStatus:
    "COMPLETED" | "FAILED" | "FALLBACK_COMPLETED" | "PENDING" | "PROCESSING";
  burnedAt: string;
  burningId: number;
  comment: string | null;
  guidance: string | null;
  hasTalisman: boolean;
  sourceType: "DIARY" | "DIRECT";
  sourceContent: string | null;
  talismanText: string | null;
  talismanType: number | null;
  title: string | null;
};

export type BurningListItem = {
  analysisStatus: BurningDetailResponse["analysisStatus"];
  burnedAt: string;
  burningId: number;
  hasTalisman: boolean;
  sourceType: "DIARY" | "DIRECT";
};

export type BurningListResponse = {
  hasNext: boolean;
  items: BurningListItem[];
  nextCursor: number | null;
};

export type TalismanCreationResponse = {
  hasTalisman: boolean;
  talisman: {
    generationStatus: "COMPLETED" | "FAILED" | "PROCESSING";
    talismanId: number;
  } | null;
};
