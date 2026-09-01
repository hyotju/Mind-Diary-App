"use client";

import { useUserStore } from "@/store/useUserStore";

type MemberNameProps = {
  fallback?: string;
};

export default function MemberName({ fallback = "마음" }: MemberNameProps) {
  const name = useUserStore((state) => state.profile?.name);

  return <>{name || fallback}</>;
}
