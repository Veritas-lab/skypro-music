"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import {
  loadFavoriteTracksAPI,
  setAllTracks,
  setFetchError,
  setFetchIsLoading,
  loadFavoriteTracksAPI,
  clearFavorites,
  setCurrentUserId,
} from "@/Store/Features/Trackslice";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import { useEffect, useRef } from "react";

export default function FetchingTracks() {
  const dispatch = useAppDispatch();
  const { allTracks, favoritesLoaded, currentUserId } = useAppSelector((state) => state.tracks);
  const { isAuth, user } = useAppSelector((state) => state.auth);
  const clearedOnInit = useRef(false);

  useEffect(() => {
    // Очищаем старые данные из localStorage при монтировании
    if (typeof window !== "undefined" && !clearedOnInit.current) {
      clearedOnInit.current = true;
      localStorage.removeItem("favoriteTracks");
      localStorage.removeItem("favoriteTracksIds");
    }
  }, [dispatch, isAuth]);

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

  // Отслеживаем смену пользователя и загружаем избранные треки
  useEffect(() => {
    const userId = user?._id || null;
    const hasToken = typeof window !== "undefined" && localStorage.getItem("access_token");
    
    // Если пользователь изменился, очищаем избранные треки
    if (currentUserId !== userId) {
      if (currentUserId !== null && userId !== null) {
        // Пользователь сменился - очищаем старые данные
        dispatch(clearFavorites());
      }
      dispatch(setCurrentUserId(userId));
    }
    
    // Загружаем избранные треки для текущего пользователя
    if ((isAuth || hasToken) && !favoritesLoaded) {
      dispatch(loadFavoriteTracksAPI());
    } else if (!isAuth && !hasToken && favoritesLoaded) {
      // Пользователь вышел - очищаем избранные
      dispatch(clearFavorites());
    }
  }, [dispatch, isAuth, favoritesLoaded, user?._id, currentUserId]);

  return <></>;
}
