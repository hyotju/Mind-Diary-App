"use client";

import Image from "next/image";
import { getTodayDateString } from "@/features/diary/utils";

export type DiaryCalendarEntry = {
  content: string;
  createdAt: string;
  date: string;
  isBurned?: boolean;
};

type DiaryCalendarProps = {
  entries: DiaryCalendarEntry[];
  month: string;
  monthOptions?: string[];
  onBurnedSelect?: (entry: DiaryCalendarEntry) => void;
  onMonthChange: (month: string) => void;
  onSelect: (date: string | null) => void;
  /** true면 일기 유무와 상관없이 모든 날짜를 선택할 수 있다. 기본값은 false(작성된 날짜만 선택 가능)로, 소각 화면의 기존 동작을 유지한다. */
  selectAnyDate?: boolean;
  selectedDate: string | null;
  /**
   * "list"(기본값): 소각 화면의 일기 목록 캘린더(작성/소각 아이콘 + 월 드롭다운).
   * "picker": 일기 날짜 선택 화면의 Figma DatePicker 스타일(숫자만 표시 + < > 월 이동 + 흰 카드).
   */
  variant?: "list" | "picker";
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function DiaryCalendar({
  entries,
  month,
  monthOptions = [],
  onBurnedSelect,
  onMonthChange,
  onSelect,
  selectAnyDate = false,
  selectedDate,
  variant = "list",
}: DiaryCalendarProps) {
  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const firstWeekday = new Date(year, monthNumber - 1, 1).getDay();
  const entriesByDate = entries.reduce<Map<string, DiaryCalendarEntry[]>>(
    (groupedEntries, entry) => {
      const dateEntries = groupedEntries.get(entry.date) ?? [];

      groupedEntries.set(entry.date, [...dateEntries, entry]);
      return groupedEntries;
    },
    new Map(),
  );
  const monthLabel = `${year}.${String(monthNumber).padStart(2, "0")}`;
  const today = getTodayDateString();

  if (variant === "picker") {
    return (
      <section
        aria-label={`${monthLabel} 날짜 선택`}
        className="w-full rounded-[13px] bg-white px-4 pb-6 pt-6 shadow-[0px_10px_30px_rgba(0,0,0,0.1)]"
      >
        <div className="flex items-center justify-center gap-[21px]">
          <button
            aria-label="이전 달"
            className="flex size-7 items-center justify-center text-orange-500"
            onClick={() => onMonthChange(shiftMonth(month, -1))}
            type="button"
          >
            <ChevronIcon direction="left" />
          </button>
          <p className="text-[17px] font-semibold leading-[22px] text-foreground">
            {year}년 {monthNumber}월
          </p>
          <button
            aria-label="다음 달"
            className="flex size-7 items-center justify-center text-orange-500"
            onClick={() => onMonthChange(shiftMonth(month, 1))}
            type="button"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>

        <div className="mt-[18px] grid grid-cols-7">
          {WEEKDAYS.map((weekday) => (
            <span
              className="flex h-[18px] items-center justify-center text-[13px] font-semibold text-gray-400"
              key={weekday}
            >
              {weekday}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: firstWeekday }).map((_, index) => (
            <span className="h-10" key={`empty-${index}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const date = `${month}-${String(day).padStart(2, "0")}`;
            const isSelected = selectedDate === date;
            const isFuture = date > today;

            return (
              <button
                aria-label={`${day}일`}
                aria-pressed={isSelected}
                className={`flex h-10 items-center justify-center rounded-full text-[20px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  isFuture
                    ? "cursor-not-allowed text-gray-300"
                    : isSelected
                      ? "font-semibold text-orange-500"
                      : "text-foreground"
                }`}
                disabled={isFuture}
                key={date}
                onClick={() => onSelect(date)}
                type="button"
              >
                {day}
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section aria-label={`${monthLabel} 일기 달력`} className="w-full">
      <div className="relative flex w-fit items-center gap-1.5">
        <p className="text-sm font-medium leading-normal text-foreground">
          {monthLabel}
        </p>
        <ChevronDownIcon />
        <select
          aria-label="일기 월 선택"
          className="absolute inset-0 size-full cursor-pointer opacity-0"
          onChange={(event) => onMonthChange(event.target.value)}
          value={month}
        >
          {monthOptions.map((option) => (
            <option key={option} value={option}>
              {formatMonthOption(option)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 grid grid-cols-7">
        {WEEKDAYS.map((weekday) => (
          <span
            className="flex h-[22px] items-center justify-center text-[13px] leading-[22px] text-gray-500"
            key={weekday}
          >
            {weekday}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {Array.from({ length: firstWeekday }).map((_, index) => (
          <span className="h-[56px]" key={`empty-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const date = `${month}-${String(day).padStart(2, "0")}`;
          const dateEntries = entriesByDate.get(date) ?? [];
          const storedEntries = dateEntries.filter((entry) => !entry.isBurned);
          const burnedEntry = dateEntries.find((entry) => entry.isBurned);
          const isWritten = storedEntries.length > 0;
          const isBurned = !isWritten && Boolean(burnedEntry);
          const isSelected = selectedDate === date;
          const isToday = date === today;

          return (
            <button
              aria-label={`${day}일${isBurned ? ", 소각 완료" : isWritten ? ", 작성한 일기" : ", 작성한 일기 없음"}`}
              aria-pressed={isSelected}
              className="group flex h-[56px] flex-col items-center pt-[7px] outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-orange-500"
              key={date}
              onClick={() => {
                if (isBurned && burnedEntry) {
                  onBurnedSelect?.(burnedEntry);
                  return;
                }

                onSelect(selectAnyDate || isWritten ? date : null);
              }}
              type="button"
            >
              <DiaryDayIcon
                isBurned={isBurned}
                isSelected={isSelected}
                isWritten={isWritten}
              />
              <span
                className={`mt-0.5 flex h-[18px] min-w-[26px] items-center justify-center rounded-full px-1 text-[13px] leading-normal transition-colors group-hover:bg-orange-500 group-hover:font-medium group-hover:text-white ${
                  isSelected
                    ? "bg-orange-500 font-medium text-white"
                    : isToday
                      ? "font-medium text-orange-500"
                      : "text-foreground"
                }`}
              >
                {day}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

type DiaryDayIconProps = {
  isBurned: boolean;
  isSelected: boolean;
  isWritten: boolean;
};

function DiaryDayIcon({ isBurned, isSelected, isWritten }: DiaryDayIconProps) {
  if (isBurned) {
    return (
      <span className="flex size-[26px] items-center justify-center rounded-full bg-orange-100 shadow-[0_2.364px_11.818px_rgba(18,18,18,0.05)] transition-transform group-hover:scale-105">
        <Image
          alt=""
          height={14.4}
          src="/figma/diary/figma-lock.svg"
          width={12}
        />
      </span>
    );
  }

  return (
    <span
      className={`relative size-[26px] overflow-hidden rounded-full shadow-[0_2.364px_11.818px_rgba(18,18,18,0.05)] transition-[background-color,transform] group-hover:scale-105 group-hover:bg-orange-400 ${
        isWritten
          ? isSelected
            ? "bg-orange-400"
            : "bg-orange-100"
          : "bg-gray-200"
      }`}
    >
      {isWritten ? <DiaryMascot /> : null}
    </span>
  );
}

function DiaryMascot() {
  return (
    <>
      <Image
        alt=""
        className="absolute left-[5.91px] top-[4.14px] -scale-y-100 rotate-180"
        height={17.568}
        src="/figma/diary/diary-mascot-body.svg"
        width={14.182}
      />
      <Image
        alt=""
        className="absolute left-[8.27px] top-[7.58px] -scale-y-100 rotate-180"
        height={12.793}
        src="/figma/diary/diary-mascot-face.svg"
        width={10.356}
      />
      <Image
        alt=""
        className="absolute left-[12.61px] top-[14.82px]"
        height={1.802}
        src="/figma/diary/diary-mascot-mouth.svg"
        width={2.045}
      />
      <Image
        alt=""
        className="absolute left-[9.8px] top-[11.39px] rotate-[18.11deg]"
        height={1.602}
        src="/figma/diary/diary-mascot-eye-left.svg"
        width={2.54}
      />
      <Image
        alt=""
        className="absolute left-[14.13px] top-[11.32px] -scale-y-100 rotate-[161.89deg]"
        height={1.602}
        src="/figma/diary/diary-mascot-eye-right.svg"
        width={2.54}
      />
    </>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[17px]"
      fill="none"
      viewBox="0 0 17 17"
    >
      <path
        d="m4.5 6.5 4 4 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function formatMonthOption(month: string): string {
  const [year, monthNumber] = month.split("-");

  return `${year}년 ${Number(monthNumber)}월`;
}

function shiftMonth(month: string, offset: number): string {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber - 1 + offset, 1);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

type ChevronIconProps = {
  direction: "left" | "right";
};

function ChevronIcon({ direction }: ChevronIconProps) {
  return (
    <svg
      aria-hidden="true"
      className="h-3 w-[7px]"
      fill="none"
      viewBox="0 0 7 12"
    >
      <path
        d={direction === "left" ? "M6 1 1 6l5 5" : "M1 1l5 5-5 5"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
