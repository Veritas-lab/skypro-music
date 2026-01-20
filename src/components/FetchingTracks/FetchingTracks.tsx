"use client";

import { useEffect } from "react";
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
    }
  }, [dispatch, isAuth]);

  return null;
}
