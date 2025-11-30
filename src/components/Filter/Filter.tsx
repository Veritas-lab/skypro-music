"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Filter.module.css";
import Button from "../UI/Button/Button";
import FilterItem from "../FilterItem/FilterItem";
import { data } from "@/data";
import { getUniqueValueBeKey } from "@/utils/helper";

export default function Filter() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedYearSort, setSelectedYearSort] = useState<string>("");
  const popupRef = useRef<HTMLDivElement | null>(null);

  const authors = getUniqueValueBeKey(data, "author");
  const genres = getUniqueValueBeKey(data, "genre");
  const years = Array.from(
    new Set(data.map((track) => track.release_date.slice(0, 4)))
  );

  const toggleFilter = (name: string) => {
    setActiveFilter((prev) => (prev === name ? null : name));
  };

  const handleSelectAuthor = (author: string) => {
    setSelectedAuthors((prev) =>
      prev.includes(author)
        ? prev.filter((a) => a !== author)
        : [...prev, author]
    );
  };

  const handleSelectGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSelectYearSort = (sortOption: string) => {
    setSelectedYearSort((prev) => (prev === sortOption ? "" : sortOption));
  };

  const getSelectionHandler = (filterType: string) => {
    switch (filterType) {
      case "исполнителю":
        return handleSelectAuthor;
      case "жанру":
        return handleSelectGenre;
      case "году выпуска":
        return handleSelectYearSort;
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
        return selectedYearSort ? [selectedYearSort] : [];
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
        return selectedYearSort ? 1 : 0;
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
        return years.length;
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
        {/* Исполнителю */}
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

        {/* Году выпуска */}
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
              title="Годы"
              list={years}
              selectedValues={getSelectedValues("году выпуска")}
              onSelect={getSelectionHandler("году выпуска")}
              onClose={() => setActiveFilter(null)}
            />
          )}
        </div>

        {/* Жанру */}
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
