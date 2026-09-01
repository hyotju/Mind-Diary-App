import type {
  BurningDetailResponse,
  GeneratedTalisman,
  TalismanTemplateKey,
} from "@/features/burn/types";

const TALISMAN_PHRASE_LENGTH = 4;

export const GENERATED_TALISMAN_STORAGE_KEY = "maeum-bujeok:generated-talisman";
export const PENDING_BURN_STORAGE_KEY = "maeum-bujeok:pending-burn";
export const PENDING_REPORT_TALISMAN_ID_STORAGE_KEY =
  "maeum-bujeok:pending-report-talisman-id";
export const TALISMAN_RETURN_PATH_STORAGE_KEY =
  "maeum-bujeok:talisman-return-path";

export type TalismanCharacters = [string, string, string, string];

export function splitTalismanPhrase(phrase: string): TalismanCharacters | null {
  const characters = Array.from(phrase.trim().normalize("NFC"));

  if (characters.length !== TALISMAN_PHRASE_LENGTH) {
    return null;
  }

  return characters as TalismanCharacters;
}

export function getPendingBurningId(): number | null {
  try {
    const value = sessionStorage.getItem(PENDING_BURN_STORAGE_KEY);
    const parsed: unknown = value ? JSON.parse(value) : null;

    if (!isRecord(parsed) || typeof parsed.burningId !== "number") {
      return null;
    }

    return parsed.burningId;
  } catch {
    return null;
  }
}

export function toGeneratedTalisman(
  detail: BurningDetailResponse,
  talismanId?: number,
): GeneratedTalisman | null {
  const templateKey = getTalismanTemplateKey(detail.talismanType);
  const phrase = detail.talismanText?.trim() ?? "";

  if (!detail.hasTalisman || !templateKey || !splitTalismanPhrase(phrase)) {
    return null;
  }

  return {
    generatedAt: detail.burnedAt,
    id: String(talismanId ?? detail.burningId),
    phrase,
    source: {
      occurredAt: detail.burnedAt,
      referenceId: String(detail.burningId),
      type: detail.sourceType === "DIARY" ? "diary" : "emotion",
    },
    templateKey,
  };
}

export function parseGeneratedTalisman(
  value: string | null,
): GeneratedTalisman | null {
  try {
    const parsed: unknown = value ? JSON.parse(value) : null;

    if (!isRecord(parsed) || typeof parsed.phrase !== "string") {
      return null;
    }

    return parsed as GeneratedTalisman;
  } catch {
    return null;
  }
}

function getTalismanTemplateKey(
  value: number | null,
): TalismanTemplateKey | null {
  if (!Number.isInteger(value) || value === null || value < 1 || value > 13) {
    return null;
  }

  return `talisman-${String(value).padStart(2, "0")}` as TalismanTemplateKey;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
