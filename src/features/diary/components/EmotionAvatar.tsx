import EmotionIcon from "@/features/diary/components/EmotionIcon";
import type { EmotionOption } from "@/features/diary/constants";

const AVATAR_SIZE = 44;
const ICON_TARGET_SIZE = 28;

type EmotionAvatarProps = {
  emotion: EmotionOption;
};

export default function EmotionAvatar({ emotion }: EmotionAvatarProps) {
  const scale = ICON_TARGET_SIZE / Math.max(emotion.boxWidth, emotion.boxHeight);

  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-200 shadow-[0_4px_20px_rgba(18,18,18,0.05)]"
      style={{ height: AVATAR_SIZE, width: AVATAR_SIZE }}
    >
      <EmotionIcon emotion={emotion} scale={scale} />
    </span>
  );
}
