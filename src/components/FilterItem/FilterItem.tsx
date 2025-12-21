import styles from "./filterItem.module.css";

interface FilterItemProps {
  items: string[];
  onSelectItem: (item: string) => void;
}

export default function FilterItemexport({
  items,
  onSelectItem,
}: FilterItemProps) {
  return (
    <div className={styles.modal_conteiner}>
      <ul className={styles.modal_block} onClick={(e) => e.stopPropagation()}>
        {items.map((item) => (
          <li
            key={item}
            onClick={() => onSelectItem(item)}
            className={styles.title_modal}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
