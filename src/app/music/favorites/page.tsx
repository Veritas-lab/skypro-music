"use client";

import Centerblock from "@/components/CenterBlock/CenterBlock";
import { useAppSelector } from "@/Store/store";
import styles from "../musicLayout.module.css";
import { useEffect, useState } from "react";
import { loadFavoriteTracksAPI } from "@/Store/Features/Trackslice";
import { useAppDispatch } from "@/Store/store";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { favoriteTracks } = useAppSelector((state) => state.tracks);
  const { isAuth } = useAppSelector((state) => state.auth);
  const [sessionRestored, setSessionRestored] = useState(false);

  useEffect(() => {

    const timer = setTimeout(() => {
      setSessionRestored(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!sessionRestored) return;

   
    const hasToken = typeof window !== "undefined" && localStorage.getItem("access_token");
    
   
    if (!hasToken && !isAuth) {
      router.push("/auth/signin");
      return;
    }


    if (isAuth || hasToken) {
      if (hasToken) {
        dispatch(loadFavoriteTracksAPI());
      }
    }
  }, [dispatch, isAuth, router, sessionRestored]);

  const hasToken = typeof window !== "undefined" && localStorage.getItem("access_token");
  const shouldShowContent = sessionRestored && (isAuth || hasToken);

  if (!shouldShowContent) {
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
