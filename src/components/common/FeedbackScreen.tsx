import Image from "next/image";
import type { ReactNode } from "react";

type FeedbackScreenProps = {
  action?: ReactNode;
  description: ReactNode;
  icon: ReactNode;
  topClassName: string;
  title: string;
};

export default function FeedbackScreen({
  action,
  description,
  icon,
  topClassName,
  title,
}: FeedbackScreenProps) {
  return (
    <main className="min-h-dvh bg-gray-100 text-foreground">
      <div className="relative mx-auto min-h-dvh w-full max-w-[395px] bg-background">
        <section
          className={`absolute left-1/2 flex w-[201px] -translate-x-1/2 flex-col items-center text-center ${topClassName}`}
        >
          {icon}
          <div className="mt-6 flex w-full flex-col items-center gap-[17px]">
            <h1 className="w-max text-[25px] font-semibold leading-normal text-black">
              {title}
            </h1>
            <p className="text-[15px] font-medium leading-5 text-gray-500">
              {description}
            </p>
          </div>
          {action ? <div className="mt-6">{action}</div> : null}
        </section>
      </div>
    </main>
  );
}

export function ErrorGhostIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[89px] w-[89px]"
      fill="none"
      viewBox="0 0 89 89"
    >
      <path
        d="M.1 80.2C.9 31.7 17 0 44.4 0 72 0 88 31.7 88.6 80.4c.1 4.2-5.1 6-7.7 2.6l-4.2-5.6a4.6 4.6 0 0 0-7.3 0L65.3 83a4.6 4.6 0 0 1-7.3 0l-4.1-5.5a4.6 4.6 0 0 0-7.3 0L42.5 83a4.6 4.6 0 0 1-7.3 0l-4.1-5.5a4.6 4.6 0 0 0-7.3 0L19.7 83a4.6 4.6 0 0 1-7.3 0l-4.1-5.5C6.3 74.8 1.9 76.3.1 80.2Z"
        fill="#E0E0E0"
      />
      <rect
        fill="#8B8DA8"
        height="15.8"
        rx="3.7"
        transform="rotate(-8 25.8 28.8)"
        width="11.7"
        x="25.8"
        y="28.8"
      />
      <rect
        fill="#8B8DA8"
        height="15.8"
        rx="3.7"
        transform="rotate(8 52.2 28.8)"
        width="11.7"
        x="52.2"
        y="28.8"
      />
    </svg>
  );
}

export function LoadingFlameIcon() {
  return (
    <div aria-hidden="true" className="relative h-[120px] w-[55px]">
      <Image
        alt=""
        className="absolute -left-5 -top-4 h-40 w-[95px] max-w-none"
        height={160}
        priority
        src="/figma/feedback/loading-flame.svg"
        width={95}
      />
    </div>
  );
}
