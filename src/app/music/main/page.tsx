"use client";

import Centerblock from "@/components/CenterBlock/CenterBlock";
import { useAppSelector } from "@/Store/store";
import styles from "../musicLayout.module.css";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function Home() {
  const { allTracks, fetchIsLoading, fetchError } = useAppSelector(
    (state) => state.tracks,
  );
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    if (allTracks.length > 0 && !fetchIsLoading) {
      const timer = setTimeout(() => {
        setShowSpinner(false);
      }, 300);
      return () => clearTimeout(timer);
    }

    if (fetchIsLoading) {
      setShowSpinner(true);
    }
  }, [allTracks.length, fetchIsLoading]);

  if (showSpinner || fetchIsLoading) {
    return (
      <div className={styles.centerblock}>
        <LoadingSpinner text="Загрузка треков..." />
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

  return (
    <Centerblock tracks={allTracks} title="Треки" isFavoritePage={false} />
  );
}
