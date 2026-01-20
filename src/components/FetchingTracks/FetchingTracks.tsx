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
    dispatch(setFetchIsLoading(true));
    getTracks()
      .then((tracks) => {
        console.log("Fetched tracks:", tracks);
        dispatch(setAllTracks(tracks));
      })
      .catch((error) => {
        dispatch(setFetchError("Ошибка загрузки треков. Попробуйте позже."));
        console.error("Error fetching tracks:", error);
      })
      .finally(() => {
        dispatch(setFetchIsLoading(false));
      });

    if (isAuth) {
      dispatch(loadFavoriteTracksAPI());
    } else if (!isAuth && !hasToken && favoritesLoaded) {
      // Пользователь вышел - очищаем избранные
      dispatch(clearFavorites());
    }
  }, [dispatch, isAuth, favoritesLoaded, user?._id, currentUserId]);

  return <></>;
}
