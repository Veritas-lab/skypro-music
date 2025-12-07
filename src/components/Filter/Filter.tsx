"use client";

import { useState, useEffect, useRef } from "react";
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
  const [activeModal, setActiveModal] = useState<
    "author" | "year" | "genre" | null
  >(null);

  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSortOrder, setSelectedSortOrder] = useState<string | null>(
    null
  );
  const [selectedGenre, setSelectedGenre] = useState<string[] | null>(null);

  // Refs для каждого фильтра
  const filterRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);

  // Закрытие модального окна при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Проверяем клик вне всего компонента фильтра
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setActiveModal(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setActiveModal(null);
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
      const newSortOrder = selected;
      setSelectedSortOrder(newSortOrder);
      setSelectedYear(null);
      setActiveModal(null);
      onFilterChange?.({
        author: selectedAuthor,
        year: null,
        sortOrder: newSortOrder,
        genre: selectedGenre,
      });
    } else {
      // Обрабатываем выбор конкретного года
      const yearNumber = Number(selected);
      const newYear = yearNumber === selectedYear ? null : yearNumber;
      setSelectedYear(newYear);
      setSelectedSortOrder(null);
      setActiveModal(null);
      onFilterChange?.({
        author: selectedAuthor,
        year: newYear,
        sortOrder: null,
        genre: selectedGenre,
      });
    }
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
    setActiveModal(null);
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
            : `году выпуска: ${selectedSortOrder.toLowerCase()}`;
        }
        return selectedYear ? `году выпуска: ${selectedYear}` : "году выпуска";
      case "genre":
        return selectedGenre ? `жанру: ${selectedGenre.join(", ")}` : "жанру";
      default:
        return "";
    }
  };

  const toggleModal = (modalType: "author" | "year" | "genre") => {
    // При клике на другой фильтр - закрываем текущий и открываем новый
    setActiveModal(activeModal === modalType ? null : modalType);
  };

  return (
    <div className={styles.centerblock__filter} ref={filterRef}>
      <div className={styles.filter__title}>Искать по:</div>

      {/* Фильтр по автору */}
      <div style={{ position: "relative" }} ref={authorRef}>
        <button
          type="button"
          className={classNames(styles.filter__button, {
            [styles.active]: activeModal === "author" || selectedAuthor,
          })}
          onClick={() => toggleModal("author")}
        >
          {getButtonLabel("author")}
        </button>

        {/* Модальное окно отображается отдельно от кнопки */}
        {activeModal === "author" && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              zIndex: 10,
              marginTop: 8,
            }}
          >
            <FilterItem
              items={[...authors]}
              selectedItem={selectedAuthor}
              onSelectItem={handleSelectAuthor}
            />
          </div>
        )}
      </div>

      {/* Фильтр по году */}
      <div style={{ position: "relative" }} ref={yearRef}>
        <button
          type="button"
          className={classNames(styles.filter__button, {
            [styles.active]:
              activeModal === "year" || selectedYear || selectedSortOrder,
          })}
          onClick={() => toggleModal("year")}
        >
          {getButtonLabel("year")}
        </button>

        {/* Модальное окно отображается отдельно от кнопки */}
        {activeModal === "year" && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              zIndex: 10,
              marginTop: 8,
            }}
          >
            <FilterItem
              items={[
                "По умолчанию",
                "Сначала новые",
                "Сначала старые",
                ...releaseYears.map(String),
              ]}
              selectedItem={
                selectedYear ? String(selectedYear) : selectedSortOrder || null
              }
              onSelectItem={handleSelectYear}
            />
          </div>
        )}
      </div>

      {/* Фильтр по жанру */}
      <div style={{ position: "relative" }} ref={genreRef}>
        <button
          type="button"
          className={classNames(styles.filter__button, {
            [styles.active]: activeModal === "genre" || selectedGenre,
          })}
          onClick={() => toggleModal("genre")}
        >
          {getButtonLabel("genre")}
        </button>

        {/* Модальное окно отображается отдельно от кнопки */}
        {activeModal === "genre" && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              zIndex: 10,
              marginTop: 8,
            }}
          >
            <FilterItem
              items={[...genres]}
              selectedItems={selectedGenre || []}
              onSelectItem={handleSelectGenre}
            />
          </div>
        )}
      </div>
    </div>
  );
}
