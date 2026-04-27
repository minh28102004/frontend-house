'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './AboutCta.module.css';

export default function AboutCta() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaBlock}>
        <div className={styles.ctaImg}>
          <Image
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70"
            alt="Book a room"
            fill
            className={styles.ctaImgEl}
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          <div className={styles.ctaImgOverlay} />
        </div>
        <div className={styles.ctaContent}>
          <div className={styles.ctaLabel}>
            <span className={styles.goldLine} />
            <span>Find your mood</span>
          </div>
          <h2 className={styles.ctaTitle}>
            Choose a<br /><em>concept.</em>
          </h2>
          <p className={styles.ctaBody}>
            Explore the rooms and pick the atmosphere that matches how you want to feel.
            Each one is a different version of rest.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/rooms" className={styles.btnLight}>
              Explore rooms
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/booking" className={styles.btnOutline}>
              Book now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
