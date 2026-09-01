"use client";

import Image from "next/image";
import Link from "next/link";

import NotificationPageShell from "@/features/user/components/notification/NotificationPageShell";
import NotificationToggle from "@/features/user/components/notification/NotificationToggle";
import { DEFAULT_NOTIFICATION_SETTINGS } from "@/features/user/constants/notifications";
import {
  getNotificationSettings,
  updateNotificationSettings,
} from "@/features/user/api/notifications";
import { useNotificationToggles } from "@/features/user/hooks/useNotificationToggles";

export default function NotificationSettingsPage() {
  const { error, isPending, toggle, values } = useNotificationToggles(
    DEFAULT_NOTIFICATION_SETTINGS,
    getNotificationSettings,
    updateNotificationSettings,
  );

  return (
    <NotificationPageShell backHref="/my">
      <p className="absolute left-6 top-[94px] text-xl font-medium leading-[27px]">
        원하는 알림만 받아볼 수 있어요.
      </p>

      <div className="absolute left-[43px] right-[43px] top-[145px] flex h-7 items-center justify-between">
        <span className="text-xl font-semibold leading-4 text-[#333333]">
          일기 작성 알림
        </span>
        <NotificationToggle
          checked={values.diaryReminderEnabled}
          disabled={isPending("diaryReminderEnabled")}
          label="일기 작성 알림"
          onChange={() => void toggle("diaryReminderEnabled")}
        />
      </div>

      <div className="absolute left-[43px] right-[43px] top-[197px] flex h-7 items-center justify-between">
        <span className="text-xl font-semibold leading-4 text-[#333333]">
          개운 지침 알림
        </span>
        <NotificationToggle
          checked={values.fortuneActionEnabled}
          disabled={isPending("fortuneActionEnabled")}
          label="개운 지침 알림"
          onChange={() => void toggle("fortuneActionEnabled")}
        />
      </div>

      <Link
        className="absolute left-[22px] right-[22px] top-[270px] flex h-10 items-center justify-between"
        href="/my/notifications/days"
      >
        <span className="text-xl font-medium leading-[27px]">요일별 알림</span>
        <Image
          alt=""
          className="rotate-90"
          height={40}
          src="/figma/my/back-arrow.svg"
          width={40}
        />
      </Link>

      <p aria-live="polite" className="sr-only">
        {error}
      </p>
    </NotificationPageShell>
  );
}
