'use client';

import Image from 'next/image';
import styles from './AboutHeroMobile.module.css';

export default function AboutHeroMobile() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroImages}>
        <div className={styles.heroImage}>
          <Image
            src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=70"
            alt="Interior"
            fill
            className={styles.heroImg}
            sizes="50vw"
          />
          <span className={styles.heroImageCaption}>Minimal concept</span>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=70"
            alt="Details"
            fill
            className={styles.heroImg}
            sizes="50vw"
          />
          <span className={styles.heroImageCaption}>Material focus</span>
        </div>
      </div>

      <div className={styles.heroContent}>
        <div className={styles.heroEyebrow}>
          <span className={styles.goldLine} />
          <span>Our story</span>
        </div>

        <h1 className={styles.heroTitle}>
          A home where every room is a <em>world.</em>
        </h1>

        <p className={styles.heroDesc}>
          Another House was built around one idea: your stay should feel curated. Not only
          comfortable — but designed with a mood, a narrative, a reason to return.
        </p>

        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>5</div>
            <div className={styles.heroStatLabel}>Rooms</div>
          </div>
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>5</div>
            <div className={styles.heroStatLabel}>Concepts</div>
          </div>
          <div className={styles.heroStat}>
            <div className={`${styles.heroStatValue} ${styles.heroStatItalic}`}>Calm</div>
            <div className={styles.heroStatLabel}>Mood</div>
          </div>
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>5.0</div>
            <div className={styles.heroStatLabel}>Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
