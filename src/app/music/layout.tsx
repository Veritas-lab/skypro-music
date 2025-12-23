"use client";

import { ReactNode, useEffect } from "react";
import styles from "./musicLayout.module.css";
import Bar from "@/components/Bar/Bar";
import Navigation from "@/components/Navigation/Navigation";
import Sidebar from "@/components/SideBar/SideBar";
import FetchingTracks from "@/components/FetchingTracks/FetchingTracks";
import { useAppDispatch } from "@/Store/store";
import { restoreSession } from "@/Store/Features/authSlice";

interface MusicLayoutProps {
  children: ReactNode;
}

export default function MusicLayout({ children }: MusicLayoutProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <FetchingTracks />
          <Navigation />
          {children}
          <Sidebar />
        </main>
        <Bar />
        <footer className={styles.footer}></footer>
      </div>
    </div>
  );
}
