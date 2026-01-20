"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import {
  loadFavoriteTracksAPI,
  setAllTracks,
  setFetchError,
  setFetchIsLoading,
} from "@/Store/Features/Trackslice";
import { getTracks } from "@/app/services/tracks/tracksApi";

export default function FetchingTracks() {
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector((state) => state.auth);
  const { allTracks, favoritesLoaded } = useAppSelector((state) => state.tracks);
  const tracksLoadedRef = useRef(false);

  // Загружаем все треки только один раз
  useEffect(() => {
    if (allTracks.length === 0 && !tracksLoadedRef.current) {
      tracksLoadedRef.current = true;
      dispatch(setFetchIsLoading(true));
      getTracks()
        .then((tracks) => {
          console.log("Fetched tracks:", tracks);
          dispatch(setAllTracks(tracks));
        })
        .catch((error) => {
          dispatch(setFetchError("Ошибка загрузки треков. Попробуйте позже."));
          console.error("Error fetching tracks:", error);
          tracksLoadedRef.current = false; // Разрешаем повторную попытку при ошибке
        })
        .finally(() => {
          dispatch(setFetchIsLoading(false));
        });
    }
  }, [dispatch, allTracks.length]);

  // Загружаем избранные треки только при авторизации
  useEffect(() => {
    if (isAuth && !favoritesLoaded) {
      dispatch(loadFavoriteTracksAPI());
    }
  }, [dispatch, isAuth, favoritesLoaded]);

  return null;
}
