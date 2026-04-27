'use client';

import Link from 'next/link';
import styles from './RoomsHeroMobile.module.css';

export default function RoomsHeroMobile() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg} />
      <div className={styles.heroGradient} />

      <div className={styles.heroContent}>
        <div className={styles.heroLabel}>
          <span className={styles.goldLine} />
          <span>Concept rooms</span>
        </div>

        <h1 className={styles.heroTitle}>Our <em>rooms.</em></h1>

        <p className={styles.heroDesc}>
          Each room is a different atmosphere — choose the concept that matches your mood.
        </p>

        <Link href="/booking" className={styles.heroBook}>
          Book a room
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
