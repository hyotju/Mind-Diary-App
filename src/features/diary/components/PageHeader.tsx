"use client";

import Link from "next/link";

type PageHeaderProps = {
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
  title: string;
};

export default function PageHeader({
  backHref,
  backLabel = "뒤로 가기",
  onBack,
  title,
}: PageHeaderProps) {
  if (!backHref && !onBack) {
    return (
      <h1 className="text-center text-xl font-medium leading-[23px] text-foreground">
        {title}
      </h1>
    );
  }

  return (
    <header className="grid grid-cols-[28px_1fr_28px] items-center">
      {backHref ? (
        <Link
          aria-label={backLabel}
          className="flex size-7 items-center justify-center"
          href={backHref}
        >
          <BackIcon />
        </Link>
      ) : (
        <button
          aria-label={backLabel}
          className="flex size-7 items-center justify-center"
          onClick={onBack}
          type="button"
        >
          <BackIcon />
        </button>
      )}
      <h1 className="text-center text-xl font-medium leading-[23px] text-foreground">
        {title}
      </h1>
    </header>
  );
}

function BackIcon() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 28 28">
      <path
        d="M17 7 10 14l7 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}
