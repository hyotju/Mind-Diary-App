"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { createDiary, updateDiary } from "@/features/diary/api/diaries";
import {
  cleanupDiaryUploads,
  uploadDiaryFiles,
  validateDiaryImage,
} from "@/features/diary/api/uploads";
import DiaryExitDialog from "@/features/diary/components/DiaryExitDialog";
import DiaryImageThumbnail from "@/features/diary/components/DiaryImageThumbnail";
import EmotionAvatar from "@/features/diary/components/EmotionAvatar";
import EmotionReselectPopover from "@/features/diary/components/EmotionReselectPopover";
import {
  DIARY_PLACEHOLDER_PROMPTS,
  EMOTIONS,
  type EmotionId,
} from "@/features/diary/constants";
import { useDiaryDetail } from "@/features/diary/hooks/useDiaryDetail";
import type { EditableDiaryImage } from "@/features/diary/types";
import {
  getCurrentTimeLabel,
  getDiaryShortDateParts,
  getTodayDateString,
  pickBySeed,
  toDiaryEmotionCode,
  toEmotionId,
} from "@/features/diary/utils";
import { useDiaryDraftStore } from "@/store/useDiaryDraftStore";

const TODAY = getTodayDateString();
const MAX_IMAGES = 3;
const MAX_LENGTH = 1000;
const IMAGE_LIMIT_MESSAGE = "사진은 최대 3장까지 첨부 가능합니다.";

export default function DiaryWriteScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const diaryDate = searchParams.get("date") ?? TODAY;
  const editEntryId = searchParams.get("id");
  const parsedEditEntryId = editEntryId ? Number(editEntryId) : null;
  const editDiaryId =
    parsedEditEntryId && Number.isInteger(parsedEditEntryId)
      ? parsedEditEntryId
      : null;
  const { diary: diaryForEdit, error: detailError } = useDiaryDetail(
    editDiaryId,
    { pollAnalysis: false },
  );
  const initialEmotionId =
    EMOTIONS.find((emotion) => emotion.id === searchParams.get("emotion"))
      ?.id ?? EMOTIONS[0].id;
  const placeholder = pickBySeed(DIARY_PLACEHOLDER_PROMPTS, diaryDate);
  const { datePart, weekdayPart } = getDiaryShortDateParts(diaryDate);
  const [emotionId, setEmotionId] = useState<EmotionId>(initialEmotionId);
  const [isEmotionPopoverOpen, setIsEmotionPopoverOpen] = useState(false);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<EditableDiaryImage[]>([]);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const selectedEmotion =
    EMOTIONS.find((emotion) => emotion.id === emotionId) ?? EMOTIONS[0];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const limitMessageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const saveDraft = useDiaryDraftStore((state) => state.saveDraft);
  const removeDraft = useDiaryDraftStore((state) => state.removeDraft);
  const imagesRef = useRef<EditableDiaryImage[]>(images);
  const hasInitializedEditRef = useRef(false);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    if (!diaryForEdit || hasInitializedEditRef.current) {
      return;
    }

    hasInitializedEditRef.current = true;
    setContent(diaryForEdit.content);
    setEmotionId(toEmotionId(diaryForEdit.selectedEmotion));
    setImages(
      [...diaryForEdit.images]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((image) => ({
          kind: "existing" as const,
          uploadId: image.uploadId,
          url: image.url,
        })),
    );
  }, [diaryForEdit]);

  useEffect(() => {
    return () => {
      if (limitMessageTimeoutRef.current) {
        clearTimeout(limitMessageTimeoutRef.current);
      }

      for (const image of imagesRef.current) {
        if (image.kind === "new") {
          URL.revokeObjectURL(image.url);
        }
      }
    };
  }, []);

  useEffect(() => {
    // localStorage-backed store: only knowable client-side, so this reads it
    // after mount instead of during render to avoid an SSR hydration mismatch.
    const existingDraft = editDiaryId
      ? undefined
      : useDiaryDraftStore.getState().drafts[diaryDate];

    if (existingDraft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from an external store (localStorage) that isn't available during render
      setIsResumeDialogOpen(true);
    }
  }, [diaryDate, editDiaryId]);

  const isSaveEnabled =
    content.trim().length > 0 &&
    !isSaving &&
    (!editDiaryId || Boolean(diaryForEdit));

  const showLimitMessage = (message = IMAGE_LIMIT_MESSAGE) => {
    setLimitMessage(message);

    if (limitMessageTimeoutRef.current) {
      clearTimeout(limitMessageTimeoutRef.current);
    }

    limitMessageTimeoutRef.current = setTimeout(() => {
      setLimitMessage(null);
    }, 2500);
  };

  const handleCameraClick = () => {
    if (images.length >= MAX_IMAGES) {
      showLimitMessage();
      return;
    }

    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const remainingSlots = MAX_IMAGES - images.length;

    if (files.length > remainingSlots) {
      showLimitMessage();
    }

    const newImages: EditableDiaryImage[] = [];

    for (const file of Array.from(files).slice(0, remainingSlots)) {
      try {
        validateDiaryImage(file);
        newImages.push({
          file,
          id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
          kind: "new",
          url: URL.createObjectURL(file),
        });
      } catch (error) {
        showLimitMessage(
          error instanceof Error ? error.message : "사진을 첨부할 수 없어요.",
        );
      }
    }

    setImages((current) => [...current, ...newImages]);
    event.target.value = "";
  };

  const handleRemoveImage = (id: string) => {
    setImages((current) => {
      const target = current.find((image) => getEditableImageId(image) === id);

      if (target?.kind === "new") {
        URL.revokeObjectURL(target.url);
      }

      return current.filter((image) => getEditableImageId(image) !== id);
    });
  };

  const handleConfirmEmotion = (nextEmotionId: EmotionId) => {
    setEmotionId(nextEmotionId);
    setIsEmotionPopoverOpen(false);
  };

  const goToEmotionScreen = () => {
    router.push(`/diary/new/emotion?date=${diaryDate}`);
  };

  const handleBackClick = () => {
    const hasUnsavedContent = content.length > 0 || images.length > 0;

    if (hasUnsavedContent) {
      setIsExitDialogOpen(true);
      return;
    }

    goToEmotionScreen();
  };

  const handleExitWithoutSaving = () => {
    setIsExitDialogOpen(false);
    goToEmotionScreen();
  };

  const handleSaveDraftAndExit = () => {
    saveDraft(diaryDate, { content, emotionId });
    setIsExitDialogOpen(false);
    router.push("/");
  };

  const handleStartFresh = () => {
    removeDraft(diaryDate);
    setIsResumeDialogOpen(false);
  };

  const handleResumeDraft = () => {
    const draft = useDiaryDraftStore.getState().drafts[diaryDate];

    if (draft) {
      setContent(draft.content);
      setEmotionId(draft.emotionId);
    }

    setIsResumeDialogOpen(false);
  };

  const handleSave = async () => {
    if (!isSaveEnabled) {
      return;
    }

    setIsSaving(true);
    let newUploadIds: string[] = [];

    try {
      const newFiles = images.flatMap((image) =>
        image.kind === "new" ? [image.file] : [],
      );
      newUploadIds = await uploadDiaryFiles(newFiles);
      let newUploadIndex = 0;
      const imageUploadIds = images.map((image) => {
        if (image.kind === "existing") {
          return image.uploadId;
        }

        const uploadId = newUploadIds[newUploadIndex];
        newUploadIndex += 1;
        return uploadId;
      });

      const savedDiary = editDiaryId
        ? await updateDiary(editDiaryId, {
            content: content.trim(),
            imageUploadIds,
            selectedEmotion: toDiaryEmotionCode(emotionId),
          })
        : await createDiary({
            content: content.trim(),
            imageUploadIds,
            recordedDate: diaryDate,
            selectedEmotion: toDiaryEmotionCode(emotionId),
          });

      removeDraft(diaryDate);
      router.push(
        `/diary/new/complete?id=${savedDiary.diaryId}${editDiaryId ? "" : "&created=1"}`,
      );
    } catch (error) {
      await cleanupDiaryUploads(newUploadIds);
      window.alert(
        error instanceof Error ? error.message : "일기를 저장하지 못했어요.",
      );
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-dvh bg-gray-100 text-foreground">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[395px] flex-col bg-background px-6 pb-[calc(42px+env(safe-area-inset-bottom))] pt-[28px]">
        <header className="grid grid-cols-[28px_1fr_28px] items-center">
          <button
            aria-label="감정 선택 화면으로 돌아가기"
            className="flex size-7 items-center justify-center"
            onClick={handleBackClick}
            type="button"
          >
            <BackIcon />
          </button>
          <h1 className="text-center text-xl font-medium leading-[23px] text-foreground">
            일기
          </h1>
        </header>

        <div className="relative mt-[25px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              aria-expanded={isEmotionPopoverOpen}
              aria-label="감정 다시 선택하기"
              className="block shrink-0 appearance-none p-0"
              onClick={() => setIsEmotionPopoverOpen(true)}
              type="button"
            >
              <EmotionAvatar emotion={selectedEmotion} />
            </button>
            <div className="flex w-[150px] flex-col gap-0.5">
              <p className="flex items-center gap-[9px] whitespace-nowrap text-lg text-foreground">
                <span>{datePart}</span>
                <span>{weekdayPart}</span>
              </p>
              <p className="text-sm text-gray-500">{getCurrentTimeLabel()}</p>
            </div>
          </div>

          <button
            aria-label="사진 촬영 또는 선택"
            className="flex size-[37px] shrink-0 items-center justify-center rounded-full bg-orange-400 text-white transition-opacity active:opacity-80"
            onClick={handleCameraClick}
            type="button"
          >
            <CameraIcon />
          </button>
          <input
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />

          {isEmotionPopoverOpen ? (
            <EmotionReselectPopover
              currentEmotionId={emotionId}
              onClose={() => setIsEmotionPopoverOpen(false)}
              onConfirm={handleConfirmEmotion}
            />
          ) : null}
        </div>

        <div className="relative mt-[37px] h-[402px] w-full rounded-[15px] border-[0.5px] border-gray-200 bg-background shadow-[0_4px_20px_rgba(18,18,18,0.05)]">
          <label className="sr-only" htmlFor="diary-content">
            일기 내용
          </label>
          <textarea
            className="size-full resize-none rounded-[15px] bg-transparent px-[31px] pb-[45px] pt-[30px] text-[15px] leading-[22px] text-foreground outline-none placeholder:text-gray-400"
            id="diary-content"
            maxLength={MAX_LENGTH}
            onChange={(event) => setContent(event.target.value)}
            placeholder={placeholder}
            value={content}
          />
          <span className="pointer-events-none absolute bottom-[20px] right-[31px] text-[12px] text-gray-400">
            {content.length} / {MAX_LENGTH}자
          </span>
        </div>

        {images.length > 0 ? (
          <div className="mt-[28px] flex gap-3">
            {images.map((image) => (
              <DiaryImageThumbnail
                alt="첨부한 사진"
                key={getEditableImageId(image)}
                onRemove={() => handleRemoveImage(getEditableImageId(image))}
                src={image.url}
              />
            ))}
          </div>
        ) : null}

        <button
          className={`mt-[30px] flex h-[57px] w-full items-center justify-center rounded-lg text-xl font-semibold leading-[23px] transition-colors ${
            isSaveEnabled
              ? "bg-orange-500 text-white active:opacity-90"
              : "bg-gray-200 text-gray-400"
          }`}
          disabled={!isSaveEnabled}
          onClick={() => void handleSave()}
          type="button"
        >
          {isSaving ? "저장 중" : "저장"}
        </button>

        {detailError ? (
          <p className="mt-3 text-center text-sm text-red-500" role="alert">
            {detailError}
          </p>
        ) : null}

        {limitMessage ? (
          <p
            className="pointer-events-none absolute bottom-[calc(110px+env(safe-area-inset-bottom))] left-1/2 w-[calc(100%-48px)] max-w-[347px] -translate-x-1/2 rounded-lg bg-[rgba(18,18,18,0.8)] px-4 py-3 text-center text-[13px] text-white"
            role="alert"
          >
            {limitMessage}
          </p>
        ) : null}

        {isExitDialogOpen ? (
          <DiaryExitDialog
            description="언제든 이어서 작성할 수 있습니다."
            onClose={() => setIsExitDialogOpen(false)}
            onPrimary={handleSaveDraftAndExit}
            onSecondary={handleExitWithoutSaving}
            primaryLabel="임시 저장"
            secondaryLabel="나가기"
            title="일기를 임시 저장할까요?"
          />
        ) : null}

        {isResumeDialogOpen ? (
          <DiaryExitDialog
            description="새로 작성하면 기존 임시 저장 내용은 삭제됩니다."
            onClose={() => setIsResumeDialogOpen(false)}
            onPrimary={handleResumeDraft}
            onSecondary={handleStartFresh}
            primaryLabel="이어서 작성"
            secondaryLabel="새로 작성"
            title="임시 저장된 일기가 있어요."
          />
        ) : null}
      </div>
    </main>
  );
}

function getEditableImageId(image: EditableDiaryImage): string {
  return image.kind === "existing" ? image.uploadId : image.id;
}

function BackIcon() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 28 28">
      <path
        d="M17 7 10 14l7 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
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
