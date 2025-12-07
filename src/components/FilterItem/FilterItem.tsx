import styles from "./filterItem.module.css";

interface FilterItemProps {
  items: string[];
  onSelectItem: (item: string) => void;
  selectedItem?: string | null;
  selectedItems?: string[];
}

export default function FilterItem({
  items,
  onSelectItem,
  selectedItem,
  selectedItems,
}: FilterItemProps) {
  const isItemSelected = (item: string) => {
    if (selectedItem !== undefined && selectedItem !== null) {
      return selectedItem === item;
    }
    if (selectedItems !== undefined) {
      return selectedItems.includes(item);
    }
    return false;
  };

  return (
    <div className={styles.modal_conteiner}>
      <ul className={styles.modal_block} onClick={(e) => e.stopPropagation()}>
        {items.map((item) => (
          <li
            key={item}
            onClick={() => onSelectItem(item)}
            className={`${styles.title_modal} ${
              isItemSelected(item) ? styles.active : ""
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
