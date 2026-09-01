export const DIARY_PLACEHOLDER_PROMPTS: string[] = [
  "무엇부터 써야 할지 고민된다면,\n지금 마음에 가장 오래 남아 있는 감정부터 적어보세요.",
  "좋았던 일도, 아쉬웠던 일도 괜찮아요.\n오늘의 마음을 있는 그대로 남겨보세요.",
  "오늘도 수고 많았어요.\n이제 오늘의 마음을 천천히 기록해 보세요.",
  "지금 떠오르는 생각이 엉켜 있어도 괜찮아요.\n마음속에 남아 있는 이야기가 있다면 잠시 꺼내보세요.",
  "글로 남기는 것만으로도 한결 가벼워질 수 있어요.\n오늘의 감정을 편하게 남겨보세요.",
  "오늘 어떤 하루를 보내셨나요?\n떠오르는 이야기부터 편하게 남겨보세요.",
  "오늘 마음에 남은 일이 있나요?\n떠오르는 이야기부터 천천히 적어보세요.",
  "오늘 스스로에게 해주고 싶은 말이 있나요?\n그 한마디를 일기의 첫 문장으로 적어보세요.",
];

export type EmotionId =
  | "joy"
  | "happy"
  | "excited"
  | "calm"
  | "neutral"
  | "lethargic"
  | "sad"
  | "anxious"
  | "angry";

export type EmotionIconLayer = {
  height: number;
  left: number;
  src: string;
  top: number;
  width: number;
};

export type EmotionOption = {
  boxHeight: number;
  boxWidth: number;
  id: EmotionId;
  label: string;
  layers: EmotionIconLayer[];
};

// TODO: 백엔드의 감정 분석 API가 준비되면, 부정 감정 레벨은 서버가 계산한 실제 값과 임계치로
// 교체해야 한다. 지금은 사용자가 고른 감정이 부정적인 경우를 "임계치 이상 감지"로 취급하는 목업이다.
export const NEGATIVE_EMOTION_IDS: EmotionId[] = [
  "lethargic",
  "sad",
  "anxious",
  "angry",
];

const EMOTION_IMAGE_BASE = "/images/diary/emotions";

// 사주 기반 위로메세지 카드에는 선택한 감정과 무관하게 항상 이 마스코트를 보여준다.
export const COMFORT_MESSAGE_MASCOT = {
  height: 162.252,
  src: "/images/diary/mascots/mascot.svg",
  width: 138.866,
};

export const EMOTIONS: EmotionOption[] = [
  {
    boxHeight: 52.92,
    boxWidth: 56,
    id: "joy",
    label: "기뻐요",
    layers: [
      { height: 52.92, left: 0, src: `${EMOTION_IMAGE_BASE}/joy-body.svg`, top: 0, width: 56 },
      { height: 6.67, left: 14.46, src: `${EMOTION_IMAGE_BASE}/joy-eyes.svg`, top: 23.37, width: 25.59 },
      { height: 7.79, left: 18.91, src: `${EMOTION_IMAGE_BASE}/joy-mouth.svg`, top: 14.46, width: 17.8 },
    ],
  },
  {
    boxHeight: 59.65,
    boxWidth: 46,
    id: "happy",
    label: "행복해요",
    layers: [
      { height: 59.65, left: 0, src: `${EMOTION_IMAGE_BASE}/happy-flame.svg`, top: 0, width: 46 },
    ],
  },
  {
    boxHeight: 58.98,
    boxWidth: 47.61,
    id: "excited",
    label: "즐거워요",
    layers: [
      { height: 58.98, left: 0, src: `${EMOTION_IMAGE_BASE}/excited-flame.svg`, top: 0, width: 47.61 },
    ],
  },
  {
    boxHeight: 46.39,
    boxWidth: 48,
    id: "calm",
    label: "편안해요",
    layers: [
      { height: 46.39, left: 0, src: `${EMOTION_IMAGE_BASE}/calm-body.svg`, top: 0, width: 46.4 },
      { height: 6.81, left: 12.73, src: `${EMOTION_IMAGE_BASE}/calm-mouth.svg`, top: 18.19, width: 20.69 },
      { height: 5.85, left: 40.94, src: `${EMOTION_IMAGE_BASE}/calm-sparkle-1.svg`, top: 1.82, width: 4.23 },
      { height: 4.55, left: 44.71, src: `${EMOTION_IMAGE_BASE}/calm-sparkle-2.svg`, top: 5.11, width: 3.29 },
    ],
  },
  {
    boxHeight: 54.27,
    boxWidth: 42.64,
    id: "neutral",
    label: "보통이에요",
    layers: [
      { height: 54.27, left: 0, src: `${EMOTION_IMAGE_BASE}/neutral-flame.svg`, top: 0, width: 42.64 },
    ],
  },
  {
    boxHeight: 55.62,
    boxWidth: 43.7,
    id: "lethargic",
    label: "무기력해요",
    layers: [
      { height: 55.62, left: 0, src: `${EMOTION_IMAGE_BASE}/lethargic-flame.svg`, top: 0, width: 43.7 },
    ],
  },
  {
    boxHeight: 49.06,
    boxWidth: 49.07,
    id: "sad",
    label: "슬퍼요",
    layers: [
      { height: 49.06, left: 0, src: `${EMOTION_IMAGE_BASE}/sad-body.svg`, top: 0, width: 49.07 },
    ],
  },
  {
    boxHeight: 50.99,
    boxWidth: 51,
    id: "anxious",
    label: "불안해요",
    layers: [
      { height: 50.99, left: 0, src: `${EMOTION_IMAGE_BASE}/anxious-body.svg`, top: 0, width: 51 },
      { height: 13.72, left: 14.18, src: `${EMOTION_IMAGE_BASE}/anxious-mouth.svg`, top: 15.17, width: 22.89 },
    ],
  },
  {
    boxHeight: 57.67,
    boxWidth: 46.55,
    id: "angry",
    label: "화나요",
    layers: [
      { height: 57.67, left: 0, src: `${EMOTION_IMAGE_BASE}/angry-flame.svg`, top: 0, width: 46.55 },
    ],
  },
];
