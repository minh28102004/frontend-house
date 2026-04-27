'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './AboutHeroDesktop.module.css';

export default function AboutHeroDesktop() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroCanvas}>

        {/* Dark left panel */}
        <div className={styles.heroLeft}>
          <div className={styles.heroLeftBg} />
          <div className={styles.heroDeco}>A</div>
          <div className={styles.heroLeftInner}>
            <div className={styles.heroEyebrow}>
              <span className={styles.goldLine} />
              <span>Our story</span>
            </div>
            <h1 className={styles.heroTitle}>
              A home<br />where every<br />room is a<br /><em>world.</em>
            </h1>
            <p className={styles.heroDesc}>
              Another House was built around one idea: your stay should feel curated.
              Not only comfortable — but designed with a mood, a narrative, a reason to return.
            </p>
          </div>
        </div>

        {/* Right image split */}
        <div className={styles.heroRight}>
          <div className={styles.heroImgCell}>
            <Image
              src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=70"
              alt="Another House interior"
              fill
              className={styles.heroImg}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <div className={styles.heroImgCaption}>Interior — Minimal concept</div>
          </div>
          <div className={styles.heroImgCell}>
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70"
              alt="Another House details"
              fill
              className={styles.heroImg}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <div className={styles.heroImgCaption}>Details — Material focus</div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className={styles.heroStatsStrip}>
        <div className={styles.heroStat}>
          <div className={styles.heroStatNum}>5</div>
          <div className={styles.heroStatLabel}>Themed rooms</div>
        </div>
        <div className={styles.heroStat}>
          <div className={styles.heroStatNum}>5</div>
          <div className={styles.heroStatLabel}>Unique concepts</div>
        </div>
        <div className={styles.heroStat}>
          <div className={`${styles.heroStatNum} ${styles.heroStatItalic}`}>Calm</div>
          <div className={styles.heroStatLabel}>Overall mood</div>
        </div>
        <div className={styles.heroStat}>
          <div className={styles.heroStatNum}>5.0</div>
          <div className={styles.heroStatLabel}>Guest rating</div>
        </div>
      </div>
    </section>
  );
}
