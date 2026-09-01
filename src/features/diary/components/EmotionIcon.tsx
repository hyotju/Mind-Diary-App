import Image from "next/image";
import type { EmotionOption } from "@/features/diary/constants";

type EmotionIconProps = {
  emotion: EmotionOption;
  /** 전체 레이어 크기/좌표에 곱해지는 배율. 기본값 1(원본 크기). */
  scale?: number;
};

export default function EmotionIcon({ emotion, scale = 1 }: EmotionIconProps) {
  return (
    <span
      className="relative block"
      style={{ height: emotion.boxHeight * scale, width: emotion.boxWidth * scale }}
    >
      {emotion.layers.map((layer) => (
        <Image
          alt=""
          className="absolute"
          height={layer.height * scale}
          key={layer.src}
          src={layer.src}
          style={{
            height: layer.height * scale,
            left: layer.left * scale,
            top: layer.top * scale,
            width: layer.width * scale,
          }}
          width={layer.width * scale}
        />
      ))}
    </span>
  );
}
