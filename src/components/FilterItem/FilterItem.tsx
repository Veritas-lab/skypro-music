import styles from "./filterItem.module.css";

interface FilterItemProps {
  title: string;
  list: string[];
  selectedValues: string[];
  onSelect: (value: string) => void;
  onClose: () => void;
}

export default function FilterItem({
  title,
  list,
  selectedValues,
  onSelect,
}: FilterItemProps) {
  const getYearOptions = () => {
    return ["По умолчанию", "Сначала новые", "Сначала старые"];
  };

  const displayList = title === "Годы" ? getYearOptions() : list;

  const handleItemClick = (item: string) => {
    onSelect(item);
  };

  return (
    <div className={styles.filter__popup}>
      <div className={styles.filter__listContainer}>
        <ul className={styles.filter__list}>
          {displayList.map((item) => (
            <li
              key={item}
              className={`${styles.filter__item} ${
                selectedValues.includes(item) ? styles.selected : ""
              }`}
              onClick={() => handleItemClick(item)}
            >
              {item}
              {title !== "Годы" && (
                <span
                  style={{
                    display: "none",
                    marginLeft: "auto",
                    fontSize: "14px",
                    opacity: 0.7,
                  }}
                >
                  {list.filter((x) => x === item).length}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
