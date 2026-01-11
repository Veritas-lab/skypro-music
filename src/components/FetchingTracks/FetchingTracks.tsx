"use client";

import { getTracks } from "@/app/services/tracks/tracksApi";
import {
  setAllTracks,
  setFetchError,
  setFetchIsLoading,
  loadFavoriteTracks,
  loadFavoriteTracksAPI,
} from "@/Store/Features/Trackslice";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import { useEffect, useRef } from "react";

export default function FetchingTracks() {
  const dispatch = useAppDispatch();
  const { allTracks, favoritesLoaded } = useAppSelector((state) => state.tracks);
  const { isAuth } = useAppSelector((state) => state.auth);
  const favoritesInitialized = useRef(false);

  useEffect(() => {
    // Загружаем избранные треки из localStorage только один раз при монтировании
    if (!favoritesInitialized.current) {
      favoritesInitialized.current = true;
      dispatch(loadFavoriteTracks());
    }

    // Если пользователь авторизован и избранные треки еще не загружены с сервера, загружаем с сервера
    // Это обновит данные из localStorage актуальными данными с сервера
    const hasToken = typeof window !== "undefined" && localStorage.getItem("access_token");
    if ((isAuth || hasToken) && !favoritesLoaded) {
      dispatch(loadFavoriteTracksAPI());
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
