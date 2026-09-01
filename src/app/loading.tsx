import FeedbackScreen, {
  LoadingFlameIcon,
} from "@/components/common/FeedbackScreen";

export default function Loading() {
  return (
    <FeedbackScreen
      description="해당 페이지로 로딩중이에요."
      icon={<LoadingFlameIcon />}
      title="잠시만 기다려주세요"
      topClassName="top-[317px]"
    />
  );
}
