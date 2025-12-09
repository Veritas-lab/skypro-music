"use client";
import { useState, useMemo } from "react";
import styles from "./centerblock.module.css";
import { data } from "../../data";
import Search from "../Search/Search";
import Filter from "../Filter/Filter";
import Track from "../Track/Track";
import classNames from "classnames";
import { TrackTypes } from "../../sharedTypes/Shared.Types";

export default function CenterBlock() {
  // Состояние для хранения всех треков
  const [allTracks] = useState<TrackTypes[]>(data);

  // Состояние для фильтров
  const [filters, setFilters] = useState({
    author: null as string | null,
    year: null as number | null,
    sortOrder: null as string | null,
    genre: null as string[] | null,
  });

  // Обработчик изменения фильтров
  const handleFilterChange = (newFilters: {
    author: string | null;
    year: number | null;
    sortOrder: string | null;
    genre: string[] | null;
  }) => {
    setFilters(newFilters);
  };

  // Применяем фильтры к данным с помощью useMemo для оптимизации
  const filteredTracks = useMemo(() => {
    let result = [...allTracks];

    // Фильтрация по автору
    if (filters.author) {
      result = result.filter((track) => track.author === filters.author);
    }

    // Фильтрация по году
    if (filters.year) {
      result = result.filter((track) => track.release_date === filters.year);
    }

    // Фильтрация по жанру
    if (filters.genre && filters.genre.length > 0) {
      result = result.filter((track) =>
        filters.genre!.some((genre) => track.genre.includes(genre))
      );
    }

    // Сортировка
    if (filters.sortOrder) {
      switch (filters.sortOrder) {
        case "Сначала новые":
          result.sort((a, b) => b.release_date - a.release_date);
          break;
        case "Сначала старые":
          result.sort((a, b) => a.release_date - b.release_date);
          break;
        case "По умолчанию":
          // Возвращаем исходный порядок по ID
          result.sort((a, b) => a._id - b._id);
          break;
      }
    }

    return result;
  }, [allTracks, filters]);

  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>Треки</h2>

      {/* Передаем данные и обработчик в Filter */}
      <Filter data={allTracks} onFilterChange={handleFilterChange} />

      <div className={styles.centerblock__content}>
        <div className={styles.content__title}>
          <div className={classNames(styles.playlistTitle__col, styles.col01)}>
            Трек
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col02)}>
            Исполнитель
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col03)}>
            Альбом
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col04)}>
            <svg className={styles.playlistTitle__svg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
            </svg>
          </div>
        </div>

        <div className={styles.content__playlist}>
          {/* Используем компонент Track для каждого отфильтрованного трека */}
          {filteredTracks.map((track) => (
            <Track key={track._id} track={track} />
          ))}

          {/* Сообщение, если треки не найдены */}
          {filteredTracks.length === 0 && (
            <div className={styles.noResults}>
              Треки не найдены. Попробуйте изменить параметры фильтрации.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
