"use client";

import styles from "./centerblock.module.css";
import classnames from "classnames";
import Search from "../Search/Search";

import Filter from "../Filter/Filter";
import Track from "../Track/Track";
import { useAppSelector } from "@/Store/store";

import { useMemo } from "react";
import { TrackTypes } from "@/SharedTypes/SharedTypes";

interface CenterblockProps {
  tracks?: TrackTypes[];
  title?: string;
  isFavoritePage?: boolean;
}

export default function Centerblock({
  title = "Треки",
  isFavoritePage = false,
}: CenterblockProps) {
  const { currentPlaylist, favoriteTracks, filteredFavoriteTracks } =
    useAppSelector((state) => state.tracks);

  console.log("треки", currentPlaylist);

  const displayTracks = useMemo(() => {
    if (isFavoritePage) {
      return filteredFavoriteTracks && filteredFavoriteTracks.length > 0
        ? filteredFavoriteTracks
        : favoriteTracks || [];
    } else {
      return currentPlaylist && currentPlaylist.length > 0
        ? currentPlaylist
        : [];
    }
  }, [isFavoritePage, filteredFavoriteTracks, favoriteTracks, currentPlaylist]);

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
