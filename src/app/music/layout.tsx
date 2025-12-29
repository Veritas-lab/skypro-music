// app/music/layout.tsx
"use client";

import { useAppSelector } from "@/Store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuth } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.push("/auth/signin");
    }
  }, [isAuth, router]);

  if (!isAuth) {
    return null; // или индикатор загрузки
  }

  return <>{children}</>;
}
