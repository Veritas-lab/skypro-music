"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSelectionById } from "@/app/services/tracks/tracksApi";
import Centerblock from "@/components/CenterBlock/CenterBlock";
import LoadingSkeleton from "@/components/LoadingSkeleton/LoadingSkeleton";
import styles from "../../musicLayout.module.css";
import { useAppDispatch } from "@/Store/store";
import { setCurrentPlaylist, setCategoryTracks } from "@/Store/Features/Trackslice";

export default function CategoryPage() {
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectionName, setSelectionName] = useState("");

  useEffect(() => {
    const fetchSelection = async () => {
      try {
        setLoading(true);
        setError(null);
        const selection = await getSelectionById(params.id);
        const loadedTracks = selection.items || [];
        
        // Сохраняем исходные треки подборки для фильтрации
        dispatch(setCategoryTracks(loadedTracks));
        // Устанавливаем треки как текущий плейлист для плеера
        dispatch(setCurrentPlaylist(loadedTracks));

        const customNames: { [key: string]: string } = {
          "2": "Плейлист дня",
          "3": "100 танцевальных хитов",
          "4": "Инди-заряд",
        };

        const customName =
          customNames[params.id] || selection.name || `Подборка ${params.id}`;
        setSelectionName(customName);
      } catch (err) {
        setError("Не удалось загрузить подборку");
        console.error("Error fetching selection:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSelection();
    }
  }, [params.id, dispatch]);

  if (loading) {
    return (
      <div className={styles.mainWrapper}>
        <div className={styles.centerblock}>
          <div className={styles.centerblockContent}>
            <h2 className={styles.centerblockTitle}>Загрузка подборки...</h2>
            <LoadingSkeleton count={8} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
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
  // Это позволяет работать фильтрации и поиску на странице подборки
  return <Centerblock title={selectionName} />;
}
