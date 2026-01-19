"use client";

import Centerblock from "@/components/CenterBlock/CenterBlock";
import LoadingSkeleton from "@/components/LoadingSkeleton/LoadingSkeleton";
import { useAppSelector } from "@/Store/store";

import styles from "../musicLayout.module.css";

export default function Home() {
  const { fetchIsLoading, fetchError } = useAppSelector(
    (state) => state.tracks
  );

  if (fetchIsLoading) {
    return (
      <div className={styles.mainWrapper}>
        <div className={styles.centerblock}>
          <div className={styles.centerblockContent}>
            <h2 className={styles.centerblockTitle}>Загрузка треков...</h2>
            <LoadingSkeleton count={10} />
          </div>
        </div>
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

  // Не передаем tracks - CenterBlock будет использовать currentPlaylist из Redux
  // Это позволяет работать фильтрации и поиску
  return <Centerblock title="Треки" />;
}
