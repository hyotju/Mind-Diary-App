import type { BottomNavigationItem } from "@/components/layout/BottomNavigation";

export const MAIN_NAVIGATION_ITEMS: BottomNavigationItem[] = [
  { href: "/", label: "홈", value: "home" },
  { href: "/diary", label: "일기", value: "diary" },
  { href: "/report", label: "리포트", value: "report" },
  { href: "/burn", label: "소각", value: "burn" },
  { href: "/my", label: "마이", value: "my" },
];
