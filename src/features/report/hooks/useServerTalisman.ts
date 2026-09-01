"use client";

import { useEffect, useState } from "react";

import { getBurningDetail } from "@/features/burn/api/burnings";
import type { GeneratedTalisman } from "@/features/burn/types";
import { toGeneratedTalisman } from "@/features/burn/utils";

type ServerTalismanState = {
  error: string | null;
  isLoading: boolean;
  talisman: GeneratedTalisman | null;
};

export function useServerTalisman(
  burningId: number,
  talismanId: number,
): ServerTalismanState {
  const [state, setState] = useState<ServerTalismanState>({
    error: null,
    isLoading: true,
    talisman: null,
  });

  useEffect(() => {
    let isActive = true;

    void getBurningDetail(burningId)
      .then((detail) => {
        if (!isActive) {
          return;
        }

        const talisman = toGeneratedTalisman(detail, talismanId);

        setState({
          error: talisman ? null : "부적 정보가 아직 완성되지 않았어요.",
          isLoading: false,
          talisman,
        });
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }

        setState({
          error:
            error instanceof Error
              ? error.message
              : "부적 정보를 불러오지 못했어요.",
          isLoading: false,
          talisman: null,
        });
      });

    return () => {
      isActive = false;
    };
  }, [burningId, talismanId]);

  return state;
}
