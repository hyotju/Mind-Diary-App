"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DiaryArchiveCard from "@/components/common/DiaryArchiveCard";
import DiaryCalendar, {
  type DiaryCalendarEntry,
} from "@/components/common/DiaryCalendar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { MAIN_NAVIGATION_ITEMS } from "@/constants/navigation";
import { createBurning } from "@/features/burn/api/burnings";
import BurnedDiaryDialog from "@/features/burn/components/BurnedDiaryDialog";
import BurnNavigationTabs from "@/features/burn/components/BurnNavigationTabs";
import type { CreateBurningRequest } from "@/features/burn/types";
import { useDiariesByDate } from "@/features/diary/hooks/useDiariesByDate";
import { useDiaryCalendar } from "@/features/diary/hooks/useDiaryCalendar";
import type { DiaryCalendarDay, DiarySummary } from "@/features/diary/types";
import {
  createMonthOptions,
  getMonthFromDate,
  getTodayDateString,
  toDiaryArchiveEntries,
  toDiaryCalendarEntries,
} from "@/features/diary/utils";

type BurnTab = "emotion" | "diary";

type SelectedImage = {
  name: string;
  previewUrl: string;
};

const TODAY = getTodayDateString();
const CALENDAR_MONTHS = createMonthOptions("2025-01", 36);

type BurnPageProps = {
  initialTab?: BurnTab;
};

export default function BurnPage({ initialTab = "emotion" }: BurnPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BurnTab>(initialTab);
  const [burnText, setBurnText] = useState("");
  const [isInputError, setIsInputError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null,
  );
  const [selectedDiaryDate, setSelectedDiaryDate] = useState<string | null>(
    null,
  );
  const [selectedDiaryId, setSelectedDiaryId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(getMonthFromDate(TODAY));
  const [burnedDiaryDate, setBurnedDiaryDate] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { days, error: calendarError } = useDiaryCalendar(selectedMonth);
  const { diaries, error: diariesError } = useDiariesByDate(selectedDiaryDate);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedImageUrlRef = useRef<string | null>(null);
  const burnButtonPositionClass =
    activeTab === "emotion"
      ? selectedImage
        ? "mt-[19px]"
        : "mt-[35px]"
      : selectedDiaryId !== null
        ? "mt-[25px]"
        : "fixed bottom-[calc(111px+env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100%-48px)] max-w-[347px] -translate-x-1/2";

  useEffect(() => {
    return () => {
      if (selectedImageUrlRef.current) {
        URL.revokeObjectURL(selectedImageUrlRef.current);
      }
    };
  }, []);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (selectedImageUrlRef.current) {
      URL.revokeObjectURL(selectedImageUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);

    selectedImageUrlRef.current = previewUrl;
    setSelectedImage({ name: file.name, previewUrl });
    event.target.value = "";
  };

  const handleImageRemove = () => {
    if (selectedImageUrlRef.current) {
      URL.revokeObjectURL(selectedImageUrlRef.current);
      selectedImageUrlRef.current = null;
    }

    setSelectedImage(null);
  };

  const handleBurnClick = async () => {
    if (isSubmitting) {
      return;
    }

    const selectedEntry = diaries.find(
      (entry) =>
        entry.diaryId === Number(selectedDiaryId) && entry.status !== "BURNED",
    );
    const trimmedBurnText = burnText.trim();

    if (activeTab === "emotion" && !trimmedBurnText) {
      setActiveTab("emotion");
      setIsInputError(true);
      return;
    }

    if (activeTab === "diary" && !selectedEntry) {
      return;
    }

    let burningRequest: CreateBurningRequest;
    let pendingContent: string;
    let pendingDiaryId: number | null = null;

    if (activeTab === "diary" && selectedEntry) {
      burningRequest = {
        diaryId: selectedEntry.diaryId,
        sourceType: "DIARY",
      };
      pendingContent = selectedEntry.content;
      pendingDiaryId = selectedEntry.diaryId;
    } else {
      burningRequest = { content: trimmedBurnText, sourceType: "DIRECT" };
      pendingContent = trimmedBurnText;
    }

    setIsSubmitting(true);
    setRequestError(null);

    try {
      const response = await createBurning(burningRequest);

      sessionStorage.setItem(
        "maeum-bujeok:pending-burn",
        JSON.stringify({
          burningId: response.burningId,
          content: pendingContent,
          diaryId: pendingDiaryId,
          imageName: activeTab === "emotion" ? selectedImage?.name : null,
          recordedDate: activeTab === "diary" ? selectedDiaryDate : null,
          type: activeTab,
        }),
      );
      router.push("/burn/result");
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : "소각을 시작하지 못했어요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBurnTextChange = (value: string) => {
    setBurnText(value);

    if (isInputError) {
      setIsInputError(false);
    }
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setSelectedDiaryId(null);
  };

  const handleDiaryDateSelect = (date: string | null) => {
    setSelectedDiaryDate(date);
    setSelectedDiaryId(null);
  };

  return (
    <main className="h-dvh overflow-hidden bg-gray-100 text-foreground">
      <div className="relative mx-auto h-dvh w-full max-w-[395px] overflow-y-auto bg-background px-6 pb-[calc(126px+env(safe-area-inset-bottom))] pt-[28px]">
        <h1 className="text-center text-xl font-medium leading-[23px] text-foreground">
          소각
        </h1>

        <div className="mt-[18px] flex items-center gap-2.5">
          <BurnNavigationTabs
            activeTab={activeTab === "emotion" ? "direct" : "diary"}
            onDiaryClick={() => setActiveTab("diary")}
            onDirectClick={() => setActiveTab("emotion")}
          />
          <button
            aria-label="사진 촬영 또는 선택"
            className="ml-auto flex size-[37px] shrink-0 items-center justify-center rounded-full bg-orange-400 text-white transition-opacity active:opacity-80"
            onClick={handleCameraClick}
            type="button"
          >
            <CameraIcon />
          </button>
          <input
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            ref={fileInputRef}
            type="file"
          />
        </div>

        <section
          className={`mt-[22px] ${
            activeTab === "emotion"
              ? `${selectedImage ? "h-[344px]" : "h-[452px]"} rounded-[15px] border border-gray-200 bg-background shadow-[0_4px_20px_rgba(18,18,18,0.05)]`
              : ""
          }`}
        >
          {activeTab === "emotion" ? (
            <EmotionInput
              hasError={isInputError}
              onChange={handleBurnTextChange}
              value={burnText}
            />
          ) : (
            <DiarySelect
              days={days}
              diaries={diaries}
              onBurnedSelect={(entry) => setBurnedDiaryDate(entry.date)}
              onDiarySelect={setSelectedDiaryId}
              onMonthChange={handleMonthChange}
              onSelect={handleDiaryDateSelect}
              selectedDate={selectedDiaryDate}
              selectedDiaryId={selectedDiaryId}
              selectedMonth={selectedMonth}
            />
          )}
        </section>

        {activeTab === "emotion" && selectedImage ? (
          <SelectedImagePreview
            image={selectedImage}
            onRemove={handleImageRemove}
          />
        ) : null}

        <button
          className={`flex h-[57px] w-full items-center justify-center rounded-lg bg-orange-500 text-xl font-semibold leading-[23px] text-white transition-opacity active:opacity-90 ${burnButtonPositionClass}`}
          disabled={isSubmitting}
          onClick={() => void handleBurnClick()}
          type="button"
        >
          {isSubmitting ? "소각 준비 중" : "소각하기"}
        </button>

        {requestError || calendarError || diariesError ? (
          <p
            className="relative z-30 mt-3 text-center text-sm text-red-500"
            role="alert"
          >
            {requestError ?? calendarError ?? diariesError}
          </p>
        ) : null}

        <BottomNavigation activeValue="burn" items={MAIN_NAVIGATION_ITEMS} />

        {burnedDiaryDate ? (
          <BurnedDiaryDialog
            date={burnedDiaryDate}
            onClose={() => setBurnedDiaryDate(null)}
          />
        ) : null}
      </div>
    </main>
  );
}

type EmotionInputProps = {
  hasError: boolean;
  onChange: (value: string) => void;
  value: string;
};

function EmotionInput({ hasError, onChange, value }: EmotionInputProps) {
  return (
    <div className="flex size-full flex-col">
      <label className="sr-only" htmlFor="burn-emotion-input">
        소각할 내용
      </label>
      <textarea
        className={`min-h-0 flex-1 resize-none rounded-[15px] bg-transparent px-6 py-[22px] text-[15px] leading-6 text-foreground outline-none ${
          hasError ? "placeholder:text-red-500" : "placeholder:text-gray-400"
        }`}
        id="burn-emotion-input"
        onChange={(event) => onChange(event.target.value)}
        placeholder={
          hasError
            ? "소각 할 내용을 입력해주세요."
            : "소각할 내용을 작성해주세요."
        }
        value={value}
      />
    </div>
  );
}

type SelectedImagePreviewProps = {
  image: SelectedImage;
  onRemove: () => void;
};

function SelectedImagePreview({ image, onRemove }: SelectedImagePreviewProps) {
  return (
    <div className="relative mt-[26px] h-[97px] w-[102px] overflow-hidden rounded-[4px] border border-orange-400 bg-gray-100">
      <Image
        alt={`추가한 사진: ${image.name}`}
        className="object-cover"
        fill
        src={image.previewUrl}
        unoptimized
      />
      <button
        aria-label="추가한 사진 삭제"
        className="absolute right-[6px] top-[5px] flex size-[18px] items-center justify-center"
        onClick={onRemove}
        type="button"
      >
        <Image
          alt=""
          height={18}
          src="/figma/burn/image-remove.svg"
          width={18}
        />
      </button>
    </div>
  );
}

type DiarySelectProps = {
  days: DiaryCalendarDay[];
  diaries: DiarySummary[];
  onBurnedSelect: (entry: DiaryCalendarEntry) => void;
  onDiarySelect: (id: string) => void;
  onMonthChange: (month: string) => void;
  onSelect: (date: string | null) => void;
  selectedDate: string | null;
  selectedDiaryId: string | null;
  selectedMonth: string;
};

function DiarySelect({
  days,
  diaries,
  onBurnedSelect,
  onDiarySelect,
  onMonthChange,
  onSelect,
  selectedDate,
  selectedDiaryId,
  selectedMonth,
}: DiarySelectProps) {
  const calendarEntries = toDiaryCalendarEntries(days);
  const selectedDayEntries = toDiaryArchiveEntries(diaries);

  return (
    <div className="size-full pb-[92px]">
      <DiaryCalendar
        entries={calendarEntries}
        month={selectedMonth}
        monthOptions={CALENDAR_MONTHS}
        onBurnedSelect={onBurnedSelect}
        onMonthChange={onMonthChange}
        onSelect={onSelect}
        selectedDate={selectedDate}
      />

      {selectedDayEntries.length > 0 ? (
        <DiaryArchiveCard
          entries={selectedDayEntries}
          onSelect={onDiarySelect}
          selectedId={selectedDiaryId}
        />
      ) : null}
    </div>
  );
}

function CameraIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[21px]"
      fill="none"
      viewBox="0 0 21 21"
    >
      <path
        d="M7.1 5.2 8.4 3.5h4.2l1.3 1.7h2.6c1 0 1.8.8 1.8 1.8v8.1c0 1-.8 1.8-1.8 1.8h-12c-1 0-1.8-.8-1.8-1.8V7c0-1 .8-1.8 1.8-1.8h2.6Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle
        cx="10.5"
        cy="11.1"
        r="3.1"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
