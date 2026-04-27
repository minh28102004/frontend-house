'use client';

import Link from 'next/link';
import styles from './RoomsHeroDesktop.module.css';

export default function RoomsHeroDesktop() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg}>
        <img
          src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=2000&q=70"
          alt=""
          className={styles.heroBgImg}
        />
        <div className={styles.heroBgGradient} />
      </div>

      <div className={styles.heroInner}>
        <div className={styles.heroLabel}>
          <span className={styles.goldLine} />
          <span>Another House · Concept rooms</span>
        </div>
        <h1 className={styles.heroTitle}>
          Our<br /><em>rooms.</em>
        </h1>
        <div className={styles.heroBottom}>
          <p className={styles.heroDesc}>
            Each room is a different atmosphere — choose the concept that matches your mood. Minimal
            luxury, quiet details, modern comfort.
          </p>
          <Link href="/booking" className={styles.heroBook}>
            Book a room
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
