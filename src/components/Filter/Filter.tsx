"use client";

import { useState } from "react";
import styles from "./Filter.module.css";
import FilterItem from "../FilterItem/FilterItem";
import { getUniqueValueByKey } from "../../utils/helpers";
import { TrackTypes } from "../../SharedTypes/Shared.Types";
import classNames from "classnames";

interface FilterProps {
  data: TrackTypes[];
}

export default function Filter({ data }: FilterProps) {
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);

  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null); // Изменено с string[] на string

  const closeAllModals = () => {
    setIsAuthorModalOpen(false);
    setIsYearModalOpen(false);
    setIsGenreModalOpen(false);
  };

  const authors = getUniqueValueByKey(data, "author");
  const releaseYears = getUniqueValueByKey(
    data,
    "release_date" as keyof TrackTypes,
  )
    .map(Number)
    .sort((a, b) => a - b);
  const genres = getUniqueValueByKey(data, "genre");

  const handleSelectAuthor = (author: string) => {
    setSelectedAuthor(author);
    setIsAuthorModalOpen(false);
  };

  const handleSelectYear = (year: string) => {
    // Принимаем строку
    const yearNumber = year === "По умолчанию" ? null : Number(year);
    setSelectedYear(yearNumber);
    setIsYearModalOpen(false);
  };

  const handleSelectGenre = (genre: string) => {
    // Принимаем строку, а не массив
    setSelectedGenre(genre);
    setIsGenreModalOpen(false);
  };

  return (
    <div className={styles.centerblock__filter}>
      <div className={styles.filter__title}>Искать по:</div>

      <div
        className={classNames(styles.filter__button, {
          [styles.active]: isAuthorModalOpen || selectedAuthor,
        })}
        onClick={() => {
          if (!isAuthorModalOpen) {
            closeAllModals();
            setIsAuthorModalOpen(true);
          } else {
            setIsAuthorModalOpen(false);
          }
        }}
      >
        {selectedAuthor ? selectedAuthor : "исполнителю"}
        {isAuthorModalOpen && (
          <FilterItem items={[...authors]} onSelectItem={handleSelectAuthor} />
        )}
      </div>

      <div
        className={classNames(styles.filter__button, {
          [styles.active]: isYearModalOpen || selectedYear,
        })}
        onClick={() => {
          if (!isYearModalOpen) {
            closeAllModals();
            setIsYearModalOpen(true);
          } else {
            setIsYearModalOpen(false);
          }
        }}
      >
        {selectedYear ? selectedYear : "году выпуска"}
        {isYearModalOpen && (
          <FilterItem
            items={[
              "По умолчанию",
              "Сначала новые",
              "Сначала старые",
              ...releaseYears.map(String),
            ]}
            onSelectItem={handleSelectYear} // Исправлено: передаем функцию, а не ее вызов
          />
        )}
      </div>

      <div
        className={classNames(styles.filter__button, {
          [styles.active]: isGenreModalOpen || selectedGenre,
        })}
        onClick={() => {
          if (!isGenreModalOpen) {
            closeAllModals();
            setIsGenreModalOpen(true);
          } else {
            setIsGenreModalOpen(false);
          }
        }}
      >
        {selectedGenre ? selectedGenre : "жанру"}
        {isGenreModalOpen && (
          <FilterItem
            items={[...genres]}
            onSelectItem={handleSelectGenre} // Исправлено: передаем функцию, а не ее вызов
          />
        )}
      </div>
    </div>
  );
}
