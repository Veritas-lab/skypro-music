"use client";

import { useAppSelector } from "@/Store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuth } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Используем useEffect для навигации после рендеринга
  useEffect(() => {
    if (isAuth) {
      router.push("/");
    }
  }, [isAuth, router]);

  // Если пользователь авторизован, показываем загрузку или ничего
  if (isAuth) {
    return null; // Или <LoadingSpinner />
  }

  // Если не авторизован - показываем форму входа/регистрации
  return <>{children}</>;
}
