"use client";

import Centerblock from "@/components/CenterBlock/CenterBlock";
import { useAppSelector } from "@/Store/store";
import styles from "../musicLayout.module.css";

export default function Home() {
  const { allTracks, fetchIsLoading, fetchError } = useAppSelector(
    (state) => state.tracks,
  );

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
