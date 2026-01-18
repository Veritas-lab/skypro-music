"use client";

import Centerblock from "@/components/CenterBlock/CenterBlock";
import { useAppSelector, useAppDispatch } from "@/Store/store";
import styles from "../musicLayout.module.css";
import { useEffect, useState, useCallback } from "react";
import { loadFavoriteTracksAPI } from "@/Store/Features/Trackslice";
import { useRouter } from "next/navigation";

export default function FavoritesPage(): React.ReactElement {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { favoriteTracks } = useAppSelector((state) => state.tracks);
  const { isAuth } = useAppSelector((state) => state.auth);
  const [sessionRestored, setSessionRestored] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSessionRestored(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleLoadFavorites = useCallback((): void => {
    if (
      !isAuth &&
      typeof window !== "undefined" &&
      !localStorage.getItem("accessToken")
    ) {
      router.push("/auth/signin");
      return;
    }

    dispatch(loadFavoriteTracksAPI());
  }, [dispatch, isAuth, router]);

  useEffect(() => {
    if (sessionRestored) {
      handleLoadFavorites();
    }
  }, [sessionRestored, handleLoadFavorites]);

  if (
    !sessionRestored ||
    (!isAuth &&
      typeof window !== "undefined" &&
      !localStorage.getItem("accessToken"))
  ) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  return (
    <Centerblock
      tracks={favoriteTracks}
      title="Мои треки"
      isFavoritePage={true}
    />
  );
}
