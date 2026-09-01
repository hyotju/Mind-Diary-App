"use client";

import Image from "next/image";
import Link from "next/link";

import type { MyMenuItem } from "@/features/user/types";

type MyMenuSectionProps = {
  className?: string;
  items: MyMenuItem[];
  onItemClick?: (item: MyMenuItem) => void;
  title: string;
};

export default function MyMenuSection({
  className = "",
  items,
  onItemClick,
  title,
}: MyMenuSectionProps) {
  const hasMultipleItems = items.length > 1;

  return (
    <section className={`mt-[23px] ${className}`}>
      <h2 className="text-lg font-medium leading-[27px]">{title}</h2>
      <div
        className={`mt-3 grid gap-x-4 gap-y-3 ${
          hasMultipleItems ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {items.map((item) => {
          const className =
            "flex h-[60px] items-center gap-2.5 rounded-[8.673px] bg-white px-[19px] text-left shadow-[0_3.469px_17.347px_rgba(0,0,0,0.05)]";
          const content = <MenuItemContent item={item} />;

          return item.href ? (
            <Link className={className} href={item.href} key={item.label}>
              {content}
            </Link>
          ) : (
            <button
              aria-haspopup={item.action ? "dialog" : undefined}
              className={className}
              key={item.label}
              onClick={() => onItemClick?.(item)}
              type="button"
            >
              {content}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MenuItemContent({ item }: { item: MyMenuItem }) {
  return (
    <>
      {item.iconHasBackground ? (
        <span className="flex size-[31px] shrink-0 items-center justify-center rounded-full bg-orange-100">
          <Image
            alt=""
            height={item.iconSize}
            src={item.iconSrc}
            width={item.iconSize}
          />
        </span>
      ) : (
        <Image
          alt=""
          className="size-[31px] shrink-0"
          height={31}
          src={item.iconSrc}
          width={31}
        />
      )}
      <span className="w-[75px] whitespace-pre-line text-[13px] font-medium leading-normal">
        {item.label}
      </span>
    </>
  );
}
