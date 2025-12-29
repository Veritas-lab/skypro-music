"use client";

import Centerblock from "@/components/CenterBlock/CenterBlock";
import { useAppSelector } from "@/Store/store";
import styles from "../musicLayout.module.css";
import { useEffect } from "react";
import { loadFavoriteTracks } from "@/Store/Features/Trackslice";
import { useAppDispatch } from "@/Store/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { favoriteTracks, error, loading } = useAppSelector(
    (state) => state.tracks,
  );
  const { isAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuth) {
      router.push("/auth/signin");
      return;
    }

    dispatch(loadFavoriteTracks());
  }, [dispatch, isAuth, router]);

  // Обрабатываем ошибки прямо в рендере
  const displayError = error
    ? error.includes("401") ||
      error.includes("AUTH") ||
      error.includes("authorization")
      ? "Требуется авторизация"
      : error
    : "";

  if (!isAuth) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Перенаправление...</div>
      </div>
    );
  }

  if (displayError === "Требуется авторизация") {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          Для просмотра избранных треков войдите в аккаунт
        </div>
        <Link href="/auth/signin">
          <button className={styles.retryButton}>Войти</button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Загрузка избранных треков...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        <button
          className={styles.retryButton}
          onClick={() => dispatch(loadFavoriteTracks())}
        >
          Попробовать снова
        </button>
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
