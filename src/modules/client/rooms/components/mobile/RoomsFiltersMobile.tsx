'use client';
import styles from './RoomsFiltersMobile.module.css';

interface FilterOption {
  id: string;
  label: string;
}

interface Props {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filters: FilterOption[];
}

export default function RoomsFiltersMobile({ activeFilter, onFilterChange, filters }: Props) {
  return (
    <div className={styles.filters}>
      <div className={styles.filtersScroll}>
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`${styles.filterBtn} ${activeFilter === f.id ? styles.active : ''}`}
            onClick={() => onFilterChange(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
