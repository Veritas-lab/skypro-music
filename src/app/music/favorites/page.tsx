"use client";

import Centerblock from "@/components/CenterBlock/CenterBlock";
import { useAppSelector } from "@/Store/store";
import styles from "../musicLayout.module.css";
import { useEffect, useState } from "react";
import { loadFavoriteTracks, loadFavoriteTracksAPI } from "@/Store/Features/Trackslice";
import { useAppDispatch } from "@/Store/store";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { favoriteTracks } = useAppSelector((state) => state.tracks);
  const { isAuth } = useAppSelector((state) => state.auth);
  const [sessionRestored, setSessionRestored] = useState(false);

  useEffect(() => {
    // Проверяем, восстановлена ли сессия (restoreSession вызывается в MusicLayout)
    // Ждем немного для обновления состояния Redux
    const timer = setTimeout(() => {
      setSessionRestored(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!sessionRestored) return;

    // Проверяем наличие токена напрямую в localStorage
    const hasToken = typeof window !== "undefined" && localStorage.getItem("access_token");
    
    // Если нет токена и пользователь не авторизован, редиректим
    if (!hasToken && !isAuth) {
      router.push("/auth/signin");
      return;
    }

    // Если авторизован (через Redux или токен в localStorage), загружаем избранные треки
    if (isAuth || hasToken) {
      // Загружаем избранные треки из localStorage (быстро)
      dispatch(loadFavoriteTracks());
      // Затем загружаем с сервера (если есть токен)
      if (hasToken) {
        dispatch(loadFavoriteTracksAPI());
      }
    }
  }, [dispatch, isAuth, router, sessionRestored]);

  // Проверяем наличие токена для отображения контента
  const hasToken = typeof window !== "undefined" && localStorage.getItem("access_token");
  const shouldShowContent = sessionRestored && (isAuth || hasToken);

  if (!shouldShowContent) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  return (
    <Centerblock
      tracks={favoriteTracks}
      title="Мои треки"
      isFavoritePage={true}
    />
  );
}
