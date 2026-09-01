"use client";

import { useEffect, useState } from "react";

import {
  generateNextWeekFlow,
  generateWeeklyReport,
  getNextWeekFlow,
  getReportBurnings,
  getReportEmotionStats,
  getReportNextWeekFlow,
  getWeeklyReport,
  getWeeklyReportPeriods,
  getWeeklyReportSummary,
} from "@/features/report/api/reports";
import type {
  WeeklyReportPeriod,
  WeeklyReportView,
} from "@/features/report/types";
import { getCurrentWeekStart } from "@/features/report/utils";

const REPORT_POLL_INTERVAL_MS = 2000;

type WeeklyReportState = {
  error: string | null;
  isLoading: boolean;
  periods: WeeklyReportPeriod[];
  report: WeeklyReportView | null;
  selectedIndex: number;
};

export function useWeeklyReport() {
  const [state, setState] = useState<WeeklyReportState>({
    error: null,
    isLoading: true,
    periods: [],
    report: null,
    selectedIndex: 0,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadPeriods = async () => {
      try {
        let periods = await getWeeklyReportPeriods(controller.signal);

        if (periods.length === 0) {
          const created = await generateWeeklyReport(getCurrentWeekStart());
          periods = [
            {
              generationStatus: created.generationStatus,
              periodEnd: created.periodEnd,
              periodStart: created.periodStart,
              reportId: created.emotionReportId,
            },
          ];
        }

        setState((current) => ({
          ...current,
          isLoading: true,
          periods,
        }));
      } catch (error) {
        if (!controller.signal.aborted) {
          setState((current) => ({
            ...current,
            error: getErrorMessage(error),
            isLoading: false,
          }));
        }
      }
    };

    void loadPeriods();

    return () => controller.abort();
  }, []);

  const selectedPeriod = state.periods[selectedIndex] ?? null;
  const selectedPeriodStart = selectedPeriod?.periodStart ?? null;
  const selectedReportId = selectedPeriod?.reportId ?? null;

  useEffect(() => {
    if (!selectedPeriodStart || !selectedReportId) {
      return;
    }

    const controller = new AbortController();
    setState((current) => ({
      ...current,
      error: null,
      isLoading: true,
      report: null,
      selectedIndex,
    }));

    const loadReport = async () => {
      try {
        let summary = await getWeeklyReport(
          selectedPeriodStart,
          controller.signal,
        );

        while (
          !controller.signal.aborted &&
          (summary.generationStatus === "PENDING" ||
            summary.generationStatus === "PROCESSING")
        ) {
          await waitForNextPoll(controller.signal);

          if (controller.signal.aborted) {
            return;
          }

          summary = await getWeeklyReportSummary(
            summary.summaryId,
            controller.signal,
          );
        }

        if (controller.signal.aborted) {
          return;
        }

        const [emotionStats, burnings, existingNextWeekFlow] =
          await Promise.all([
            getReportEmotionStats(selectedReportId, controller.signal),
            getReportBurnings(selectedReportId, controller.signal),
            getReportNextWeekFlow(selectedReportId, controller.signal),
          ]);
        let nextWeekFlow = existingNextWeekFlow;

        if (!nextWeekFlow && summary.generationStatus !== "FAILED") {
          const startedFlow = await generateNextWeekFlow(selectedPeriodStart);
          nextWeekFlow = await getNextWeekFlow(
            startedFlow.flowId,
            controller.signal,
          );

          while (
            !controller.signal.aborted &&
            nextWeekFlow.generationStatus === "PROCESSING"
          ) {
            await waitForNextPoll(controller.signal);

            if (controller.signal.aborted) {
              return;
            }

            nextWeekFlow = await getNextWeekFlow(
              startedFlow.flowId,
              controller.signal,
            );
          }
        }

        setState((current) => ({
          ...current,
          error: null,
          isLoading: false,
          report: {
            burnCount: burnings.length,
            emotionStats,
            nextWeekFlow,
            summary,
          },
        }));
      } catch (error) {
        if (!controller.signal.aborted) {
          setState((current) => ({
            ...current,
            error: getErrorMessage(error),
            isLoading: false,
          }));
        }
      }
    };

    void loadReport();
    return () => controller.abort();
  }, [selectedIndex, selectedPeriodStart, selectedReportId]);

  return {
    ...state,
    canMoveNext: selectedIndex > 0,
    canMovePrevious: selectedIndex < state.periods.length - 1,
    moveNext: () => setSelectedIndex((index) => Math.max(0, index - 1)),
    movePrevious: () =>
      setSelectedIndex((index) =>
        Math.min(state.periods.length - 1, index + 1),
      ),
    selectedPeriod,
  };
}

function waitForNextPoll(signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(resolve, REPORT_POLL_INTERVAL_MS);

    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "리포트를 불러오지 못했어요.";
}
