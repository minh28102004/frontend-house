'use client';

import styles from './AboutPillars.module.css';

const PILLARS = [
  {
    num: '01',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    name: 'Concept-led design',
    desc: 'Each room begins with a feeling, not a furniture list. We define the emotional core first — then build every material choice around it.',
  },
  {
    num: '02',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
    name: 'Minimal luxury',
    desc: 'Not minimalism as emptiness — but restraint as a form of respect. We keep it calm and spacious, but elevate every detail: linen, lighting, finishes.',
  },
  {
    num: '03',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    name: 'Composed for light',
    desc: 'Natural light is the first material we work with. Every corner is framed like a photograph — intentional, calm, and quietly beautiful.',
  },
  {
    num: '04',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    name: 'Comfort-first',
    desc: "It's not only aesthetic. We obsess over sleep quality, acoustics, temperature, and easy living. Beauty that doesn't perform is just decoration.",
  },
];

export default function AboutPillars() {
  return (
    <section className={styles.pillars}>
      <div className={styles.pillarsInner}>
        <div className={styles.pillarsHeader}>
          <div>
            <div className={styles.pillarsHeaderLabel}>
              <span className={styles.goldLine} />
              <span>Why we're different</span>
            </div>
            <h2 className={styles.pillarsTitle}>
              What we <em>believe</em><br />in designing for.
            </h2>
          </div>
          <p className={styles.pillarsSubtitle}>
            Four principles that shape how every room at Another House is made.
          </p>
        </div>

        <div className={styles.pillarsGrid}>
          {PILLARS.map((pillar) => (
            <div key={pillar.num} className={`${styles.pillarCard} reveal-fade-up`}>
              <div className={styles.pillarCardNum}>{pillar.num}</div>
              <div className={styles.pillarCardIcon}>{pillar.icon}</div>
              <div className={styles.pillarCardName}>{pillar.name}</div>
              <p className={styles.pillarCardDesc}>{pillar.desc}</p>
              <div className={styles.pillarCardDeco}>{pillar.num}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
