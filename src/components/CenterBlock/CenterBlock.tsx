"use client";

import styles from "./centerblock.module.css";
import classnames from "classnames";
import Search from "../Search/Search";
import Filter from "../Filter/Filter";
import Track from "../Track/Track";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import { setCurrentPlaylist, loadAllTracks } from "@/Store/Features/Trackslice";
import { useEffect, useMemo, useState } from "react";
import { TrackTypes } from "@/SharedTypes/SharedTypes";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

interface CenterblockProps {
  tracks?: TrackTypes[];
  title?: string;
  playlistId?: string;
  isFavoritePage?: boolean;
}

export default function Centerblock({
  tracks = [],
  title = "Треки",
  playlistId,
  isFavoritePage = false,
}: CenterblockProps) {
  const dispatch = useAppDispatch();
  const { allTracks, fetchIsLoading, fetchError } = useAppSelector(
    (state) => state.tracks,
  );
  const [localLoading, setLocalLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTracks, setFilteredTracks] = useState<TrackTypes[]>([]);

  // Загружаем все треки если это главная страница и нет переданных tracks
  useEffect(() => {
    if (title === "Треки" && allTracks.length === 0 && !tracks.length) {
      dispatch(loadAllTracks());
    }
  }, [dispatch, title, allTracks.length, tracks.length]);

  // Определяем какие треки отображать
  const sourceTracks = useMemo(() => {
    if (tracks && tracks.length > 0) {
      return tracks;
    }
    return title === "Треки" ? allTracks : tracks;
  }, [tracks, allTracks, title]);

  // Устанавливаем текущий плейлист
  useEffect(() => {
    if (sourceTracks.length > 0) {
      dispatch(setCurrentPlaylist(sourceTracks));
    }
  }, [dispatch, sourceTracks]);

  // Применяем поиск
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTracks(sourceTracks);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = sourceTracks.filter(
      (track) =>
        track.name.toLowerCase().includes(query) ||
        track.author.toLowerCase().includes(query) ||
        track.album.toLowerCase().includes(query),
    );
    setFilteredTracks(filtered);
  }, [searchQuery, sourceTracks]);

  // Обработчик поиска
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Показываем загрузку если нужно
  const isLoading = fetchIsLoading || localLoading;
  const displayTracks = searchQuery ? filteredTracks : sourceTracks;

  if (isLoading) {
    return (
      <div className={styles.centerblock}>
        <div className={styles.centerblock__h2}>{title}</div>
        <LoadingSpinner text="Загрузка треков..." />
      </div>
    );
  }

  if (fetchError && title === "Треки") {
    return (
      <div className={styles.centerblock}>
        <h2 className={styles.centerblock__h2}>{title}</h2>
        <div className={styles.errorContainer}>
          <div className={styles.error}>{fetchError}</div>
          <button
            className={styles.retryButton}
            onClick={() => dispatch(loadAllTracks())}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.centerblock}>
      <Search onSearch={handleSearch} />
      <h2 className={styles.centerblock__h2}>{title}</h2>
      <Filter />

      <div className={styles.centerblock__content}>
        {displayTracks.length > 0 ? (
          <>
            <div className={styles.content__title}>
              <div
                className={classnames(styles.playlistTitle__col, styles.col01)}
              >
                Трек
              </div>
              <div
                className={classnames(styles.playlistTitle__col, styles.col02)}
              >
                Исполнитель
              </div>
              <div
                className={classnames(styles.playlistTitle__col, styles.col03)}
              >
                Альбом
              </div>
              <div
                className={classnames(styles.playlistTitle__col, styles.col04)}
              >
                <svg className={styles.playlistTitle__svg} aria-hidden="true">
                  <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
                </svg>
              </div>
            </div>

            <div className={styles.content__playlist}>
              {displayTracks.map((track, index) => (
                <Track
                  track={track}
                  key={track._id || `track-${index}`}
                  index={index}
                  playlistId={playlistId}
                />
              ))}
            </div>
          </>
        ) : (
          <div className={styles.emptyStateContainer}>
            <div className={styles.emptyState}>
              {searchQuery ? (
                <>
                  <p>По запросу "{searchQuery}" ничего не найдено</p>
                  <p>Попробуйте изменить поисковый запрос</p>
                </>
              ) : isFavoritePage ? (
                <>
                  <p>У вас пока нет избранных треков</p>
                  <p>Нажмите на ♡ чтобы добавить трек в избранное</p>
                </>
              ) : (
                <>
                  <p>Треки не найдены</p>
                  <p>Попробуйте обновить страницу</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {displayTracks.length > 0 && (
        <div className={styles.trackCount}>
          Найдено треков: {displayTracks.length}
        </div>
      )}
    </div>
  );
}
