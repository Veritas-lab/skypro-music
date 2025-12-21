"use client";

import styles from "./centerblock.module.css";
import classnames from "classnames";
import Search from "../Search/Search";
import { data } from "@/data";
import Filter from "../Filter/Filter";
import Track from "../Track/Track";
import { useAppDispatch } from "@/Store/store";
import { setCurrentPlaylist } from "@/Store/Features/Trackslice";
import { useEffect, useMemo } from "react";
import { TrackTypes } from "@/SharedTypes/Shared.Types";

interface CenterblockProps {
  tracks?: TrackTypes[];
  title?: string;
}

export default function Centerblock({
  tracks = data,
  title = "Треки",
}: CenterblockProps) {
  const dispatch = useAppDispatch();

  const validTracks = useMemo(() => {
    return (tracks || data).filter((track) => track && track._id);
  }, [tracks]);

  useEffect(() => {
    if (title === "Треки" && validTracks.length > 0) {
      dispatch(setCurrentPlaylist(validTracks));
    }
  }, [dispatch, validTracks, title]);

  const displayTracks = validTracks.length > 0 ? validTracks : data;

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
          {displayTracks.length > 0 ? (
            displayTracks.map((track, index) => (
              <Track
                track={track}
                key={track._id || `track-${index}`}
                index={index}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              Треки не найдены. Попробуйте обновить страницу.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
