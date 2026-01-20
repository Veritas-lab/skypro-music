"use client";

import Centerblock from "@/components/CenterBlock/CenterBlock";
import { useAppSelector, useAppDispatch } from "@/Store/store";
import styles from "../musicLayout.module.css";
import { useEffect, useState } from "react";
import { loadFavoriteTracksAPI } from "@/Store/Features/Trackslice";
import { useAppDispatch } from "@/Store/store";
import { useRouter } from "next/navigation";

export default function FavoritesPage(): React.ReactElement {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuth } = useAppSelector((state) => state.auth);
  const [sessionRestored, setSessionRestored] = useState<boolean>(false);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setSessionRestored(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleLoadFavorites = useCallback((): void => {
    if (
      !isAuth &&
      typeof window !== "undefined" &&
      !localStorage.getItem("accessToken")
    ) {
      router.push("/auth/signin");
      return;
    }


    if ((isAuth || hasToken) && !favoritesLoaded) {
      dispatch(loadFavoriteTracksAPI());
    }
  }, [dispatch, isAuth, router, sessionRestored, favoritesLoaded]);

  const hasToken = typeof window !== "undefined" && localStorage.getItem("access_token");
  const shouldShowContent = sessionRestored && (isAuth || hasToken);

  useEffect(() => {
    if (sessionRestored) {
      handleLoadFavorites();
    }
  }, [sessionRestored, handleLoadFavorites]);

  if (
    !sessionRestored ||
    (!isAuth &&
      typeof window !== "undefined" &&
      !localStorage.getItem("accessToken"))
  ) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  // Не передаем tracks - CenterBlock будет использовать favoriteTracks из Redux
  // Это позволяет работать фильтрации и поиску на странице избранного
  return (
    <Centerblock
      title="Мои треки"
      isFavoritePage={true}
    />
  );
}
