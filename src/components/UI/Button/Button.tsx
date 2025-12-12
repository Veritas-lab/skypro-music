import classNames from "classnames";
import styles from "./button.module.css";

interface ButtonProps {
  nameFilter: string;
  activeFilter: string | null;
  selectedCount?: number;
  totalCount?: number;
  onClick: () => void;
}

export default function Button({
  nameFilter,
  activeFilter,
  selectedCount = 0,
  //totalCount = 0,
  onClick,
}: ButtonProps) {
  const hasSelection = selectedCount > 0;
  const isActive = activeFilter === nameFilter;
  //const displayCount = hasSelection ? selectedCount : totalCount;

  return (
    <button
      className={classNames(styles.filter__button, {
        [styles.active]: isActive || hasSelection,
        [styles.hasSelection]: hasSelection,
      })}
      onClick={onClick}
    >
      {nameFilter}
      {hasSelection && (
        <span className={styles.selectedCount}>{selectedCount}</span>
      )}
      {/*
      {displayCount > 0 && (
        <span
          className={classNames(styles.count__badge, {
            [styles.hasSelection]: hasSelection,
          })}
        >
          {displayCount}
        </span>
      )}
      */}
    </button>
  );
}
