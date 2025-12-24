"use client";

import Centerblock from "@/components/CenterBlock/CenterBlock";
import { useAppSelector } from "@/Store/store";
import styles from "../musicLayout.module.css";
import { useEffect } from "react";
import { loadFavoriteTracks } from "@/Store/Features/Trackslice";
import { useAppDispatch } from "@/Store/store";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { favoriteTracks } = useAppSelector((state) => state.tracks);
  const { isAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuth) {
      router.push("/auth/signin");
      return;
    }

    dispatch(loadFavoriteTracks());
  }, [dispatch, isAuth, router]);

  if (!isAuth) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Перенаправление...</div>
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
