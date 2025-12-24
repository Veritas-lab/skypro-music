"use client";

import { ReactNode, useEffect } from "react";
import { useAppDispatch } from "@/Store/store";
import { restoreSession } from "@/Store/Features/authSlice";
import styles from "./layout.module.css";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <div className={styles.modal__form}>{children}</div>
        </div>
      </div>
    </div>
  );
}
