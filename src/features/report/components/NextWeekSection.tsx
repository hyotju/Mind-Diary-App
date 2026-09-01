import type { NextWeekFlowStatus } from "@/features/report/types";

type NextWeekSectionProps = {
  advice: string | null;
  generationStatus: NextWeekFlowStatus | null;
  isLoading: boolean;
  title: string | null;
};

export default function NextWeekSection({
  advice,
  isLoading,
  generationStatus,
  title,
}: NextWeekSectionProps) {
  const isGenerating = isLoading || generationStatus === "PROCESSING";

  const displayTitle = isGenerating
    ? "다음 주 흐름을 살펴보고 있어요."
    : title || "다음 주 흐름이 아직 준비되지 않았어요.";

  const body = isGenerating
    ? "분석이 완료되면 다음 주를 위한 조언을 확인할 수 있어요."
    : advice || "이번 주 리포트가 완성되면 확인할 수 있어요.";
  return (
    <section className="px-6 pt-[31px]">
      <h2 className="text-xl font-medium leading-normal">다음주 흐름</h2>
      <article className="mt-3 min-h-[229px] rounded-lg border border-gray-200 bg-background px-[25px] py-[29px] shadow-[0_4px_20px_rgba(18,18,18,0.05)]">
        <h3 className="text-lg font-medium leading-[22px]">{title}</h3>
        <p className="mt-[15px] whitespace-pre-line text-sm leading-[22px] text-gray-500">
          {body}
        </p>
      </article>
    </section>
  );
}
