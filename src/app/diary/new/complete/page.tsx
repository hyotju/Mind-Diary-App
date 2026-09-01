import { Suspense } from "react";
import DiaryCompleteScreen from "@/features/diary/components/DiaryCompleteScreen";

export default function NewDiaryCompletePage() {
  return (
    <Suspense>
      <DiaryCompleteScreen />
    </Suspense>
  );
}
