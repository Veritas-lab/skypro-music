"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./centerblock.module.css";
import classnames from "classnames";
import Search from "../Search/Search";
import { data } from "@/data";
import { formatTime } from "@/utils/helpers";
import Filter from "../Filter/Filter";
import type { TrackTypes } from "@/sharedTypes/Shared.Types";

export default function Centerblock() {
  const [filteredTracks, setFilteredTracks] = useState<TrackTypes[]>(data);
  const [activeFilters, setActiveFilters] = useState({
    authors: [] as string[],
    genres: [] as string[],
    yearSort: "",
  });

  // Функция для фильтрации треков
  const filterTracks = (
    authors: string[],
    genres: string[],
    yearSort: string
  ) => {
    let result = [...data];

    // Фильтрация по авторам
    if (authors.length > 0) {
      result = result.filter((track) => authors.includes(track.author));
    }

    // Фильтрация по жанрам
    if (genres.length > 0) {
      result = result.filter((track) =>
        genres.some((genre) => track.genre.includes(genre))
      );
    }

    // Сортировка по году
    if (yearSort) {
      result = [...result].sort((a, b) => {
        if (yearSort === "newest") {
          return b.release_date - a.release_date;
        } else {
          return a.release_date - b.release_date;
        }
      });
    }

    return result;
  };

  // Обработчик изменения фильтров
  const handleFilterChange = (filters: {
    authors: string[];
    genres: string[];
    yearSort: string;
  }) => {
    setActiveFilters(filters);
    const newFilteredTracks = filterTracks(
      filters.authors,
      filters.genres,
      filters.yearSort
    );
    setFilteredTracks(newFilteredTracks);
  };

  // Функция для отображения количества найденных треков
  const getFilterStatus = () => {
    if (filteredTracks.length === data.length) {
      return `Все треки (${data.length})`;
    }

    const activeFiltersCount =
      (activeFilters.authors.length > 0 ? 1 : 0) +
      (activeFilters.genres.length > 0 ? 1 : 0) +
      (activeFilters.yearSort ? 1 : 0);

    if (activeFiltersCount === 0) {
      return `Все треки (${data.length})`;
    }

    return `Найдено треков: ${filteredTracks.length} из ${data.length}`;
  };

  return (
    <div className={styles.centerblock}>
      <Search />
      <div className={styles.centerblock__header}>
        <h2 className={styles.centerblock__h2}>Треки</h2>
        <div className={styles.filterStatus}>{getFilterStatus()}</div>
      </div>
      <Filter onFilterChange={handleFilterChange} />
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
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track) => (
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
            ))
          ) : (
            <div className={styles.noResults}>
              <p>По вашему запросу ничего не найдено</p>
              <button
                className={styles.resetButton}
                onClick={() =>
                  handleFilterChange({
                    authors: [],
                    genres: [],
                    yearSort: "",
                  })
                }
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
