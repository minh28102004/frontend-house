'use client';

import styles from './ContactHeroMobile.module.css';

interface ContactHeroMobileProps {
  title?: string;
  description?: string;
  checkin?: string;
  checkout?: string;
  responseTime?: string;
  languages?: string;
}

export default function ContactHeroMobile({
  title = 'Say\nhello.',
  description = 'Reach us for availability, special requests, group bookings, or just to ask which room suits your mood.',
  checkin = '2:00 PM',
  checkout = '12:00 PM',
  responseTime = 'Within 2 hrs',
  languages = 'VI · EN',
}: ContactHeroMobileProps) {
  const formatTitle = (text: string) => {
    return text.split('\n').map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroBg} />
      <div className={styles.heroDeco}>C</div>

      <div className={styles.heroInner}>
        <div className={styles.heroLabel}>
          <span className={styles.goldLine} />
          <span>Get in touch</span>
        </div>

        <h1 className={styles.heroTitle}>
          {formatTitle(title)}
        </h1>

        <p className={styles.heroDesc}>
          {description}
        </p>

        <div className={styles.hoursGrid}>
          <div className={styles.hoursItem}>
            <div className={styles.hoursLabel}>Check-in</div>
            <div className={styles.hoursValue}>{checkin}</div>
          </div>
          <div className={styles.hoursItem}>
            <div className={styles.hoursLabel}>Check-out</div>
            <div className={styles.hoursValue}>{checkout}</div>
          </div>
          <div className={styles.hoursItem}>
            <div className={styles.hoursLabel}>Response time</div>
            <div className={styles.hoursValue}>{responseTime}</div>
          </div>
          <div className={styles.hoursItem}>
            <div className={styles.hoursLabel}>Languages</div>
            <div className={styles.hoursValue}>{languages}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
