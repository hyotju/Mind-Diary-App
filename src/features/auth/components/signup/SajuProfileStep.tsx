"use client";

import { useState } from "react";

import AuthPrimaryButton from "@/features/auth/components/common/AuthPrimaryButton";
import SignupHeader from "@/features/auth/components/common/SignupHeader";
import type {
  CalendarType,
  Gender,
  SajuProfileDraft,
} from "@/features/auth/types";

type SajuProfileStepProps = {
  isSubmitting?: boolean;
  onBack: () => void;
  onConfirm: (profile: SajuProfileDraft) => void;
};

const GENDER_OPTIONS: Array<{ label: string; value: Gender }> = [
  { label: "남성", value: "MALE" },
  { label: "여성", value: "FEMALE" },
  { label: "선택안함", value: "NONE" },
];

const CALENDAR_OPTIONS: Array<{ label: string; value: CalendarType }> = [
  { label: "양력", value: "SOLAR" },
  { label: "음력", value: "LUNAR" },
  { label: "윤달", value: "LUNAR_LEAP" },
];

export default function SajuProfileStep({
  isSubmitting = false,
  onBack,
  onConfirm,
}: SajuProfileStepProps) {
  const [gender, setGender] = useState<Gender>("NONE");
  const [calendarType, setCalendarType] = useState<CalendarType>("SOLAR");
  const [birthDateDigits, setBirthDateDigits] = useState("");
  const [birthTimeDigits, setBirthTimeDigits] = useState("");
  const [isBirthTimeUnknown, setIsBirthTimeUnknown] = useState(true);

  const birthDate = parseBirthDate(birthDateDigits);
  const birthTime = parseBirthTime(birthTimeDigits);
  const canConfirm =
    birthDate !== null &&
    (isBirthTimeUnknown || birthTime !== null) &&
    !isSubmitting;

  const handleConfirm = () => {
    if (!canConfirm || !birthDate) {
      return;
    }

    onConfirm({
      birthDate,
      birthTime: isBirthTimeUnknown ? null : birthTime,
      calendarType,
      gender,
    });
  };

  return (
    <section className="absolute inset-0 bg-white text-foreground">
      <SignupHeader onBack={onBack} title="기본정보" />

      <div className="absolute left-6 right-6 top-[123px]">
        <p className="text-xl font-medium leading-[27px]">
          성별을 입력해주세요.
        </p>
        <div className="mt-[15px] flex gap-[18px]">
          {GENDER_OPTIONS.map((option) => {
            const isSelected = gender === option.value;

            return (
              <button
                aria-pressed={isSelected}
                className={`h-[57px] w-[103px] rounded-lg border text-lg leading-[23px] ${
                  isSelected
                    ? "border-orange-500 text-orange-500"
                    : "border-gray-400 text-gray-400"
                }`}
                key={option.value}
                onClick={() => setGender(option.value)}
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute left-6 right-6 top-[247px]">
        <div className="flex h-[27px] items-center justify-between">
          <label
            className="text-xl font-medium leading-[27px]"
            htmlFor="signup-birth-date"
          >
            생년월일을 입력해주세요.
          </label>
          <div className="flex items-center gap-1.5">
            {CALENDAR_OPTIONS.map((option) => (
              <button
                aria-pressed={calendarType === option.value}
                className={`text-base leading-[27px] ${
                  calendarType === option.value
                    ? "text-orange-500"
                    : "text-gray-400"
                }`}
                key={option.value}
                onClick={() => setCalendarType(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <input
          className="mt-[15px] h-[57px] w-full rounded-lg border border-gray-400 bg-white px-[17px] text-center text-[22px] leading-[23px] text-foreground outline-none placeholder:text-gray-400"
          id="signup-birth-date"
          inputMode="numeric"
          maxLength={14}
          onChange={(event) =>
            setBirthDateDigits(
              event.target.value.replace(/\D/g, "").slice(0, 8),
            )
          }
          placeholder="YYYY - MM - DD"
          value={formatBirthDateInput(birthDateDigits)}
        />
      </div>

      <div className="absolute left-6 right-6 top-[371px]">
        <label
          className="block text-xl font-medium leading-[27px]"
          htmlFor="signup-birth-time"
        >
          태어난 시간을 입력해주세요.
        </label>
        <input
          className="mt-[15px] h-[57px] w-full rounded-lg border border-gray-400 bg-white px-[17px] text-lg leading-[23px] text-foreground outline-none placeholder:text-gray-400 disabled:text-gray-400"
          disabled={isBirthTimeUnknown}
          id="signup-birth-time"
          inputMode="numeric"
          maxLength={5}
          onChange={(event) =>
            setBirthTimeDigits(
              event.target.value.replace(/\D/g, "").slice(0, 4),
            )
          }
          placeholder="00:00"
          value={formatBirthTimeInput(birthTimeDigits)}
        />
        <label className="mt-2.5 flex h-[22px] w-fit cursor-pointer items-center gap-3">
          <input
            checked={isBirthTimeUnknown}
            className="peer sr-only"
            onChange={(event) => setIsBirthTimeUnknown(event.target.checked)}
            type="checkbox"
          />
          <span className="flex size-[22px] items-center justify-center rounded-[5px] border border-gray-200 bg-white text-base font-semibold leading-none text-transparent peer-checked:bg-gray-100 peer-checked:text-white">
            ✓
          </span>
          <span className="text-base font-medium leading-[22px]">
            태어난 시간을 몰라요
          </span>
        </label>
      </div>

      <div className="absolute inset-x-6 bottom-[51px]">
        <AuthPrimaryButton
          disabled={!canConfirm}
          onClick={handleConfirm}
          type="button"
          variant="light"
        >
          {isSubmitting ? "저장 중" : "확인"}
        </AuthPrimaryButton>
      </div>
    </section>
  );
}

function formatBirthDateInput(value: string): string {
  const year = value.slice(0, 4);
  const month = value.slice(4, 6);
  const day = value.slice(6, 8);

  return [year, month, day].filter(Boolean).join(" - ");
}

function formatBirthTimeInput(value: string): string {
  if (value.length <= 2) {
    return value;
  }

  return `${value.slice(0, 2)}:${value.slice(2, 4)}`;
}

function parseBirthDate(value: string): string | null {
  if (value.length !== 8) {
    return null;
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  const date = new Date(year, month - 1, day);
  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isValid) {
    return null;
  }

  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function parseBirthTime(value: string): string | null {
  if (value.length !== 4) {
    return null;
  }

  const hour = Number(value.slice(0, 2));
  const minute = Number(value.slice(2, 4));

  if (hour > 23 || minute > 59) {
    return null;
  }

  return `${value.slice(0, 2)}:${value.slice(2, 4)}`;
}
