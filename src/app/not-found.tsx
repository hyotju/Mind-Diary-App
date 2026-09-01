import Link from "next/link";
import FeedbackScreen, {
  ErrorGhostIcon,
} from "@/components/common/FeedbackScreen";

export default function NotFound() {
  return (
    <FeedbackScreen
      action={
        <Link
          className="flex h-[38px] w-[129px] items-center justify-center rounded-[7px] bg-foreground text-[15px] font-medium leading-6 text-white transition-opacity active:opacity-80"
          href="/"
        >
          다시 시도
        </Link>
      }
      description={
        <>
          불편을 드려 죄송해요.
          <br />
          잠시 후에 다시 시도해 주세요.
        </>
      }
      icon={<ErrorGhostIcon />}
      title="오류가 발생하였어요"
      topClassName="top-[293px]"
    />
  );
}
