"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import styles from "./Filter.module.css";
import Button from "../UI/Button/Button";
import FilterItem from "../FilterItem/FilterItem";
import { data } from "@/data";
import { getUniqueValueBeKey } from "@/utils/helpers";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import {
  setCurrentPlaylist,
  setFilteredFavoriteTracks,
} from "@/Store/Features/Trackslice";
import { usePathname } from "next/navigation";

export default function Filter() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedYearSort, setSelectedYearSort] = useState<string>("");
  const popupRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();
  const { allTracks, favoriteTracks } = useAppSelector((state) => state.tracks);
  const pathname = usePathname();

  const isFavoritePage = pathname.includes("/favorites");

  const availableTracks = useMemo(() => {
    return isFavoritePage
      ? favoriteTracks.length > 0
        ? favoriteTracks
        : []
      : allTracks.length > 0
        ? allTracks
        : data;
  }, [isFavoritePage, favoriteTracks, allTracks]);

  const genres = useMemo(
    () => Array.from(new Set(availableTracks.flatMap((track) => track.genre))),
    [availableTracks],
  );

  const authors = useMemo(
    () => getUniqueValueBeKey(availableTracks, "author"),
    [availableTracks],
  );

  const years = useMemo(
    () =>
      Array.from(
        new Set(availableTracks.map((track) => track.release_date.slice(0, 4))),
      ),
    [availableTracks],
  );

  const applyFilters = useCallback(() => {
    let filtered = [...availableTracks];

    if (selectedAuthors.length > 0) {
      filtered = filtered.filter((track) =>
        selectedAuthors.includes(track.author),
      );
    }

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((track) =>
        track.genre.some((genre) => selectedGenres.includes(genre)),
      );
    }

    if (selectedYearSort === "Сначала новые") {
      filtered = [...filtered].sort(
        (a, b) =>
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime(),
      );
    } else if (selectedYearSort === "Сначала старые") {
      filtered = [...filtered].sort(
        (a, b) =>
          new Date(a.release_date).getTime() -
          new Date(b.release_date).getTime(),
      );
    }

    if (isFavoritePage) {
      dispatch(setFilteredFavoriteTracks(filtered));
    } else {
      dispatch(setCurrentPlaylist(filtered));
    }
  }, [
    selectedAuthors,
    selectedGenres,
    selectedYearSort,
    dispatch,
    availableTracks,
    isFavoritePage,
  ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    setSelectedAuthors([]);
    setSelectedGenres([]);
    setSelectedYearSort("");
    setActiveFilter(null);

    if (isFavoritePage) {
      dispatch(setFilteredFavoriteTracks([]));
    }
  }, [pathname, dispatch, isFavoritePage]);

  const toggleFilter = (name: string) => {
    setActiveFilter((prev) => (prev === name ? null : name));
  };

  const handleSelectAuthor = (author: string) => {
    setSelectedAuthors((prev) =>
      prev.includes(author)
        ? prev.filter((a) => a !== author)
        : [...prev, author],
    );
  };

  const handleSelectGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
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

  const resetAllFilters = () => {
    setSelectedAuthors([]);
    setSelectedGenres([]);
    setSelectedYearSort("");
    setActiveFilter(null);

    if (isFavoritePage) {
      dispatch(setFilteredFavoriteTracks([]));
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
              title="Годы"
              list={years}
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

        {(selectedAuthors.length > 0 ||
          selectedGenres.length > 0 ||
          selectedYearSort) && (
          <button
            className={styles.resetButton}
            onClick={resetAllFilters}
            title="Сбросить все фильтры"
          >
            Сбросить
          </button>
        )}
      </div>
    </div>
  );
}
