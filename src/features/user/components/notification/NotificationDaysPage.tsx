"use client";

import NotificationPageShell from "@/features/user/components/notification/NotificationPageShell";
import NotificationToggle from "@/features/user/components/notification/NotificationToggle";
import { DEFAULT_NOTIFICATION_DAYS } from "@/features/user/constants/notifications";
import {
  getNotificationDays,
  updateNotificationDays,
} from "@/features/user/api/notifications";
import { useNotificationToggles } from "@/features/user/hooks/useNotificationToggles";
import type { NotificationDays } from "@/features/user/types";

const DAY_ITEMS: { key: keyof NotificationDays; label: string }[] = [
  { key: "mondayEnabled", label: "월요일" },
  { key: "tuesdayEnabled", label: "화요일" },
  { key: "wednesdayEnabled", label: "수요일" },
  { key: "thursdayEnabled", label: "목요일" },
  { key: "fridayEnabled", label: "금요일" },
  { key: "saturdayEnabled", label: "토요일" },
  { key: "sundayEnabled", label: "일요일" },
];

export default function NotificationDaysPage() {
  const { error, isPending, toggle, values } = useNotificationToggles(
    DEFAULT_NOTIFICATION_DAYS,
    getNotificationDays,
    updateNotificationDays,
  );

  return (
    <NotificationPageShell backHref="/my/notifications">
      <p className="absolute left-8 top-[86px] text-xl font-medium leading-[27px]">
        요일별 알림을 설정할 수 있어요.
      </p>

      <div className="absolute left-[43px] right-[43px] top-[143px] flex flex-col gap-[25px]">
        {DAY_ITEMS.map((item) => (
          <div className="flex h-7 items-center justify-between" key={item.key}>
            <span className="text-xl font-semibold leading-4 text-[#333333]">
              {item.label}
            </span>
            <NotificationToggle
              checked={values[item.key]}
              disabled={isPending(item.key)}
              label={`${item.label} 알림`}
              onChange={() => void toggle(item.key)}
            />
          </div>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {error}
      </p>
    </NotificationPageShell>
  );
}
