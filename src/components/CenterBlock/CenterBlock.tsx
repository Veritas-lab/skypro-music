"use client";

import styles from "./centerblock.module.css";
import classnames from "classnames";
import Search from "../Search/Search";
import { data } from "@/data";
import Filter from "../Filter/Filter";
import Track from "../Track/Track";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import { setCurrentPlaylist } from "@/Store/Features/Trackslice";
import { useEffect, useMemo } from "react";
import { TrackTypes } from "@/SharedTypes/SharedTypes";

interface CenterblockProps {
  tracks?: TrackTypes[];
  title?: string;
  isFavoritePage?: boolean;
  isCategoryPage?: boolean; // Добавляем флаг для страниц категорий
}

export default function Centerblock({
  tracks = data,
  title = "Треки",
  isFavoritePage = false,
  isCategoryPage = false, // По умолчанию false
}: CenterblockProps) {
  const dispatch = useAppDispatch();
  const { currentPlaylist, favoriteTracks, filteredFavoriteTracks } =
    useAppSelector((state) => state.tracks);

  const validTracks = useMemo(() => {
    return (tracks || data).filter((track) => track && track._id);
  }, [tracks]);

  // Обработка данных для разных типов страниц
  useEffect(() => {
    // Для страниц категорий - используем переданные треки
    if (isCategoryPage && validTracks.length > 0) {
      dispatch(setCurrentPlaylist(validTracks));
    }
    // Для избранного
    else if (isFavoritePage) {
      const displayTracks =
        filteredFavoriteTracks && filteredFavoriteTracks.length > 0
          ? filteredFavoriteTracks
          : favoriteTracks || [];

      if (displayTracks.length > 0) {
        dispatch(setCurrentPlaylist(displayTracks));
      }
    }
    // Для главной страницы (по умолчанию)
    else if (title === "Треки" && validTracks.length > 0) {
      dispatch(setCurrentPlaylist(validTracks));
    }
  }, [
    dispatch,
    validTracks,
    title,
    isFavoritePage,
    isCategoryPage,
    favoriteTracks,
    filteredFavoriteTracks,
  ]);

  const displayTracks = useMemo(() => {
    // Для страниц категорий - всегда показываем переданные треки
    if (isCategoryPage) {
      return validTracks;
    }
    // Для избранного
    if (isFavoritePage) {
      return filteredFavoriteTracks && filteredFavoriteTracks.length > 0
        ? filteredFavoriteTracks
        : favoriteTracks || [];
    }
    // Для главной страницы
    return currentPlaylist && currentPlaylist.length > 0
      ? currentPlaylist
      : validTracks;
  }, [
    isCategoryPage,
    validTracks,
    isFavoritePage,
    filteredFavoriteTracks,
    favoriteTracks,
    currentPlaylist,
  ]);

  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>{title}</h2>
      <Filter />
      <div className={styles.centerblock__content}>
        <div className={styles.content__title}>
          <div className={classnames(styles.playlistTitle__col, styles.col01)}>
            Трек
          </div>
          <div className={classnames(styles.playlistTitle__col, styles.col02)}>
            Исполнитель
          </div>
          <div className={classnames(styles.playlistTitle__col, styles.col03)}>
            Альбом
          </div>
          <div className={classnames(styles.playlistTitle__col, styles.col04)}>
            <svg className={styles.playlistTitle__svg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
            </svg>
          </div>
        </div>
        <div className={styles.content__playlist}>
          {displayTracks && displayTracks.length > 0 ? (
            displayTracks.map((track, index) => (
              <Track
                track={track}
                key={track._id || `track-${index}`}
                index={index}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              {isFavoritePage
                ? "В избранном пока нет треков"
                : "Треки не найдены. Попробуйте обновить страницу."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
