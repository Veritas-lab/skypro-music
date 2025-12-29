"use client";

import { ChangeEvent, useState, useEffect } from "react";
import styles from "./Search.module.css";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import {
  setCurrentPlaylist,
  setFilteredFavoriteTracks,
} from "@/Store/Features/Trackslice";
import { usePathname } from "next/navigation";

export default function Search() {
  const [searchInput, setSearchInput] = useState("");
  const dispatch = useAppDispatch();
  const { allTracks, favoriteTracks } = useAppSelector((state) => state.tracks);
  const pathname = usePathname();
  const isFavoritePage = pathname.includes("/favorites");

  const availableTracks = isFavoritePage ? favoriteTracks : allTracks;

  const onSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    if (!searchInput.trim()) {
      if (isFavoritePage) {
        dispatch(setFilteredFavoriteTracks(availableTracks));
      } else {
        dispatch(setCurrentPlaylist(availableTracks));
      }
      return;
    }

    const searchTerm = searchInput.toLowerCase().trim();

    const filteredTracks = availableTracks.filter(
      (track) =>
        track.name.toLowerCase().includes(searchTerm) ||
        track.author.toLowerCase().includes(searchTerm)
    );

    if (isFavoritePage) {
      dispatch(setFilteredFavoriteTracks(filteredTracks));
    } else {
      dispatch(setCurrentPlaylist(filteredTracks));
    }
  }, [searchInput, availableTracks, dispatch, isFavoritePage]);

  useEffect(() => {
    setSearchInput("");
  }, [pathname]);

  return (
    <div className={styles.centerblock__search}>
      <svg className={styles.search__svg}>
        <use xlinkHref="/img/icon/sprite.svg#icon-search"></use>
      </svg>
      <input
        className={styles.search__text}
        type="search"
        placeholder="Поиск"
        name="search"
        value={searchInput}
        onChange={onSearchInput}
      />
    </div>
  );
}
