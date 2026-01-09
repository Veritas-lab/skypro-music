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
import { useEffect } from "react";

export default function FetchingTracks() {
  const dispatch = useAppDispatch();
  const { allTracks } = useAppSelector((state) => state.tracks);
  const { isAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Загружаем избранные треки из localStorage
    dispatch(loadFavoriteTracks());
    
    // Если пользователь авторизован, загружаем избранные треки с сервера
    if (isAuth) {
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
  }, [allTracks.length, dispatch, isAuth]);

  return <></>;
}
