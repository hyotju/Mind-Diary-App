import Image from "next/image";
import Link from "next/link";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { MAIN_NAVIGATION_ITEMS } from "@/constants/navigation";
import CreateTalismanButton from "@/features/burn/components/CreateTalismanButton";

const FORTUNE_ASSETS = {
  ash1: "/figma/burn/fortune-ash-1.svg",
  ash2: "/figma/burn/fortune-ash-2.svg",
  ash3: "/figma/burn/fortune-ash-3.svg",
  ash4: "/figma/burn/fortune-ash-4.svg",
  character: "/figma/burn/fortune-character.svg",
} as const;

export default function BurnFortunePage() {
  return (
    <main className="h-dvh overflow-hidden bg-gray-100 text-foreground">
      <div className="relative mx-auto h-dvh w-full max-w-[395px] overflow-hidden bg-background px-6 pb-[calc(103px+env(safe-area-inset-bottom))] pt-[28px]">
        <header className="grid grid-cols-[28px_1fr_28px] items-center">
          <Link
            aria-label="소각 입력 화면으로 돌아가기"
            className="flex size-7 items-center justify-center"
            href="/burn"
          >
            <BackIcon />
          </Link>
          <h1 className="text-center text-xl font-medium leading-[23px]">
            소각
          </h1>
        </header>

        <section className="mt-[27px]">
          <h2 className="text-xl font-medium leading-[27px]">
            <strong className="font-bold">마음</strong>님의 행운을 가져다 줄
            <br />
            <span className="text-orange-500">개운지침</span>을 전해드려요
          </h2>
          <p className="mt-[5px] text-[13px] leading-[25px] tracking-[0.02em] text-gray-500">
            흘려보낸 감정의 자리에 새로운 기운을 채워보세요.
          </p>
        </section>

        <FortuneCard />

        <div className="absolute left-6 right-6 top-[550px] flex flex-col gap-3.5">
          <CreateTalismanButton />
          <Link
            className="flex h-[58px] items-center justify-center rounded-lg border border-gray-200 bg-white text-xl font-medium leading-[23px] text-gray-500"
            href="/burn"
          >
            다른 감정 소각하기
          </Link>
        </div>

        <BottomNavigation activeValue="burn" items={MAIN_NAVIGATION_ITEMS} />
      </div>
    </main>
  );
}

function FortuneCard() {
  return (
    <section className="absolute left-6 top-[194px] h-[328px] w-[345px] overflow-hidden rounded-[15px] shadow-[0_4px_20px_rgba(18,18,18,0.05)] [background:linear-gradient(152.39deg,var(--orange-200,#fed7a5)_5.4105%,var(--orange-500,#fe7023)_113.62%)]">
      <FortuneAsset
        className="left-[5px] top-[70px] h-[142.823px] w-[153.984px]"
        imageClassName="h-[124.476px] w-[91.801px]"
        rotate="rotate-[-58.98deg]"
        src={FORTUNE_ASSETS.ash1}
      />
      <FortuneAsset
        className="left-[-36px] top-[199px] h-[217.147px] w-[195.112px]"
        imageClassName="h-[177.967px] w-[131.25px]"
        rotate="rotate-[25.52deg]"
        src={FORTUNE_ASSETS.ash2}
      />
      <FortuneAsset
        className="left-[165px] top-[136px] h-[76.565px] w-[64.884px]"
        imageClassName="h-[66.441px] w-[50.498px]"
        rotate="rotate-[-166.21deg] -scale-y-100"
        src={FORTUNE_ASSETS.ash3}
      />
      <FortuneAsset
        className="left-[258px] top-[37px] h-[139.314px] w-[141.808px]"
        imageClassName="h-[113.181px] w-[86.023px]"
        rotate="rotate-[-48.72deg]"
        src={FORTUNE_ASSETS.ash4}
      />
      <div className="absolute left-[163px] top-[136px] h-[237.254px] w-[191.919px]">
        <div className="absolute inset-[-0.21%_-2.46%_-2.79%_-0.26%]">
          <Image
            alt=""
            className="object-fill"
            draggable={false}
            fill
            src={FORTUNE_ASSETS.character}
            unoptimized
          />
        </div>
      </div>
      <div className="absolute left-6 top-[33px] w-[206px]">
        <h3 className="text-2xl font-bold leading-[30px] text-black">
          창문 개방, 액운 퇴치!
        </h3>
        <p className="mt-[13px] text-[15px] font-medium leading-5 text-black">
          창밖을 향해 심호흡 세 번이면
          <br />
          꼬인 머릿속도 맑게 정리될 거예요.
        </p>
      </div>
    </section>
  );
}

type FortuneAssetProps = {
  className: string;
  imageClassName: string;
  rotate: string;
  src: string;
};

function FortuneAsset({
  className,
  imageClassName,
  rotate,
  src,
}: FortuneAssetProps) {
  return (
    <div className={`absolute flex items-center justify-center ${className}`}>
      <div className={`flex-none ${rotate}`}>
        <div className={`relative ${imageClassName}`}>
          <Image
            alt=""
            className="object-fill"
            draggable={false}
            fill
            src={src}
            unoptimized
          />
        </div>
      </div>
    </div>
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
