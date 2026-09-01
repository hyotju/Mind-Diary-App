import { Suspense } from "react";
import DiaryWriteScreen from "@/features/diary/components/DiaryWriteScreen";

export default function NewDiaryWritePage() {
  return (
    <Suspense>
      <DiaryWriteScreen />
    </Suspense>
  );
}
