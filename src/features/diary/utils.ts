import type { DiaryArchiveEntry } from "@/components/common/DiaryArchiveCard";
import type { DiaryCalendarEntry } from "@/components/common/DiaryCalendar";
import { EMOTIONS, type EmotionId } from "@/features/diary/constants";
import type {
  DiaryCalendarDay,
  DiaryEmotionCode,
  DiarySummary,
} from "@/features/diary/types";

const dateLabelFormatter = new Intl.DateTimeFormat("ko-KR", {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
});

export function getTodayDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getMonthFromDate(dateString: string): string {
  return dateString.slice(0, 7);
}

export function getDiaryDateLabel(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);

  return dateLabelFormatter.format(new Date(year, month - 1, day));
}

// "2026년 6월 24일" 형태. 소각 관련 다이얼로그들이 공통으로 쓴다.
export function formatShortKoreanDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);

  return `${year}년 ${month}월 ${day}일`;
}

export function createMonthOptions(
  startMonth: string,
  count: number,
): string[] {
  const [startYear, startMonthNumber] = startMonth.split("-").map(Number);

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(startYear, startMonthNumber - 1 + index, 1);

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  });
}

const shortWeekdayFormatter = new Intl.DateTimeFormat("ko-KR", {
  weekday: "long",
});

export type DiaryShortDateParts = {
  datePart: string;
  weekdayPart: string;
};

export function getDiaryShortDateParts(
  dateString: string,
): DiaryShortDateParts {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return {
    datePart: `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`,
    weekdayPart: shortWeekdayFormatter.format(date),
  };
}

export function getCurrentTimeLabel(date: Date = new Date()): string {
  const hours24 = date.getHours();
  const period = hours24 < 12 ? "AM" : "PM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${period} ${hours12}:${minutes}`;
}

export function formatDiaryEntryTimestamp(
  date: string,
  savedAt: string,
): string {
  const { datePart, weekdayPart } = getDiaryShortDateParts(date);

  return `${datePart} ${weekdayPart} ${getCurrentTimeLabel(new Date(savedAt))}`;
}

// 최신 작성순(내림차순)으로 정렬한다. 화면 6-1의 보관일기 목록에서 쓴다.
export function sortEntriesByNewest<T extends { createdAt: string }>(
  entries: T[],
): T[] {
  return [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function toDiaryCalendarEntries(
  days: DiaryCalendarDay[],
): DiaryCalendarEntry[] {
  return days.map((day) => ({
    content: "",
    createdAt: "",
    date: day.date,
    isBurned: day.status === "BURNED",
  }));
}

export function toDiaryArchiveEntries(
  dayEntries: DiarySummary[],
): DiaryArchiveEntry[] {
  return sortEntriesByNewest(dayEntries).map((entry) => ({
    content: entry.content,
    createdAt: formatDiaryEntryTimestamp(entry.recordedDate, entry.createdAt),
    id: String(entry.diaryId),
    isBurned: entry.status === "BURNED",
  }));
}

const EMOTION_CODE_BY_ID: Record<EmotionId, DiaryEmotionCode> = {
  angry: "ANGRY",
  anxious: "ANXIOUS",
  calm: "COMFORTABLE",
  excited: "EXCITED",
  happy: "HAPPY",
  joy: "JOYFUL",
  lethargic: "LETHARGIC",
  neutral: "NORMAL",
  sad: "SAD",
};

const EMOTION_ID_BY_CODE = Object.fromEntries(
  Object.entries(EMOTION_CODE_BY_ID).map(([id, code]) => [code, id]),
) as Record<DiaryEmotionCode, EmotionId>;

export function toDiaryEmotionCode(emotionId: EmotionId): DiaryEmotionCode {
  return EMOTION_CODE_BY_ID[emotionId];
}

export function toEmotionId(emotionCode: string): EmotionId {
  if (emotionCode in EMOTION_ID_BY_CODE) {
    return EMOTION_ID_BY_CODE[emotionCode as DiaryEmotionCode];
  }

  return EMOTIONS[0].id;
}

// 시드(예: 일기 날짜) 기반으로 목록에서 하나를 고른다. 서버/클라이언트가 항상 같은
// 값을 골라야 하는 상황(예: 초기 렌더 placeholder)에서 Math.random() 대신 사용한다.
export function pickBySeed<T>(items: readonly T[], seed: string): T {
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % items.length;
  }

  return items[Math.abs(hash) % items.length];
}
