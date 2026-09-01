import type { CSSProperties } from "react";

import type { EmotionChartItem } from "@/features/report/utils";
import { splitReportCopy } from "@/features/report/utils";

const CHART_COLORS = ["#ff9d58", "#fed7a5", "#feecd2", "#f3f3f3"];
const LABEL_RADIUS = 45;
const LABEL_STYLES = [
  "text-white",
  "text-[7px] text-foreground",
  "text-[5px] text-gray-500",
  "text-[4px] text-gray-500",
];

type EmotionSummarySectionProps = {
  chartItems: EmotionChartItem[];
  isLoading: boolean;
  summary: string | null;
};

export default function EmotionSummarySection({
  chartItems,
  isLoading,
  summary,
}: EmotionSummarySectionProps) {
  return (
    <section className="relative mt-[20px] pt-[18px]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[271px] bg-orange-100"
      />
      <div className="relative">
        <h2 className="text-center text-lg font-semibold leading-normal text-orange-400">
          리포트 요약
        </h2>
        <EmotionDonutChart items={chartItems} />
        <SummaryCard isLoading={isLoading} summary={summary} />
      </div>
    </section>
  );
}

function EmotionDonutChart({ items }: { items: EmotionChartItem[] }) {
  const background = createConicGradient(items);
  const labelPositions = createLabelPositions(items);

  return (
    <div
      className="relative mx-auto mt-[18px] size-[139px] rounded-full"
      style={{ background }}
    >
      <div className="absolute left-1/2 top-1/2 size-[42px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-100" />
      {items.map((item, index) =>
        item.percentage > 0 ? (
          <EmotionLabel
            className={LABEL_STYLES[index]}
            key={item.emotion}
            label={item.emotion}
            style={labelPositions[index]}
            value={`${item.percentage}%`}
            valueClassName={index === 0 ? "text-sm" : undefined}
          />
        ) : null,
      )}
    </div>
  );
}

type EmotionLabelProps = {
  className: string;
  label: string;
  style: CSSProperties;
  value: string;
  valueClassName?: string;
};

function EmotionLabel({
  className,
  label,
  style,
  value,
  valueClassName = "text-[9px]",
}: EmotionLabelProps) {
  return (
    <p
      className={`absolute -translate-x-1/2 -translate-y-1/2 text-center font-medium leading-normal ${className}`}
      style={style}
    >
      {label}
      <br />
      <span className={valueClassName}>{value}</span>
    </p>
  );
}

function createLabelPositions(items: EmotionChartItem[]): CSSProperties[] {
  let start = 0;

  return items.map((item) => {
    const middle = start + item.percentage / 2;
    const angle = (middle / 100) * Math.PI * 2 - Math.PI / 2;
    start += item.percentage;

    return {
      left: `calc(50% + ${Math.cos(angle) * LABEL_RADIUS}px)`,
      top: `calc(50% + ${Math.sin(angle) * LABEL_RADIUS}px)`,
    };
  });
}

function SummaryCard({
  isLoading,
  summary,
}: {
  isLoading: boolean;
  summary: string | null;
}) {
  const copy = splitReportCopy(summary);
  const title = isLoading
    ? "이번 주 마음을 살펴보고 있어요."
    : copy.title || "이번 주 리포트가 아직 준비되지 않았어요.";
  const body = isLoading
    ? "기록된 감정을 바탕으로 리포트를 불러오고 있어요."
    : copy.body ||
      copy.title ||
      "작성된 일기가 쌓이면 요약을 확인할 수 있어요.";

  return (
    <article className="mx-6 mt-[22px] min-h-[185px] rounded-lg border border-gray-200 bg-background px-[26px] py-[26px] shadow-[0_4px_20px_rgba(18,18,18,0.05)]">
      <h3 className="break-words text-base font-medium leading-6">{title}</h3>
      <p className="mt-[7px] whitespace-pre-line break-words text-sm leading-[18px] text-gray-500">
        {body}
      </p>
    </article>
  );
}

function createConicGradient(items: EmotionChartItem[]): string {
  if (items.length === 0) {
    return "#f3f3f3";
  }

  let start = 0;
  const stops = items.map((item, index) => {
    const end = start + item.percentage;
    const stop = `${CHART_COLORS[index]} ${start}% ${end}%`;
    start = end;
    return stop;
  });

  if (start < 100) {
    stops.push(`#f3f3f3 ${start}% 100%`);
  }

  return `conic-gradient(${stops.join(",")})`;
}
