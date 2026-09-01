export type ServiceIntroStep = {
  description: string;
  title: string;
};

export const SERVICE_INTRO_COMPLETED_STORAGE_KEY =
  "maeum-bujeok:service-intro-completed";

export const SERVICE_INTRO_STEPS: ServiceIntroStep[] = [
  {
    title: "털어놓기",
    description: "오늘 하루, 마음속에 쌓인 감정들을\n솔직하게 기록해 보세요.",
  },
  {
    title: "위로받기",
    description:
      "당신의 이야기에 공감하는\n오행 기반의 따뜻한 위로를 받아보세요.",
  },
  {
    title: "소각하기",
    description:
      "털어버리고 싶은 기억을 불태워\n마음의 무거운 짐을 내려놓아 보세요.",
  },
  {
    title: "균형찾기",
    description:
      "쌓여가는 리포트와 나만의 행운 부적으로\n더 건강한 내일을 맞이하세요.",
  },
];
