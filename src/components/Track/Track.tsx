"use client";

import styles from "./track.module.css";
import { TrackTypes } from "@/SharedTypes/SharedTypes";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import { formatTime } from "@/utils/helpers";
import {
  setCurrentTrack,
  setIsPlay,
  setCurrentIndex,
  loadFavoriteTracksFromApi,
  addToFavoritesApi,
  removeFromFavoritesApi,
} from "@/Store/Features/Trackslice";
import { useEffect, useState } from "react";

type trackTypeProp = {
  track: TrackTypes;
  index: number;
  playlistId?: string;
};

export default function Track({ track, index, playlistId }: trackTypeProp) {
  const dispatch = useAppDispatch();
  const {
    currentTrack,
    isPlay,
    favoriteTracksIds,
    favoriteLoading,
    favoriteError,
  } = useAppSelector((state) => state.tracks);

  const { access, isAuth } = useAppSelector((state) => state.auth);

  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    // Загружаем избранные треки из API при авторизации
    if (isAuth && access) {
      dispatch(loadFavoriteTracksFromApi(access));
    }
  }, [dispatch, isAuth, access]);

  if (!track) {
    return (
      <div className={styles.playlist__item}>
        <div className={styles.track__error}>Трек не найден</div>
      </div>
    );
  }

  const isCurrent = currentTrack && track && currentTrack._id === track._id;
  const isFavorite = favoriteTracksIds.includes(track._id.toString());

  const handleTrackClick = async () => {
    if (!track || !track.track_file) {
      setLocalError("Аудиофайл не доступен");
      return;
    }

    try {
      dispatch(setCurrentTrack(track));
      dispatch(setCurrentIndex(index));
      dispatch(setIsPlay(true));
      setLocalError(null);
    } catch (err: any) {
      console.error("Ошибка воспроизведения трека:", err);
      setLocalError("Не удалось воспроизвести трек");
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (favoriteLoading || localLoading) return;

    setLocalLoading(true);
    setLocalError(null);

    try {
      if (isAuth && access) {
        // Используем API для авторизованных пользователей
        if (isFavorite) {
          await dispatch(
            removeFromFavoritesApi({
              trackId: track._id.toString(),
              accessToken: access,
            }),
          ).unwrap();
        } else {
          await dispatch(
            addToFavoritesApi({
              trackId: track._id.toString(),
              accessToken: access,
            }),
          ).unwrap();
        }
      } else {
        // Используем локальное хранилище для неавторизованных
        // Здесь нужно будет использовать локальные методы
        // dispatch(toggleFavorite(track));
        setLocalError("Требуется авторизация");
      }
    } catch (err: unknown) {
      console.error("Ошибка изменения статуса избранного:", err);
      let errorMessage = "Не удалось изменить статус избранного";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setLocalError(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div
      className={`${styles.playlist__item} ${isCurrent ? styles.currentTrack : ""}`}
      onClick={handleTrackClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleTrackClick()}
      aria-label={`Воспроизвести трек ${track.name || "Неизвестный трек"}`}
    >
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div className={styles.track__titleImage}>
            <svg className={styles.track__titleSvg} aria-hidden="true">
              <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
            </svg>
            {isCurrent && (
              <div
                className={isPlay ? styles.pulseDot : styles.staticDot}
                aria-hidden="true"
              ></div>
            )}
          </div>
          <div className={styles.track__titleText}>
            <span className={styles.track__titleLink}>
              {track.name || "Неизвестный трек"}
            </span>
          </div>
        </div>
        <div className={styles.track__author}>
          <span className={styles.track__authorLink}>
            {track.author || "Неизвестный исполнитель"}
          </span>
        </div>
        <div className={styles.track__album}>
          <span className={styles.track__albumLink}>
            {track.album || "Неизвестный альбом"}
          </span>
        </div>
        <div className={styles.track__time}>
          <button
            className={styles.favoriteButton}
            onClick={handleFavoriteClick}
            disabled={favoriteLoading || localLoading}
            aria-label={
              isFavorite ? "Удалить из избранного" : "Добавить в избранное"
            }
            aria-pressed={isFavorite}
          >
            <svg
              className={`${styles.track__timeSvg} ${isFavorite ? styles.track__timeSvgActive : ""}`}
              aria-hidden="true"
            >
              <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
            </svg>
          </button>
          <span className={styles.track__timeText}>
            {formatTime(track.duration_in_seconds || 0)}
          </span>
          {(favoriteLoading || localLoading) && (
            <div className={styles.loadingSpinner} aria-hidden="true"></div>
          )}
        </div>
      </div>
      {(favoriteError || localError) && (
        <div className={styles.errorMessage} role="alert">
          {favoriteError || localError}
        </div>
      )}
    </div>
  );
}
