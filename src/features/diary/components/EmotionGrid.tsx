import EmotionIcon from "@/features/diary/components/EmotionIcon";
import { EMOTIONS, type EmotionId } from "@/features/diary/constants";

type EmotionGridProps = {
  onSelect: (emotionId: EmotionId) => void;
  selectedEmotionId: EmotionId | null;
};

export default function EmotionGrid({
  onSelect,
  selectedEmotionId,
}: EmotionGridProps) {
  return (
    <div className="mx-auto grid w-[241px] grid-cols-3 gap-x-[37px] gap-y-[57px]">
      {EMOTIONS.map((emotion) => {
        const isSelected = selectedEmotionId === emotion.id;
        const isDimmed = selectedEmotionId !== null && !isSelected;

        return (
          <button
            aria-pressed={isSelected}
            className={`flex flex-col items-center justify-end gap-[6px] transition-[filter,opacity] duration-300 ${
              isDimmed ? "opacity-40 blur-[3px]" : "opacity-100 blur-0"
            }`}
            key={emotion.id}
            onClick={() => onSelect(emotion.id)}
            type="button"
          >
            <EmotionIcon emotion={emotion} />
            <span className="whitespace-nowrap text-base text-purple-500">
              {emotion.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
