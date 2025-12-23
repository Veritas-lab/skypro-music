"use client";

import styles from "./loadingSpinner.module.css";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large" | "xlarge";
  text?: string;
}

export default function LoadingSpinner({
  size = "xlarge",
  text = "Загрузка...",
}: LoadingSpinnerProps) {
  return (
    <div className={styles.loadingContainer}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.watchIcon}>
          <svg
            className={styles.watchSvg}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className={styles.progressFill}></div>
        </div>
      </div>
      {text && <p className={styles.loadingText}>{text}</p>}
    </div>
  );
}
