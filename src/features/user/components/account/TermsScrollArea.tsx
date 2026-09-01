"use client";

import { useState } from "react";
import type { ReactNode, UIEvent } from "react";

const THUMB_HEIGHT = 27;
const TRACK_INSET = 38;

type TermsScrollAreaProps = {
  children: ReactNode;
};

export default function TermsScrollArea({ children }: TermsScrollAreaProps) {
  const [thumbOffset, setThumbOffset] = useState(TRACK_INSET);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    const maxScrollTop = scrollHeight - clientHeight;
    const trackTravel = clientHeight - TRACK_INSET * 2 - THUMB_HEIGHT;
    const scrollProgress = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;

    setThumbOffset(TRACK_INSET + scrollProgress * Math.max(trackTravel, 0));
  };

  return (
    <>
      <div
        className="terms-scrollbar h-full overflow-y-auto px-4 pb-12 pt-[14px] text-[13px] font-normal leading-[22px] text-gray-500"
        onScroll={handleScroll}
      >
        {children}
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[7px] top-0 h-[27px] w-2 rounded-lg bg-gray-400"
        style={{ transform: `translateY(${thumbOffset}px)` }}
      />
    </>
  );
}
