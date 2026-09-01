"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MAX_BURN_STEP = 4;

const BURN_ASSETS = {
  ash1: "/figma/burn/ash-1.svg",
  ash2: "/figma/burn/ash-2.svg",
  ash3: "/figma/burn/ash-3.svg",
  ash4: "/figma/burn/ash-4.svg",
  ash5: "/figma/burn/ash-5.svg",
  ash6: "/figma/burn/ash-6.svg",
  backArrow: "/figma/burn/back-arrow.svg",
  flameGlow: "/figma/burn/flame-glow.svg",
  flameLarge: "/figma/burn/flame-large.svg",
  flameSmall: "/figma/burn/flame-small.svg",
} as const;

export default function BurnResultPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [burnStep, setBurnStep] = useState(0);
  const progress = burnStep / MAX_BURN_STEP;
  const hasStarted = burnStep > 0;
  const isComplete = burnStep >= MAX_BURN_STEP;

  const handleFlameClick = () => {
    setBurnStep((currentStep) => Math.min(currentStep + 1, MAX_BURN_STEP));
  };

  const handleMoveToFortune = () => {
    router.push("/burn/fortune");
  };

  const handleViewLater = () => {
    router.replace("/burn");
  };

  return (
    <main className="h-dvh overflow-hidden bg-purple-500 text-white">
      <div
        className="relative mx-auto h-dvh w-full max-w-[395px] overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, var(--purple-500, #111143) 46.127%, var(--purple-300, #6d6dc6) 122.48%)",
        }}
      >
        <header className="absolute left-1/2 top-[70px] z-30 grid w-[345px] -translate-x-1/2 grid-cols-[28px_1fr_28px] items-center">
          <button
            aria-label="소각 화면으로 돌아가기"
            className="flex size-7 items-center justify-center"
            onClick={() => router.push("/burn")}
            type="button"
          >
            <span className="-rotate-90">
              <Image
                alt=""
                className="size-7"
                draggable={false}
                height={28}
                src={BURN_ASSETS.backArrow}
                unoptimized
                width={28}
              />
            </span>
          </button>
          <h1 className="text-center text-xl font-medium leading-[23px]">
            소각
          </h1>
        </header>

        <section className="absolute left-1/2 top-[139px] z-30 w-[223px] -translate-x-1/2 text-center">
          <h2 className="text-[28px] font-semibold leading-[35px] text-gray-100">
            감정을 태워
            <br />
            소각해주세요.
          </h2>
          <p className="mt-2.5 text-[15px] font-medium leading-normal text-gray-400">
            불꽃을 터치해 감정을 소각해보세요!
          </p>
        </section>

        <FigmaAshBackground />

        <motion.div
          aria-hidden="true"
          animate={{
            opacity: hasStarted ? progress : 0,
            scale: 0.2 + progress * 0.8,
          }}
          className="absolute left-[calc(25%+43.75px)] top-[317px] z-10 h-[441px] w-[98px]"
          initial={false}
          style={{ transformOrigin: "50% 100%" }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.42,
            ease: "easeOut",
          }}
        >
          <div className="absolute inset-[-11.34%_-51.02%]">
            <Image
              alt=""
              className="object-fill"
              draggable={false}
              fill
              src={BURN_ASSETS.flameGlow}
              unoptimized
            />
          </div>
        </motion.div>

        <button
          aria-label="불꽃을 키워 감정 소각하기"
          className="absolute left-1/2 top-[297px] z-40 h-[461px] w-[163px] -translate-x-1/2 cursor-pointer bg-transparent outline-none"
          onClick={handleFlameClick}
          disabled={isComplete}
          type="button"
        />

        {!hasStarted ? (
          <motion.div
            aria-hidden="true"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, -5, 0],
                    scale: [1, 1.035, 1],
                  }
            }
            className="pointer-events-none absolute left-[calc(50%-19.5px)] top-[676px] z-30 h-[82px] w-[38px]"
            transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
          >
            <div className="absolute inset-[-19.51%_-52.63%_-29.27%_-52.63%]">
              <Image
                alt=""
                className="object-fill"
                draggable={false}
                fill
                src={BURN_ASSETS.flameSmall}
                unoptimized
              />
            </div>
          </motion.div>
        ) : null}

        <motion.div
          aria-hidden="true"
          animate={{
            opacity: hasStarted ? 1 : 0,
            scale: 0.18 + progress * 0.82,
          }}
          className="pointer-events-none absolute left-1/2 top-[297px] z-30 h-[461.365px] w-[123px] -translate-x-1/2"
          initial={false}
          style={{ transformOrigin: "50% 100%" }}
          transition={{
            type: "spring",
            stiffness: 115,
            damping: 15,
            mass: 0.9,
            duration: shouldReduceMotion ? 0 : undefined,
          }}
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    rotate: [-0.8, 0.8, -0.6],
                    scaleX: [1, 0.98, 1.02, 1],
                  }
            }
            className="absolute inset-[-3.47%_-16.26%_-5.2%_-16.26%] block h-[108.67%] w-[132.52%] max-w-none"
            transition={{ duration: 0.9, ease: "easeInOut", repeat: Infinity }}
          >
            <Image
              alt=""
              className="object-fill"
              draggable={false}
              fill
              src={BURN_ASSETS.flameLarge}
              unoptimized
            />
          </motion.div>
        </motion.div>

        {isComplete ? (
          <BurnCompleteDialog
            onLater={handleViewLater}
            onMove={handleMoveToFortune}
          />
        ) : null}
      </div>
    </main>
  );
}

type BurnCompleteDialogProps = {
  onLater: () => void;
  onMove: () => void;
};

function BurnCompleteDialog({ onLater, onMove }: BurnCompleteDialogProps) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-[rgba(18,18,18,0.5)] px-[25px] backdrop-blur-[2.5px]"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <motion.section
        animate={{ opacity: 1, y: 0, scale: 1 }}
        aria-labelledby="burn-complete-title"
        className="mt-[-1px] h-[158px] w-full max-w-[344px] rounded-[15px] border border-purple-200 bg-white px-[33px] pb-[30px] pt-8 text-center shadow-[0_4px_20px_rgba(254,215,165,0.05)]"
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        role="dialog"
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <h2
          className="text-lg font-medium leading-6 text-foreground"
          id="burn-complete-title"
        >
          오늘의 감정을 소각했어요.
        </h2>
        <p className="mt-1 text-xs leading-[15px] text-gray-500">
          개운 처방이 도착했어요. 지금 바로 확인해보세요.
        </p>
        <div className="mt-[15px] flex gap-[5px]">
          <button
            className="flex h-[38px] w-[141px] items-center justify-center rounded-[7px] border border-gray-200 bg-white text-[15px] font-medium leading-6 text-gray-500"
            onClick={onLater}
            type="button"
          >
            나중에 보기
          </button>
          <button
            className="flex h-[38px] w-[129px] items-center justify-center whitespace-nowrap rounded-[7px] bg-purple-400 text-[15px] font-medium leading-6 text-white"
            onClick={onMove}
            type="button"
          >
            개운 지침 보기
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}

function FigmaAshBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
      <FigmaAssetLayer
        className="left-[calc(25%+23.75px)] top-[375px] h-[287.507px] w-[287.513px]"
        imageClassName="h-[205px] w-[205.031px]"
        rotate="rotate-[37.58deg]"
        src={BURN_ASSETS.ash1}
      />
      <FigmaAssetLayer
        className="left-[-80px] top-[287px] h-[263.563px] w-[263.582px]"
        imageClassName="h-[205px] w-[205.031px]"
        rotate="rotate-[-20.38deg]"
        src={BURN_ASSETS.ash2}
      />
      <FigmaAssetLayer
        className="left-[calc(50%+49.5px)] top-[589px] h-[263.296px] w-[229.828px]"
        imageClassName="h-[220.007px] w-[162.254px]"
        rotate="rotate-[-20.81deg]"
        src={BURN_ASSETS.ash3}
      />
      <FigmaAssetLayer
        className="left-[17px] top-[584px] h-[191.919px] w-[151.931px]"
        imageClassName="h-[176.593px] w-[130.237px]"
        rotate="rotate-[7.41deg]"
        src={BURN_ASSETS.ash4}
      />
      <FigmaAssetLayer
        className="left-[calc(50%+25.5px)] top-[276px] h-[198.488px] w-[170.333px]"
        imageClassName="h-[173.092px] w-[136px]"
        rotate="rotate-[12.54deg]"
        src={BURN_ASSETS.ash5}
      />
      <FigmaAssetLayer
        className="left-[-67px] top-[663px] h-[297.4px] w-[272.277px]"
        imageClassName="h-[241.196px] w-[194.709px]"
        rotate="rotate-[-22.53deg]"
        src={BURN_ASSETS.ash6}
      />
    </div>
  );
}

type FigmaAssetLayerProps = {
  className: string;
  imageClassName: string;
  rotate: string;
  src: string;
};

function FigmaAssetLayer({
  className,
  imageClassName,
  rotate,
  src,
}: FigmaAssetLayerProps) {
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
