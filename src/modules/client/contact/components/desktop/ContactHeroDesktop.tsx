'use client';

import Link from 'next/link';
import styles from './ContactHeroDesktop.module.css';

export default function ContactHeroDesktop() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg} />
      <div className={styles.heroDeco}>C</div>

      <div className={styles.heroInner}>
        <div className={styles.heroLeft}>
          <div className={styles.heroLabel}>
            <span className={styles.goldLine} />
            <span>Get in touch</span>
          </div>
          <h1 className={styles.heroTitle}>
            Say<br /><em>hello.</em>
          </h1>
        </div>

        <div className={styles.heroRight}>
          <p className={styles.heroDesc}>
            Reach us for availability, special requests, group bookings, or just to ask which
            room suits your mood.
          </p>
          <div className={styles.hoursBlock}>
            <div className={styles.hoursItem}>
              <div className={styles.hoursLabel}>Check-in</div>
              <div className={styles.hoursValue}>2:00 PM</div>
            </div>
            <div className={styles.hoursItem}>
              <div className={styles.hoursLabel}>Check-out</div>
              <div className={styles.hoursValue}>12:00 PM</div>
            </div>
            <div className={styles.hoursItem}>
              <div className={styles.hoursLabel}>Response time</div>
              <div className={styles.hoursValue}>Within 2 hrs</div>
            </div>
            <div className={styles.hoursItem}>
              <div className={styles.hoursLabel}>Languages</div>
              <div className={styles.hoursValue}>VI · EN</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
