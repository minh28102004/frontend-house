'use client';

import styles from './ContactAddressStrip.module.css';

const ADDRESS_CELLS = [
  { label: 'Address', value: 'Ho Chi Minh City, Vietnam' },
  { label: 'District', value: 'To be updated' },
  { label: 'Nearest landmark', value: 'City Centre' },
];

export default function ContactAddressStrip() {
  return (
    <div className={styles.addressStrip}>
      {ADDRESS_CELLS.map((cell) => (
        <div key={cell.label} className={styles.addressCell}>
          <div className={styles.addressCellLabel}>{cell.label}</div>
          <div className={styles.addressCellValue}>{cell.value}</div>
        </div>
      ))}
    </div>
  );
}
