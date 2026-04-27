'use client';

import styles from './ViewToggle.module.css';

interface Props {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
  count: number;
}

export default function ViewToggle({ view, onChange, count }: Props) {
  return (
    <div className={styles.viewControls}>
      <span className={styles.viewLabel}>Showing {count} rooms</span>
      <div className={styles.viewToggle}>
        <button
          type="button"
          className={`${styles.viewBtn} ${view === 'grid' ? styles.active : ''}`}
          onClick={() => onChange('grid')}
          aria-label="Grid view"
          title="Grid view"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.3" />
            <rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.3" />
            <rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.3" />
            <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>
        <button
          type="button"
          className={`${styles.viewBtn} ${view === 'list' ? styles.active : ''}`}
          onClick={() => onChange('list')}
          aria-label="List view"
          title="List view"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <line x1="1" y1="4" x2="15" y2="4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="1" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
