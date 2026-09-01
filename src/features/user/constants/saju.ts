import type { FiveElement, FiveElementGaugeValue } from "@/features/user/types";

type FiveElementMeta = {
  barClassName: string;
  label: string;
  textClassName: string;
};

export const FIVE_ELEMENT_ORDER: FiveElement[] = [
  "wood",
  "fire",
  "earth",
  "metal",
  "water",
];

export const FIVE_ELEMENT_META: Record<FiveElement, FiveElementMeta> = {
  wood: {
    label: "목",
    barClassName: "bg-[#3dc56f]",
    textClassName: "text-[#3dc56f]",
  },
  fire: {
    label: "화",
    barClassName: "bg-[#fe5623]",
    textClassName: "text-[#fe5623]",
  },
  earth: {
    label: "토",
    barClassName: "bg-[#dd8b4e]",
    textClassName: "text-[#dd8b4e]",
  },
  metal: {
    label: "금",
    barClassName: "bg-[#f7d200]",
    textClassName: "text-[#f7d200]",
  },
  water: {
    label: "수",
    barClassName: "bg-[#60d5ff]",
    textClassName: "text-[#60d5ff]",
  },
};

export const EMPTY_FIVE_ELEMENT_GAUGES: FiveElementGaugeValue[] = [
  { element: "wood", percentage: 0 },
  { element: "fire", percentage: 0 },
  { element: "earth", percentage: 0 },
  { element: "metal", percentage: 0 },
  { element: "water", percentage: 0 },
];
