import Link from "next/link";
import BottomNavigation, {
  type BottomNavigationValue,
} from "@/components/layout/BottomNavigation";
import { MAIN_NAVIGATION_ITEMS } from "@/constants/navigation";

type PlaceholderScreenProps = {
  activeValue?: BottomNavigationValue;
  description: string;
  eyebrow?: string;
  showBackLink?: boolean;
  title: string;
};

export default function PlaceholderScreen({
  activeValue,
  description,
  eyebrow = "준비 중",
  showBackLink = false,
  title,
}: PlaceholderScreenProps) {
  return (
    <main className="min-h-dvh bg-gray-100 text-foreground">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[395px] flex-col bg-background px-6 pb-[calc(126px+env(safe-area-inset-bottom))] pt-[28px]">
        <header className="text-center">
          <p className="text-[13px] font-medium leading-[25px] tracking-[0.02em] text-orange-500">
            {eyebrow}
          </p>
          <h1 className="mt-1 text-xl font-semibold leading-[27px] text-foreground">
            {title}
          </h1>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex size-[76px] items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
            <span className="text-3xl font-semibold">{title.slice(0, 1)}</span>
          </div>
          <p className="mt-6 whitespace-pre-line text-base leading-6 text-gray-500">
            {description}
          </p>
          {showBackLink ? (
            <Link
              className="mt-8 flex h-12 w-full items-center justify-center rounded-lg border border-gray-200 text-base font-semibold text-foreground transition-colors active:bg-gray-100"
              href="/"
            >
              홈으로 돌아가기
            </Link>
          ) : null}
        </section>

        {activeValue ? (
          <BottomNavigation
            activeValue={activeValue}
            items={MAIN_NAVIGATION_ITEMS}
          />
        ) : null}
      </div>
    </main>
  );
}
