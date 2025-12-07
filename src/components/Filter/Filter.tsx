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
    genre: string[] | null;
  }) => void;
}

export default function Filter({ data, onFilterChange }: FilterProps) {
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);

  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
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

  // Используем выбранные фильтры
  const filteredData = data.filter((track) => {
    if (selectedAuthor && track.author !== selectedAuthor) return false;
    if (selectedYear && track.release_date !== selectedYear) return false;
    if (selectedGenre && !selectedGenre.some((g) => track.genre.includes(g)))
      return false;
    return true;
  });

  const handleSelectAuthor = (author: string) => {
    const newAuthor = author === selectedAuthor ? null : author;
    setSelectedAuthor(newAuthor);
    setIsAuthorModalOpen(false);
    onFilterChange?.({
      author: newAuthor,
      year: selectedYear,
      genre: selectedGenre,
    });
  };

  const handleSelectYear = (year: string) => {
    if (["По умолчанию", "Сначала новые", "Сначала старые"].includes(year)) {
      const newYear = null;
      setSelectedYear(newYear);
      onFilterChange?.({
        author: selectedAuthor,
        year: newYear,
        genre: selectedGenre,
      });
    } else {
      const yearNumber = Number(year);
      const newYear = yearNumber === selectedYear ? null : yearNumber;
      setSelectedYear(newYear);
      onFilterChange?.({
        author: selectedAuthor,
        year: newYear,
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
              selectedItem={selectedAuthor}
              onSelectItem={handleSelectAuthor}
            />
          )}
        </div>
      </div>

      <div style={{ position: "relative" }}>
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
          {getButtonLabel("year")}
          {isYearModalOpen && (
            <FilterItem
              items={[
                "По умолчанию",
                "Сначала новые",
                "Сначала старые",
                ...releaseYears.map(String),
              ]}
              selectedItem={selectedYear?.toString()}
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
            <FilterItem
              items={[...genres]}
              selectedItems={selectedGenre || []}
              onSelectItem={handleSelectGenre}
            />
          )}
        </div>
      </div>
    </div>
  );
}
