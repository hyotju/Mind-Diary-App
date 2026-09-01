"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { MAIN_NAVIGATION_ITEMS } from "@/constants/navigation";
import { createBurning } from "@/features/burn/api/burnings";
import { deleteDiary } from "@/features/diary/api/diaries";
import BurnSuggestionDialog from "@/features/diary/components/BurnSuggestionDialog";
import DiaryExitDialog from "@/features/diary/components/DiaryExitDialog";
import EmotionAvatar from "@/features/diary/components/EmotionAvatar";
import PageHeader from "@/features/diary/components/PageHeader";
import { COMFORT_MESSAGE_MASCOT, EMOTIONS } from "@/features/diary/constants";
import { useDiaryDetail } from "@/features/diary/hooks/useDiaryDetail";
import {
  getDiaryShortDateParts,
  getTodayDateString,
  toEmotionId,
} from "@/features/diary/utils";
import { useDiaryDraftStore } from "@/store/useDiaryDraftStore";

const TODAY = getTodayDateString();

export default function DiaryCompleteScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parsedDiaryId = Number(searchParams.get("id"));
  const diaryId =
    Number.isInteger(parsedDiaryId) && parsedDiaryId > 0 ? parsedDiaryId : null;
  const isNewlyCreated = searchParams.get("created") === "1";
  const { diary, error: detailError, isLoading } = useDiaryDetail(diaryId);
  const diaryDate = diary?.recordedDate ?? TODAY;
  const emotionId = diary ? toEmotionId(diary.selectedEmotion) : EMOTIONS[0].id;
  const selectedEmotion =
    EMOTIONS.find((emotion) => emotion.id === emotionId) ?? EMOTIONS[0];
  const { datePart, weekdayPart } = getDiaryShortDateParts(diaryDate);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBurnSuggestionOpen, setIsBurnSuggestionOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleEdit = () => {
    if (diary) {
      router.push(
        `/diary/new/write?date=${diary.recordedDate}&emotion=${selectedEmotion.id}&id=${diary.diaryId}`,
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!diary || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setActionError(null);

    try {
      await deleteDiary(diary.diaryId);
      useDiaryDraftStore.getState().removeDraft(diary.recordedDate);
      setIsDeleteDialogOpen(false);
      router.push("/diary");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "일기를 삭제하지 못했어요.",
      );
      setIsDeleteDialogOpen(false);
      setIsDeleting(false);
    }
  };

  const handleBurnFromSuggestion = async () => {
    if (!diary) {
      return;
    }

    try {
      const response = await createBurning({
        diaryId: diary.diaryId,
        sourceType: "DIARY",
      });

      sessionStorage.setItem(
        "maeum-bujeok:pending-burn",
        JSON.stringify({
          burningId: response.burningId,
          content: diary.content,
          diaryId: diary.diaryId,
          imageName: null,
          recordedDate: diary.recordedDate,
          type: "diary",
        }),
      );
      setIsBurnSuggestionOpen(false);
      router.push("/burn/result");
    } catch (error) {
      setIsBurnSuggestionOpen(false);
      setActionError(
        error instanceof Error ? error.message : "소각을 시작하지 못했어요.",
      );
    }
  };

  const handleComplete = () => {
    const shouldSuggestBurning =
      isNewlyCreated &&
      diary?.status === "STORED" &&
      diary.analysis?.salpuriRecommended === true;

    if (shouldSuggestBurning) {
      setIsBurnSuggestionOpen(true);
      return;
    }

    router.push("/diary");
  };

  const handleBurnLater = () => {
    setIsBurnSuggestionOpen(false);
    router.push("/diary");
  };

  const comfortMessage =
    diary?.analysis?.empathyResponse ??
    (isLoading
      ? "일기를 불러오고 있어요."
      : "마음의 흐름을 천천히 살펴보고 있어요.");
  const summary =
    diary?.analysis?.summary ??
    (isLoading
      ? "작성한 일기를 확인하고 있어요."
      : "감정 분석이 진행 중이에요. 잠시 후 다시 확인해 주세요.");

  return (
    <main className="min-h-dvh bg-gray-100 text-foreground">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[395px] flex-col bg-background px-6 pb-[calc(126px+env(safe-area-inset-bottom))] pt-[28px]">
        <PageHeader
          backLabel="일기 목록으로 돌아가기"
          onBack={() => router.push("/diary")}
          title="일기"
        />

        <div className="mt-[25px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EmotionAvatar emotion={selectedEmotion} />
            <p className="flex items-center gap-[9px] whitespace-nowrap text-lg text-foreground">
              <span>{datePart}</span>
              <span>{weekdayPart}</span>
            </p>
          </div>

          <div className="inline-flex items-center gap-2">
            <button
              aria-label="일기 수정하기"
              className="relative size-7"
              disabled={!diary || diary.status === "BURNED"}
              onClick={handleEdit}
              type="button"
            >
              <Image
                alt=""
                className="absolute left-1/2 top-[3.5px] -translate-x-1/2"
                height={24.2835}
                src="/images/diary/icons/edit.svg"
                width={21}
              />
            </button>
            <button
              aria-label="일기 삭제하기"
              className="relative size-7"
              disabled={!diary || isDeleting}
              onClick={() => setIsDeleteDialogOpen(true)}
              type="button"
            >
              <Image
                alt=""
                className="absolute inset-0"
                height={28}
                src="/images/diary/icons/trash.svg"
                width={28}
              />
            </button>
          </div>
        </div>

        <section className="-mx-6 mt-[25px] bg-orange-100 pb-[72px] pt-[59px] text-center">
          <div className="relative flex justify-center">
            <Image
              alt=""
              className="pointer-events-none absolute left-1/2 top-1/2 z-0"
              height={233}
              src="/images/diary/mascots/mascot-glow.svg"
              style={{
                transform: "translate(calc(-50% - 4.5px), calc(-50% + 7.4px))",
              }}
              width={233}
            />
            <Image
              alt=""
              className="relative z-10"
              height={COMFORT_MESSAGE_MASCOT.height}
              src={COMFORT_MESSAGE_MASCOT.src}
              width={COMFORT_MESSAGE_MASCOT.width}
            />
          </div>
          <p className="mt-9 whitespace-pre-line px-11 text-sm font-medium leading-5 text-foreground">
            {comfortMessage}
          </p>
        </section>

        <section className="-mt-11 rounded-lg border border-gray-200 bg-background px-5 py-4 shadow-[0_4px_20px_rgba(18,18,18,0.12)]">
          <p className="text-[13px] leading-5 text-foreground">
            <span className="text-orange-500">{summary}</span>
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-medium text-foreground">저장된 일기</h2>
          <div className="mt-3 rounded-lg border border-gray-200 bg-background px-6 py-5 shadow-[0_4px_20px_rgba(18,18,18,0.12)]">
            <p className="whitespace-pre-line text-[15px] leading-[22px] text-foreground">
              {diary?.content ?? "저장된 일기 내용을 불러오고 있어요."}
            </p>

            {diary && diary.images.length > 0 ? (
              <div className="mt-5 flex flex-col gap-3">
                {[...diary.images]
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((image) => (
                    // eslint-disable-next-line @next/next/no-img-element -- the API returns short-lived private image URLs
                    <img
                      alt="첨부한 사진"
                      className="h-[277px] w-full rounded-xl object-cover object-bottom"
                      key={image.uploadId}
                      src={image.url}
                    />
                  ))}
              </div>
            ) : null}
          </div>
        </section>

        <button
          className="mt-8 flex h-[57px] w-full items-center justify-center rounded-lg bg-orange-500 text-xl font-semibold leading-[23px] text-white transition-opacity active:opacity-90"
          onClick={handleComplete}
          type="button"
        >
          확인
        </button>

        {detailError || actionError ? (
          <p className="mt-3 text-center text-sm text-red-500" role="alert">
            {detailError ?? actionError}
          </p>
        ) : null}

        <BottomNavigation activeValue="diary" items={MAIN_NAVIGATION_ITEMS} />

        {isDeleteDialogOpen ? (
          <DiaryExitDialog
            description="삭제한 일기는 복구할 수 없어요."
            onClose={() => setIsDeleteDialogOpen(false)}
            onPrimary={() => void handleConfirmDelete()}
            onSecondary={() => setIsDeleteDialogOpen(false)}
            primaryLabel="삭제하기"
            secondaryLabel="취소"
            title="일기를 삭제할까요?"
          />
        ) : null}

        {isBurnSuggestionOpen ? (
          <BurnSuggestionDialog
            onBurn={() => void handleBurnFromSuggestion()}
            onClose={() => setIsBurnSuggestionOpen(false)}
            onLater={handleBurnLater}
          />
        ) : null}
      </div>
    </main>
  );
}
