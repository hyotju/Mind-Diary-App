import { Suspense } from "react";
import DiaryDateSelectScreen from "@/features/diary/components/DiaryDateSelectScreen";

export default function NewDiaryPage() {
  return (
    <Suspense>
      <DiaryDateSelectScreen />
    </Suspense>
  );
}
