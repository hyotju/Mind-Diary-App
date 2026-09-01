import Link from "next/link";

export type BottomNavigationValue = "home" | "diary" | "report" | "burn" | "my";

export type BottomNavigationItem = {
  href: string;
  label: string;
  value: BottomNavigationValue;
};

type BottomNavigationProps = {
  activeValue: BottomNavigationValue;
  items: BottomNavigationItem[];
};

export default function BottomNavigation({
  activeValue,
  items,
}: BottomNavigationProps) {
  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-50 mx-auto h-[86px] w-full max-w-[395px] rounded-t-[15px] bg-background shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
    >
      <ul className="grid grid-cols-5 px-6 pt-[11px]">
        {items.map((item) => {
          const isActive = item.value === activeValue;

          return (
            <li key={item.value}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`flex h-[62px] flex-col items-center justify-start gap-[5px] text-[11px] font-medium leading-[23px] transition-colors ${
                  isActive ? "text-orange-500" : "text-gray-500"
                }`}
                href={item.href}
              >
                <NavigationIcon isActive={isActive} value={item.value} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

type NavigationIconProps = {
  isActive: boolean;
  value: BottomNavigationValue;
};

function NavigationIcon({ isActive, value }: NavigationIconProps) {
  const strokeWidth = isActive ? 1.6 : 1.4;

  if (value === "home") {
    return (
      <svg
        aria-hidden="true"
        className="h-[29px] w-[24px]"
        fill="none"
        viewBox="0 0 24 29"
      >
        <path
          d="M3.5 12.1 12 3.5l8.5 8.6v12.2c0 .8-.6 1.4-1.4 1.4H4.9c-.8 0-1.4-.6-1.4-1.4V12.1Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
        <path
          d="M9.4 25.7v-7.2h5.2v7.2"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
      </svg>
    );
  }

  if (value === "diary") {
    return (
      <svg
        aria-hidden="true"
        className="h-[29px] w-[28px]"
        fill="none"
        viewBox="0 0 28 29"
      >
        <rect
          height="24"
          rx="2"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          width="17"
          x="5"
          y="2.5"
        />
        <path
          d="M9 8h9M9 13h9M9 18h7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
        <path d="m19 8 5-5 2 2-5 5-3 .8.8-2.8Z" fill="currentColor" />
      </svg>
    );
  }

  if (value === "report") {
    return (
      <svg
        aria-hidden="true"
        className="h-[32px] w-[29px]"
        fill="none"
        viewBox="0 0 29 32"
      >
        <path
          d="M8.5 8.5v-2A3.5 3.5 0 0 1 12 3h5a3.5 3.5 0 0 1 3.5 3.5v2"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <rect
          height="19"
          rx="2.5"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          width="22"
          x="3.5"
          y="8.5"
        />
        <path
          d="M9 14.5h8M9 19h6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="20"
          cy="23"
          r="3.2"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="m22.4 25.4 3 3"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.3"
        />
      </svg>
    );
  }

  if (value === "burn") {
    return (
      <svg
        aria-hidden="true"
        className="h-[31px] w-[25px]"
        fill="none"
        viewBox="0 0 25 31"
      >
        <path
          d="M7.7 29C2.5 21.8 2.3 15 4.7 9.4c1.8 5.4 5.1 4.6 5.8.5.6-3.2.4-6.8 3-8.4 1.8 4.9 8.5 8.4 8.9 15.5.2 4.6-1.9 8.7-5.2 12-2.7-2.4-6.7-2.6-9.5 0Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="h-[25px] w-[23px]"
      fill="none"
      viewBox="0 0 23 25"
    >
      <circle
        cx="11.5"
        cy="6.5"
        r="4.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="M2.5 23c1.3-5.1 4.4-8 9-8s7.7 2.9 9 8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
