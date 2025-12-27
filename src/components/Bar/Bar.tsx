"use client";

import Link from "next/link";
import styles from "./bar.module.css";
import classnames from "classnames";
import { useRef, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import {
  setIsPlay,
  setShuffle,
  setRepeat,
  nextTrack,
  prevTrack,
  toggleFavorite,
} from "@/Store/Features/Trackslice";

export default function Bar() {
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);
  const shuffle = useAppSelector((state) => state.tracks.shuffle);
  const repeat = useAppSelector((state) => state.tracks.repeat);
  const { favoriteTracksIds } = useAppSelector((state) => state.tracks);
  const dispatch = useAppDispatch();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const isFavorite = currentTrack
    ? favoriteTracksIds.includes(currentTrack._id.toString())
    : false;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleEnded = () => {
    if (repeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      dispatch(nextTrack());
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const clickPercentage = clickPosition / progressBarWidth;

    const newTime = clickPercentage * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleLikeClick = () => {
    if (currentTrack) {
      dispatch(toggleFavorite(currentTrack));
    }
  };

  useEffect(() => {
    if (audioRef.current && isPlay && currentTrack) {
      audioRef.current.play().catch(() => {});
    } else if (audioRef.current && !isPlay) {
      audioRef.current.pause();
    }
  }, [currentTrack, isPlay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTime(0);
  }, [currentTrack]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlay) {
      audioRef.current.pause();
      dispatch(setIsPlay(false));
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
      dispatch(setIsPlay(true));
    }
  };

  const handleShuffle = () => {
    dispatch(setShuffle(!shuffle));
  };

  const handleRepeat = () => {
    dispatch(setRepeat(!repeat));
  };

  const handleNext = () => {
    dispatch(nextTrack());
  };

  const handlePrev = () => {
    dispatch(prevTrack());
  };

  if (!currentTrack) return <></>;

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.bar}>
      <audio
        ref={audioRef}
        src={currentTrack?.track_file}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      ></audio>

      <div className={styles.bar__content}>
        <div
          className={styles.bar__playerProgress}
          onClick={handleProgressClick}
        >
          <div
            className={styles.bar__progressFill}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div
                className={classnames(styles.player__btnPrev, styles.btn)}
                onClick={handlePrev}
              >
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>

              <div
                className={classnames(styles.player__btnPlay, styles.btn)}
                onClick={handlePlayPause}
              >
                <svg className={styles.player__btnPlaySvg}>
                  <use
                    xlinkHref={`/img/icon/sprite.svg#icon-${isPlay ? "pause" : "play"}`}
                  ></use>
                </svg>
              </div>

              <div
                className={classnames(styles.player__btnNext, styles.btn)}
                onClick={handleNext}
              >
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>

              <div
                className={classnames(
                  styles.player__btnRepeat,
                  styles.btnIcon,
                  { [styles.active]: repeat },
                )}
                onClick={handleRepeat}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>

              <div
                className={classnames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                  { [styles.active]: shuffle },
                )}
                onClick={handleShuffle}
              >
                <svg className={styles.player__btnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  <svg className={styles.trackPlay__svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>

                <div className={styles.trackPlay__author}>
                  <Link className={styles.trackPlay__authorLink} href="#">
                    {currentTrack.name}
                  </Link>
                </div>
                <div className={styles.trackPlay__album}>
                  <Link className={styles.trackPlay__albumLink} href="#">
                    {currentTrack.author}
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlay__likeDis}>
                <div
                  className={classnames(
                    styles.trackPlay__like,
                    styles.btnIcon,
                    { [styles.active]: isFavorite },
                  )}
                  onClick={handleLikeClick}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.player__time}>
            <span className={styles.player__currentTime}>
              {formatTime(currentTime)}
            </span>
            <span> / </span>
            <span className={styles.player__duration}>
              {formatTime(duration)}
            </span>
          </div>

          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div className={styles.volume__image}>
                <svg className={styles.volume__svg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={classnames(styles.volume__progress, styles.btn)}>
                <input
                  className={classnames(
                    styles.volume__progressLine,
                    styles.btn,
                  )}
                  type="range"
                  name="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
