"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

type UnsavedNavigation = {
  cancelNavigation: () => void;
  confirmNavigation: () => void;
  handleNavigationCapture: (event: ReactMouseEvent<HTMLElement>) => void;
  isExitDialogOpen: boolean;
};

export function useUnsavedNavigation(isDirty: boolean): UnsavedNavigation {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleNavigationCapture = useCallback(
    (event: ReactMouseEvent<HTMLElement>): void => {
      if (!isDirty || event.button !== 0 || event.metaKey || event.ctrlKey) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest<HTMLAnchorElement>("a[href]");

      if (!link || link.target === "_blank") {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setPendingHref(link.getAttribute("href"));
    },
    [isDirty],
  );

  const cancelNavigation = useCallback((): void => {
    setPendingHref(null);
  }, []);

  const confirmNavigation = useCallback((): void => {
    if (!pendingHref) {
      return;
    }

    const href = pendingHref;
    setPendingHref(null);
    router.push(href);
  }, [pendingHref, router]);

  return {
    cancelNavigation,
    confirmNavigation,
    handleNavigationCapture,
    isExitDialogOpen: pendingHref !== null,
  };
}
