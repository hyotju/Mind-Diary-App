import type { EmotionStat, WeeklyReportPeriod } from "@/features/report/types";

export type EmotionChartItem = EmotionStat & {
  percentage: number;
};

export function toEmotionChartItems(
  stats: EmotionStat[] | null | undefined,
): EmotionChartItem[] {
  if (!Array.isArray(stats)) {
    return [];
  }

  const total = stats.reduce((sum, stat) => sum + stat.count, 0);

  if (total === 0) {
    return [];
  }

  return [...stats]
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
    .map((stat) => ({
      ...stat,
      percentage: Math.round((stat.count / total) * 1000) / 10,
    }));
}

export function getDiaryCount(stats: EmotionStat[] | null | undefined): number {
  if (!Array.isArray(stats)) {
    return 0;
  }

  return stats.reduce((sum, stat) => sum + stat.count, 0);
}

export function formatWeeklyPeriod(period: WeeklyReportPeriod): string {
  const [year, month, day] = period.periodStart.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const week = Math.ceil((day + firstDay) / 7);

  return `${month}월 ${week}주차`;
}

export function getCurrentWeekStart(date: Date = new Date()): string {
  const start = new Date(date);
  const day = start.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;

  start.setDate(start.getDate() - daysSinceMonday);

  const year = start.getFullYear();
  const month = String(start.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(start.getDate()).padStart(2, "0");

  return `${year}-${month}-${dayOfMonth}`;
}

export function splitReportCopy(value: string | null): {
  body: string;
  title: string;
} {
  if (!value) {
    return { body: "", title: "" };
  }

  const paragraphs = value
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length <= 1) {
    return { body: paragraphs[0] ?? "", title: "" };
  }

  return {
    body: paragraphs.slice(1).join("\n\n"),
    title: paragraphs[0],
  };
}
