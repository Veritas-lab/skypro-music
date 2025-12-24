"use client";

import styles from "./track.module.css";
import { TrackTypes } from "@/SharedTypes/SharedTypes";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import { formatTime } from "@/utils/helpers";
import Link from "next/link";
import {
  setCurrentTrack,
  setIsPlay,
  setCurrentIndex,
  toggleFavorite,
  loadFavoriteTracks,
} from "@/Store/Features/Trackslice";
import { useEffect } from "react";

type trackTypeProp = {
  track: TrackTypes;
  index: number;
};

export default function Track({ track, index }: trackTypeProp) {
  const dispatch = useAppDispatch();
  const { currentTrack, isPlay, favoriteTracksIds } = useAppSelector(
    (state) => state.tracks,
  );

  useEffect(() => {
    dispatch(loadFavoriteTracks());
  }, [dispatch]);

  if (!track) {
    return null;
  }

  const isCurrent = currentTrack && track && currentTrack._id === track._id;
  const isFavorite = favoriteTracksIds.includes(track._id.toString());

  const handleTrackClick = () => {
    if (!track || !track.track_file) {
      return;
    }
    dispatch(setCurrentTrack(track));
    dispatch(setCurrentIndex(index));
    dispatch(setIsPlay(true));
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(track));
  };

  return (
    <div className={styles.playlist__item} onClick={handleTrackClick}>
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div className={styles.track__titleImage}>
            <svg className={styles.track__titleSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
            </svg>
            {isCurrent && (
              <div
                className={isPlay ? styles.pulseDot : styles.staticDot}
              ></div>
            )}
          </div>
          <div className={styles.track__titleText}>
            <Link className={styles.track__titleLink} href="">
              {track.name || "Unknown Track"}
            </Link>
          </div>
        </div>
        <div className={styles.track__author}>
          <Link className={styles.track__authorLink} href="">
            {track.author || "Unknown Artist"}
          </Link>
        </div>
        <div className={styles.track__album}>
          <Link className={styles.track__albumLink} href="">
            {track.album || "Unknown Album"}
          </Link>
        </div>
        <div className={styles.track__time}>
          <svg
            className={`${styles.track__timeSvg} ${isFavorite ? styles.track__timeSvgActive : ""}`}
            onClick={handleFavoriteClick}
          >
            <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
          </svg>
          <span className={styles.track__timeText}>
            {formatTime(track.duration_in_seconds || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
