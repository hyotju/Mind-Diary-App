import Link from "next/link";

type TalismanPageHeaderProps = {
  backHref: string;
};

export default function TalismanPageHeader({
  backHref,
}: TalismanPageHeaderProps) {
  return (
    <header className="grid grid-cols-[28px_1fr_28px] items-center">
      <Link
        aria-label="이전 화면으로 돌아가기"
        className="flex size-7 items-center justify-start"
        href={backHref}
      >
        <BackIcon />
      </Link>
      <h1 className="text-center text-xl font-medium leading-[23px]">부적</h1>
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
