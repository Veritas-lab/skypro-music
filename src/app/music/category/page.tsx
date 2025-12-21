"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSelectionById } from "@/app/services/tracks/tracksApi";
import { TrackTypes } from "@/SharedTypes/Shared.Types";
import Centerblock from "@/components/CenterBlock/CenterBlock";
import styles from "../../musicLayout.module.css";

export default function CategoryPage() {
  const params = useParams<{ id: string }>();
  const [tracks, setTracks] = useState<TrackTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectionName, setSelectionName] = useState("");

  useEffect(() => {
    const fetchSelection = async () => {
      try {
        setLoading(true);
        setError(null);
        const selection = await getSelectionById(params.id);
        setTracks(selection.items || []);

        const customNames: { [key: string]: string } = {
          "1": "Плейлист дня",
          "2": "100 танцевальных хитов",
          "3": "Инди-заряд",
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
  }, [params.id]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Загрузка подборки...</div>
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

  return <Centerblock tracks={tracks} title={selectionName} />;
}
