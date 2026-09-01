import Link from "next/link";

type BurnNavigationTab = "direct" | "diary" | "history";

type BurnNavigationTabsProps = {
  activeTab: BurnNavigationTab;
  onDirectClick?: () => void;
  onDiaryClick?: () => void;
};

export default function BurnNavigationTabs({
  activeTab,
  onDirectClick,
  onDiaryClick,
}: BurnNavigationTabsProps) {
  return (
    <div className="flex items-center gap-2.5" role="tablist">
      <Tab
        href={onDirectClick ? undefined : "/burn"}
        isActive={activeTab === "direct"}
        label="직접 입력"
        onClick={onDirectClick}
      />
      <Tab
        href={onDiaryClick ? undefined : "/burn?tab=diary"}
        isActive={activeTab === "diary"}
        label="일기 선택"
        onClick={onDiaryClick}
      />
      <Tab
        href="/burn/history"
        isActive={activeTab === "history"}
        label="소각 기록"
      />
    </div>
  );
}

type TabProps = {
  href?: string;
  isActive: boolean;
  label: string;
  onClick?: () => void;
};

function Tab({ href, isActive, label, onClick }: TabProps) {
  const className = `flex h-[39px] items-center justify-center whitespace-nowrap rounded-full px-[15px] text-base leading-normal transition-colors ${
    isActive
      ? "bg-orange-500 text-white"
      : "border border-gray-200 bg-gray-100 text-foreground"
  }`;

  if (href) {
    return (
      <Link
        aria-selected={isActive}
        className={className}
        href={href}
        role="tab"
      >
        {label}
      </Link>
    );
  }

  return (
    <button
      aria-selected={isActive}
      className={className}
      onClick={onClick}
      role="tab"
      type="button"
    >
      {label}
    </button>
  );
}
