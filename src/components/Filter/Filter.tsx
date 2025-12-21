"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Filter.module.css";
import Button from "../UI/Button/Button";
import FilterItem from "../FilterItem/FilterItem";
import { data } from "@/data";
import { getUniqueValueBeKey } from "@/utils/helpers";

interface FilterProps {
  onFilterChange: (filters: {
    authors: string[];
    genres: string[];
    yearSort: string;
  }) => void;
}

export default function Filter({ onFilterChange }: FilterProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedYearSort, setSelectedYearSort] = useState<string>("");
  const popupRef = useRef<HTMLDivElement | null>(null);

  const authors = getUniqueValueBeKey(data, "author");
  const allGenres = data.flatMap((track) => track.genre);
  const genres = Array.from(new Set(allGenres)).filter(
    (genre) => genre && genre.trim() !== "",
  );

  const yearOptions = ["По умолчанию", "Сначала новые", "Сначала старые"];

  const toggleFilter = (name: string) => {
    setActiveFilter((prev) => (prev === name ? null : name));
  };

  const handleSelectAuthor = (author: string) => {
    const newAuthors = selectedAuthors.includes(author)
      ? selectedAuthors.filter((a) => a !== author)
      : [...selectedAuthors, author];

    setSelectedAuthors(newAuthors);
    onFilterChange({
      authors: newAuthors,
      genres: selectedGenres,
      yearSort: selectedYearSort,
    });
  };

  const handleSelectGenre = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];

    setSelectedGenres(newGenres);
    onFilterChange({
      authors: selectedAuthors,
      genres: newGenres,
      yearSort: selectedYearSort,
    });
  };

  const handleSelectYearSort = (option: string) => {
    let newYearSort = "";

    if (option === "Сначала новые") {
      newYearSort = "newest";
    } else if (option === "Сначала старые") {
      newYearSort = "oldest";
    }

    setSelectedYearSort(newYearSort);
    onFilterChange({
      authors: selectedAuthors,
      genres: selectedGenres,
      yearSort: newYearSort,
    });
  };

  const getSelectionHandler = (filterType: string) => {
    switch (filterType) {
      case "исполнителю":
        return handleSelectAuthor;
      case "жанру":
        return handleSelectGenre;
      case "году выпуска":
        return (option: string) => handleSelectYearSort(option);
      default:
        return () => {};
    }
  };

  const getSelectedValues = (filterType: string) => {
    switch (filterType) {
      case "исполнителю":
        return selectedAuthors;
      case "жанру":
        return selectedGenres;
      case "году выпуска":
        if (selectedYearSort === "newest") return ["Сначала новые"];
        if (selectedYearSort === "oldest") return ["Сначала старые"];
        if (selectedYearSort === "") return ["По умолчанию"];
        return [];
      default:
        return [];
    }
  };

  const getSelectedCount = (filterType: string) => {
    switch (filterType) {
      case "исполнителю":
        return selectedAuthors.length;
      case "жанру":
        return selectedGenres.length;
      case "году выпуска":
        return selectedYearSort && selectedYearSort !== "" ? 1 : 0;
      default:
        return 0;
    }
  };

  const getTotalCount = (filterType: string) => {
    switch (filterType) {
      case "исполнителю":
        return authors.length;
      case "жанру":
        return genres.length;
      case "году выпуска":
        return yearOptions.length;
      default:
        return 0;
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (popupRef.current && !popupRef.current.contains(target)) {
        setActiveFilter(null);
      }
    }

    if (activeFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeFilter]);

  return (
    <div className={styles.centerblock__filter} ref={popupRef}>
      <div className={styles.filter__title}>Искать по:</div>
      <div className={styles.filter__buttons}>
        <div style={{ position: "relative" }}>
          <Button
            nameFilter="исполнителю"
            activeFilter={activeFilter}
            selectedCount={getSelectedCount("исполнителю")}
            totalCount={getTotalCount("исполнителю")}
            onClick={() => toggleFilter("исполнителю")}
          />
          {activeFilter === "исполнителю" && (
            <FilterItem
              title="Исполнители"
              list={authors}
              selectedValues={getSelectedValues("исполнителю")}
              onSelect={getSelectionHandler("исполнителю")}
              onClose={() => setActiveFilter(null)}
            />
          )}
        </div>
        <div style={{ position: "relative" }}>
          <Button
            nameFilter="году выпуска"
            activeFilter={activeFilter}
            selectedCount={getSelectedCount("году выпуска")}
            totalCount={getTotalCount("году выпуска")}
            onClick={() => toggleFilter("году выпуска")}
          />
          {activeFilter === "году выпуска" && (
            <FilterItem
              title="Сортировка по году"
              list={yearOptions}
              selectedValues={getSelectedValues("году выпуска")}
              onSelect={getSelectionHandler("году выпуска")}
              onClose={() => setActiveFilter(null)}
            />
          )}
        </div>
        <div style={{ position: "relative" }}>
          <Button
            nameFilter="жанру"
            activeFilter={activeFilter}
            selectedCount={getSelectedCount("жанру")}
            totalCount={getTotalCount("жанру")}
            onClick={() => toggleFilter("жанру")}
          />
          {activeFilter === "жанру" && (
            <FilterItem
              title="Жанры"
              list={genres}
              selectedValues={getSelectedValues("жанру")}
              onSelect={getSelectionHandler("жанру")}
              onClose={() => setActiveFilter(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
