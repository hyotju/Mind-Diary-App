import { isAxiosError } from "axios";

import type { PresignedUpload } from "@/features/diary/types";
import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/api";

export const MAX_DIARY_IMAGE_BYTES = 10 * 1024 * 1024;
export const SUPPORTED_DIARY_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export class DiaryUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DiaryUploadError";
  }
}

export function validateDiaryImage(file: File): void {
  if (
    !SUPPORTED_DIARY_IMAGE_TYPES.includes(
      file.type as (typeof SUPPORTED_DIARY_IMAGE_TYPES)[number],
    )
  ) {
    throw new DiaryUploadError(
      "JPG, PNG, WebP 형식의 사진만 첨부할 수 있어요.",
    );
  }

  if (file.size > MAX_DIARY_IMAGE_BYTES) {
    throw new DiaryUploadError("사진 한 장의 크기는 10MB 이하여야 해요.");
  }
}

export async function uploadDiaryFiles(files: File[]): Promise<string[]> {
  const uploadedIds: string[] = [];

  try {
    for (const file of files) {
      validateDiaryImage(file);
      const upload = await issueUploadUrl(file);

      try {
        await putFile(upload.uploadUrl, file);
        uploadedIds.push(upload.uploadId);
      } catch (error) {
        await deleteUploadQuietly(upload.uploadId);
        throw error;
      }
    }

    return uploadedIds;
  } catch (error) {
    await cleanupDiaryUploads(uploadedIds);
    throw error;
  }
}

export async function cleanupDiaryUploads(uploadIds: string[]): Promise<void> {
  await Promise.all(uploadIds.map(deleteUploadQuietly));
}

async function issueUploadUrl(file: File): Promise<PresignedUpload> {
  try {
    const response = await apiClient.post<ApiResponse<PresignedUpload>>(
      "/api/uploads/presigned-url",
      { contentType: file.type, fileSize: file.size },
    );
    const payload = response.data;

    if (!payload.success || !payload.data) {
      throw new DiaryUploadError(
        payload.message || "사진 업로드를 준비하지 못했어요.",
      );
    }

    return payload.data;
  } catch (error) {
    if (error instanceof DiaryUploadError) {
      throw error;
    }

    if (isAxiosError<ApiResponse>(error)) {
      throw new DiaryUploadError(
        error.response?.data?.message || "사진 업로드를 준비하지 못했어요.",
      );
    }

    throw new DiaryUploadError("사진 업로드를 준비하지 못했어요.");
  }
}

async function putFile(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    body: file,
    headers: { "Content-Type": file.type },
    method: "PUT",
  });

  if (!response.ok) {
    throw new DiaryUploadError("사진을 업로드하지 못했어요.");
  }
}

async function deleteUploadQuietly(uploadId: string): Promise<void> {
  try {
    await apiClient.delete(`/api/uploads/${uploadId}`);
  } catch {
    // Unbound uploads expire server-side; cleanup failure must not mask the original error.
  }
}
