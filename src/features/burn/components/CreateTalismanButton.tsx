"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BurningApiError,
  createTalisman,
  getBurningDetail,
} from "@/features/burn/api/burnings";
import {
  GENERATED_TALISMAN_STORAGE_KEY,
  getPendingBurningId,
  TALISMAN_RETURN_PATH_STORAGE_KEY,
  toGeneratedTalisman,
} from "@/features/burn/utils";
import {
  getTalisman,
  TalismanApiError,
} from "@/features/report/api/talismans";

const TALISMAN_POLL_INTERVAL_MS = 1000;
const TALISMAN_POLL_LIMIT = 30;

type CreateTalismanButtonProps = {
  burningId?: number;
  returnHref?: string;
};

export default function CreateTalismanButton({
  burningId: providedBurningId,
  returnHref,
}: CreateTalismanButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    const burningId = providedBurningId ?? getPendingBurningId();

    if (!burningId) {
      setError("소각 정보를 찾지 못했어요. 다시 소각해 주세요.");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      let talismanId: number | undefined;

      try {
        const result = await createTalisman(burningId);
        talismanId = result.talisman?.talismanId;

        if (result.talisman?.generationStatus === "FAILED") {
          throw new BurningApiError("부적 생성에 실패했어요. 다시 시도해 주세요.");
        }

        if (talismanId) {
          await waitForTalismanCompletion(talismanId);
        }
      } catch (createError) {
        if (
          !(createError instanceof BurningApiError) ||
          createError.code !== "TALISMAN_409"
        ) {
          throw createError;
        }
      }

      const detail = await getBurningDetail(burningId);
      const talisman = toGeneratedTalisman(detail, talismanId);

      if (!talisman) {
        throw new BurningApiError("완성된 부적 정보를 확인하지 못했어요.");
      }

      sessionStorage.setItem(
        GENERATED_TALISMAN_STORAGE_KEY,
        JSON.stringify(talisman),
      );
      if (returnHref) {
        sessionStorage.setItem(TALISMAN_RETURN_PATH_STORAGE_KEY, returnHref);
      } else {
        sessionStorage.removeItem(TALISMAN_RETURN_PATH_STORAGE_KEY);
      }
      router.push("/burn/talisman");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "부적을 생성하지 못했어요.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <button
        className="flex h-[57px] w-full items-center justify-center rounded-lg bg-orange-500 text-xl font-semibold leading-[23px] text-white active:opacity-90 disabled:opacity-60"
        disabled={isCreating}
        onClick={handleCreate}
        type="button"
      >
        {isCreating ? "부적 생성 중" : "부적 생성하기"}
      </button>
      {error ? (
        <p className="mt-2 text-center text-[13px] text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

async function waitForTalismanCompletion(talismanId: number): Promise<void> {
  for (let attempt = 0; attempt < TALISMAN_POLL_LIMIT; attempt += 1) {
    try {
      const talisman = await getTalisman(talismanId);

      if (talisman.generationStatus === "COMPLETED") {
        return;
      }

      if (talisman.generationStatus === "FAILED") {
        throw new BurningApiError("부적 생성에 실패했어요. 다시 시도해 주세요.");
      }
    } catch (error) {
      const isPendingNotFound =
        error instanceof TalismanApiError && error.status === 404;

      if (!isPendingNotFound) {
        throw error;
      }
    }

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, TALISMAN_POLL_INTERVAL_MS);
    });
  }

  throw new BurningApiError(
    "부적 생성이 지연되고 있어요. 잠시 후 다시 확인해 주세요.",
  );
}
