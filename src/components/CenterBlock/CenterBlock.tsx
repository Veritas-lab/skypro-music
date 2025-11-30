import Link from "next/link";
import styles from "./centerblock.module.css";
import classnames from "classnames";
import Search from "../Search/Search";
import { data } from "@/data";
import { formatTime } from "@/utils/helper";
import Filter from "../Filter/Filter";

export default function Centerblock() {
  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>Треки</h2>
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
          {data.map((track) => (
            <div key={track._id} className={styles.playlist__item}>
              <div className={styles.playlist__track}>
                <div className={styles.track__title}>
                  <div className={styles.track__titleImage}>
                    <svg className={styles.track__titleSvg}>
                      <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                    </svg>
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
          ))}
        </div>
      </div>
    </div>
  );
}
