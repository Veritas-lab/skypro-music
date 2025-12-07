"use client";

import { useState } from "react";
import styles from "./Filter.module.css";
import FilterItem from "../FilterItem/FilterItem";
import { getUniqueValueByKey } from "../../utils/helpers";
import { TrackTypes } from "../../sharedTypes/Shared.Types";
import classNames from "classnames";

interface FilterProps {
  data: TrackTypes[];
  onFilterChange?: (filters: {
    author: string | null;
    year: number | null;
    sortOrder: string | null;
    genre: string[] | null;
  }) => void;
}

export default function Filter({ data, onFilterChange }: FilterProps) {
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);

  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSortOrder, setSelectedSortOrder] = useState<string | null>(
    null
  );
  const [selectedGenre, setSelectedGenre] = useState<string[] | null>(null);

  const closeAllModals = () => {
    setIsAuthorModalOpen(false);
    setIsYearModalOpen(false);
    setIsGenreModalOpen(false);
  };

  const authors = getUniqueValueByKey(data, "author");
  const releaseYears = getUniqueValueByKey(
    data,
    "release_date" as keyof TrackTypes
  )
    .map(Number)
    .sort((a, b) => a - b);
  const genres = getUniqueValueByKey(data, "genre");

  const handleSelectAuthor = (author: string) => {
    const newAuthor = author === selectedAuthor ? null : author;
    setSelectedAuthor(newAuthor);
    setIsAuthorModalOpen(false);
    onFilterChange?.({
      author: newAuthor,
      year: selectedYear,
      sortOrder: selectedSortOrder,
      genre: selectedGenre,
    });
  };

  const handleSelectYear = (selected: string) => {
    // Обрабатываем специальные опции сортировки
    if (
      ["По умолчанию", "Сначала новые", "Сначала старые"].includes(selected)
    ) {
      setSelectedSortOrder(selected);
      setSelectedYear(null);
      onFilterChange?.({
        author: selectedAuthor,
        year: null,
        sortOrder: selected,
        genre: selectedGenre,
      });
    } else {
      // Обрабатываем выбор конкретного года
      const yearNumber = Number(selected);
      const newYear = yearNumber === selectedYear ? null : yearNumber;
      setSelectedYear(newYear);
      setSelectedSortOrder(null);
      onFilterChange?.({
        author: selectedAuthor,
        year: newYear,
        sortOrder: null,
        genre: selectedGenre,
      });
    }
    setIsYearModalOpen(false);
  };

  const handleSelectGenre = (genre: string) => {
    let newGenres: string[] | null;
    if (selectedGenre?.includes(genre)) {
      newGenres = selectedGenre.filter((g) => g !== genre);
      if (newGenres.length === 0) newGenres = null;
    } else {
      newGenres = [...(selectedGenre || []), genre];
    }

    setSelectedGenre(newGenres);
    setIsGenreModalOpen(false);
    onFilterChange?.({
      author: selectedAuthor,
      year: selectedYear,
      sortOrder: selectedSortOrder,
      genre: newGenres,
    });
  };

  const getButtonLabel = (type: "author" | "year" | "genre") => {
    switch (type) {
      case "author":
        return selectedAuthor
          ? `исполнителю: ${selectedAuthor}`
          : "исполнителю";
      case "year":
        if (selectedSortOrder) {
          return selectedSortOrder === "По умолчанию"
            ? "году выпуска"
            : `году выпуска: ${selectedSortOrder}`;
        }
        return selectedYear ? `году выпуска: ${selectedYear}` : "году выпуска";
      case "genre":
        return selectedGenre ? `жанру: ${selectedGenre.join(", ")}` : "жанру";
    }
  };

  return (
    <div className={styles.centerblock__filter}>
      <div className={styles.filter__title}>Искать по:</div>

      <div style={{ position: "relative" }}>
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
          {getButtonLabel("author")}
          {isAuthorModalOpen && (
            <FilterItem
              items={[...authors]}
              onSelectItem={handleSelectAuthor}
            />
          )}
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <div
          className={classNames(styles.filter__button, {
            [styles.active]:
              isYearModalOpen || selectedYear || selectedSortOrder,
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
          {getButtonLabel("year")}
          {isYearModalOpen && (
            <FilterItem
              items={[
                "По умолчанию",
                "Сначала новые",
                "Сначала старые",
                ...releaseYears.map(String),
              ]}
              onSelectItem={handleSelectYear}
            />
          )}
        </div>
      </div>

      <div style={{ position: "relative" }}>
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
          {getButtonLabel("genre")}
          {isGenreModalOpen && (
            <FilterItem items={[...genres]} onSelectItem={handleSelectGenre} />
          )}
        </div>
      </div>
    </div>
  );
}
