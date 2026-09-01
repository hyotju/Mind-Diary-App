import type {
  NotificationDays,
  NotificationSettings,
} from "@/features/user/types";

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  diaryReminderEnabled: true,
  fortuneActionEnabled: true,
};

export const DEFAULT_NOTIFICATION_DAYS: NotificationDays = {
  fridayEnabled: true,
  mondayEnabled: true,
  saturdayEnabled: true,
  sundayEnabled: true,
  thursdayEnabled: true,
  tuesdayEnabled: true,
  wednesdayEnabled: true,
};
