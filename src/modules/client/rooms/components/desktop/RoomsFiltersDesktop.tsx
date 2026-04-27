'use client';

import { FILTERS } from '../../models/rooms.model';
import styles from './RoomsFiltersDesktop.module.css';

interface Props {
  activeFilter: string;
  count: number;
  onFilterChange: (filter: string) => void;
}

export default function RoomsFiltersDesktop({ activeFilter, count, onFilterChange }: Props) {
  return (
    <div className={styles.filtersBar}>
      <div className={styles.filtersInner}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`${styles.filterBtn} ${activeFilter === f.id ? styles.active : ''}`}
            onClick={() => onFilterChange(f.id)}
          >
            {f.label}
          </button>
        ))}
        <span className={styles.filtersCount}>{count} rooms</span>
      </div>
    </div>
  );
}
