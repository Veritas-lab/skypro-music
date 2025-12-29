"use client";

import Centerblock from "@/components/CenterBlock/CenterBlock";
import { useAppSelector } from "@/Store/store";
import styles from "../musicLayout.module.css";
import { useEffect, useState } from "react";
import { loadFavoriteTracksAPI } from "@/Store/Features/Trackslice";
import { useAppDispatch } from "@/Store/store";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { favoriteTracks, favoriteLoading, favoritesLoaded } = useAppSelector(
    (state) => state.tracks,
  );
  const { isAuth } = useAppSelector((state) => state.auth);
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    if (!isAuth) {
      router.push("/");
      return;
    }

    const loadData = async () => {
      setShowSpinner(true);

      try {
        if (!favoritesLoaded) {
          await dispatch(loadFavoriteTracksAPI()).unwrap();
        }
      } catch (error) {
        console.error("Ошибка загрузки избранных треков:", error);
      } finally {
        setTimeout(() => setShowSpinner(false), 300);
      }
    };

    loadData();
  }, [dispatch, isAuth, router, favoritesLoaded]);

  if (!isAuth) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner text="Перенаправление на главную страницу..." />
      </div>
    );
  }

  if (showSpinner || favoriteLoading) {
    return (
      <div className={styles.centerblock}>
        <LoadingSpinner text="Загрузка ваших треков..." />
      </div>
    );
  }

  if (favoriteTracks.length === 0) {
    return (
      <div className={styles.centerblock}>
        <div className={styles.centerblock__search}></div>
        <h2 className={styles.centerblock__h2}>Мои треки</h2>
        <div className={styles.centerblock__content}>
          <div className={styles.emptyState}>
            <div
              style={{
                textAlign: "center",
                color: "#696969",
                fontSize: "18px",
                marginTop: "100px",
              }}
            >
              <p>В избранном пока нет треков</p>
              <p style={{ fontSize: "14px", marginTop: "10px", opacity: 0.7 }}>
                Добавьте треки в избранное, чтобы они появились здесь
              </p>
            </div>
          </div>
        </div>
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
