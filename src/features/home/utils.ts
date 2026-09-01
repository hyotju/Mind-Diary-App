import { FIVE_ELEMENT_HANJA_LABEL } from "@/features/home/constants";
import type { FiveElement } from "@/features/user/types";

const dateLabelFormatter = new Intl.DateTimeFormat("ko-KR", {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
});

export function getTodayDateLabel(date: Date = new Date()): string {
  return dateLabelFormatter.format(date);
}

export function getEnergyMessage(element: FiveElement): string {
  return `오늘은 ${FIVE_ELEMENT_HANJA_LABEL[element]} 기운이 올라와 있어요.\n감정이 평소보다 예민하게 느껴질 수 있어요.`;
}
