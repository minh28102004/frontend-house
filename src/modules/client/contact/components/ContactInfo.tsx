'use client';

import styles from './ContactInfo.module.css';

const CONTACT_ROWS = [
  {
    type: 'Phone',
    value: '0976 490 5619',
    href: 'tel:+849764905619',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.7 16.18z" />
      </svg>
    ),
  },
  {
    type: 'Email',
    value: 'anotherhouse.vn',
    href: 'mailto:anotherhouse.vn',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    type: 'Facebook',
    value: 'anotherhouse.vn',
    href: 'https://www.facebook.com/anotherhouse.vn',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    type: 'Instagram',
    value: '@anotherhouse.vn',
    href: 'https://www.instagram.com/anotherhouse.vn/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
      </svg>
    ),
  },
  {
    type: 'TikTok',
    value: '@anotherhouse.vn',
    href: 'https://www.tiktok.com/@anotherhouse.vn',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.33 6.33 6.34 6.34 0 0 0 6.34-6.33V8.87a8.16 8.16 0 0 0 4.77 1.52V6.11a4.85 4.85 0 0 1-1-.42z"/>
      </svg>
    ),
  },
  {
    type: 'Threads',
    value: '@anotherhouse.vn',
    href: 'https://www.threads.com/@anotherhouse.vn',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746 0 5.043.725 6.826 2.151 1.626 1.3 2.793 3.13 3.375 5.304C23.171 9.858 24 12.22 24 14.979c0 3.212-.98 5.853-2.55 7.771-1.666 2.027-3.967 3.17-6.762 3.24l-.005.01h-.001zm-.013-19.27v-.003c-3.003 0-5.22.94-6.582 2.79-1.46 1.98-1.78 4.79-.98 8.29l.003.012c.42 1.77 1.39 3.32 2.86 4.56 1.34 1.13 2.96 1.62 4.72 1.62h.002c3.4-.02 5.87-1.51 7.13-4.39 1.16-2.62.84-5.69-.97-8.4-1.59-2.39-3.97-3.41-5.94-3.47h-.234z"/>
      </svg>
    ),
  },
];

export default function ContactInfo() {
  return (
    <div className={styles.contactRows}>
      <div className={styles.contactRowsLabel}>Contact details</div>

      {CONTACT_ROWS.map((row) => (
        <a key={row.type} href={row.href} className={styles.contactRow}>
          <div className={styles.contactRowLeft}>
            <div className={styles.contactRowIcon}>{row.icon}</div>
            <div>
              <div className={styles.contactRowType}>{row.type}</div>
              <div className={styles.contactRowValue}>{row.value}</div>
            </div>
          </div>
          <div className={styles.contactRowArrow} />
        </a>
      ))}
    </div>
  );
}
