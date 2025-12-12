"use client";

import styles from "./track.module.css";
import { TrackTypes } from "@/sharedTypes/Shared.Types";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import { formatTime } from "@/utils/helpers";
import Link from "next/link";
import { setCurrentTrack, setIsPlay } from "@/Store/Features/Trackslice";

type trackTypeProp = {
  track: TrackTypes;
};

export default function Track({ track }: trackTypeProp) {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);

  const isCurrent = currentTrack && currentTrack._id === track._id;

  const handleTrackClick = () => {
    dispatch(setCurrentTrack(track));
    dispatch(setIsPlay(true));
  };

  return (
    <div className={styles.playlist__item} onClick={handleTrackClick}>
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div
            className={styles.track__titleImage}
            style={{ position: "relative" }}
          >
            <svg className={styles.track__titleSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
            </svg>
            {isCurrent && (
              <span
                className={isPlay ? styles.pulseDot : styles.staticDot}
              ></span>
            )}
          </div>
          <div className="track__title-text">
            <Link className={styles.track__titleLink} href="">
              {track.name}
              <span className={styles.track__titleSpan}></span>
            </Link>
          </div>
        </div>
        <div className={styles.track__author}>
          <Link className={styles.track__authorLink} href="">
            {track.author}
          </Link>
        </div>
        <div className={styles.track__album}>
          <Link className={styles.track__albumLink} href="">
            {track.album}
          </Link>
        </div>
        <div className="track__time">
          <svg className={styles.track__timeSvg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
          </svg>
          <span className={styles.track__timeText}>
            {formatTime(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
