"use client";

import Centerblock from "@/components/CenterBlock/CenterBlock";
import { useAppSelector, useAppDispatch } from "@/Store/store";
import { useEffect } from "react";
import { loadFavoriteTracksAPI } from "@/Store/Features/Trackslice";
import styles from "../musicLayout.module.css";

export default function Home() {
  const dispatch = useAppDispatch();
  const { allTracks, fetchIsLoading, fetchError, favoritesLoaded } = useAppSelector(
    (state) => state.tracks,
  );
  const { isAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuth && !favoritesLoaded) {
      dispatch(loadFavoriteTracksAPI());
    }
  }, [isAuth, favoritesLoaded, dispatch]);

  if (fetchIsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Загрузка треков...</div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{fetchError}</div>
        <button
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return <Centerblock tracks={allTracks} title="Треки" />;
}
