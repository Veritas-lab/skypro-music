"use client";
import Link from "next/link";
import styles from "./bar.module.css";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../../Store/store";
import { useEffect, useRef } from "react";
import { setIsPlay } from "../../Store/Features/Trackslice";

export default function Bar() {
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlay) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } else if (audioRef.current && !currentTrack) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      dispatch(setIsPlay(false));
    }
  }, [currentTrack, isPlay, dispatch]);

  const togglePlay = () => {
    if (currentTrack) {
      dispatch(setIsPlay(!isPlay));
    }
  };

  if (!currentTrack) return <></>;

  return (
    <div className={styles.bar}>
      <audio ref={audioRef} src={currentTrack?.track_file}></audio>
      <div className={styles.bar__content}>
        <div className={styles.bar__playerProgress}></div>
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div className={styles.player__btnPrev}>
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>
              <div
                onClick={togglePlay}
                className={classNames(styles.player__btnPlay, styles.btn)}
              >
                {isPlay ? (
                  <svg className={styles.player__btnPlaySvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-pause"></use>
                  </svg>
                ) : (
                  <svg className={styles.player__btnPlaySvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-play"></use>
                  </svg>
                )}
              </div>
              <div className={styles.player__btnNext}>
                <svg
                  onClick={() => alert("Еще не реализовано")}
                  className={styles.player__btnNextSvg}
                >
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>
              <div
                className={classNames(styles.player__btnRepeat, styles.btnIcon)}
              >
                <svg
                  onClick={() => alert("Еще не реализовано")}
                  className={styles.player__btnRepeatSvg}
                >
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div
                className={classNames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                )}
              >
                <svg
                  onClick={() => alert("Еще не реализовано")}
                  className={styles.player__btnShuffleSvg}
                >
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
                  <Link className={styles.trackPlay__authorLink} href="">
                    {currentTrack?.name}
                  </Link>
                </div>
                <div className={styles.trackPlay__album}>
                  <Link className={styles.trackPlay__albumLink} href="">
                    {currentTrack?.author}
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlay__dislike}>
                <div
                  className={classNames(
                    styles.player__btnShuffle,
                    styles.btnIcon,
                  )}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div
                  className={classNames(
                    styles.trackPlay__dislike,
                    styles.btnIcon,
                  )}
                >
                  <svg className={styles.trackPlay__dislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div className={styles.volume__image}>
                <svg className={styles.volume__svg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={classNames(styles.volume__progress, styles.btn)}>
                <input
                  className={classNames(
                    styles.volume__progressLine,
                    styles.btn,
                  )}
                  type="range"
                  name="range"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
