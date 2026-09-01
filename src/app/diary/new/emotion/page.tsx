import { Suspense } from "react";
import EmotionSelectScreen from "@/features/diary/components/EmotionSelectScreen";

export default function NewDiaryEmotionPage() {
  return (
    <Suspense>
      <EmotionSelectScreen />
    </Suspense>
  );
}
