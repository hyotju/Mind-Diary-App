"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function WriteDiaryButton() {
  const router = useRouter();

  return (
    <motion.button
      className="mt-[23px] flex h-[57px] w-full items-center justify-center rounded-lg bg-orange-500 text-xl font-semibold leading-[23px] text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
      onClick={() => router.push("/diary/new")}
      type="button"
      whileTap={{ scale: 0.98 }}
    >
      일기 작성하기
    </motion.button>
  );
}
