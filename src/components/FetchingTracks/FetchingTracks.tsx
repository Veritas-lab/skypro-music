"use client";

import { getTracks } from "@/app/services/tracks/tracksApi";
import {
  setAllTracks,
  setFetchError,
  setFetchIsLoading,
  loadFavoriteTracksAPI,
} from "@/Store/Features/Trackslice";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import { useEffect, useRef } from "react";

export default function FetchingTracks() {
  const dispatch = useAppDispatch();
  const { allTracks, favoritesLoaded } = useAppSelector((state) => state.tracks);
  const { isAuth } = useAppSelector((state) => state.auth);
  const clearedOnInit = useRef(false);

  useEffect(() => {
    // Очищаем старые данные из localStorage при монтировании
    if (typeof window !== "undefined" && !clearedOnInit.current) {
      clearedOnInit.current = true;
      localStorage.removeItem("favoriteTracks");
      localStorage.removeItem("favoriteTracksIds");
    }

    if (allTracks.length === 0) {
      dispatch(setFetchIsLoading(true));
      getTracks()
        .then((res) => {
          dispatch(setAllTracks(res));
        })
        .catch((error) => {
          if (error.response) {
            dispatch(setFetchError(error.response.data));
          } else if (error.request) {
            dispatch(setFetchError("Произошла ошибка. Попробуйте позже"));
          } else {
            dispatch(setFetchError("Неизвестная ошибка"));
          }
        })
        .finally(() => {
          dispatch(setFetchIsLoading(false));
        });
    }
  }, [allTracks.length, dispatch, isAuth, favoritesLoaded]);

  return <></>;
}
