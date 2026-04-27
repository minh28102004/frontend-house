'use client';

import Link from 'next/link';
import styles from './ContactCta.module.css';

interface ContactCtaProps {
  label?: string;
  title?: string;
  description?: string;
  primaryBtn?: string;
  primaryBtnUrl?: string;
  secondaryBtn?: string;
  secondaryBtnUrl?: string;
}

export default function ContactCta({
  label = 'Plan your stay',
  title = 'Tell us your\nmood.',
  description = 'Romantic, sky, cinema, nature, or minimal — share the feeling you\'re after and we\'ll match you with the right room concept.',
  primaryBtn = 'Explore rooms',
  primaryBtnUrl = '/rooms',
  secondaryBtn = 'Book now',
  secondaryBtnUrl = '/booking',
}: ContactCtaProps) {
  const formatTitle = (text: string) => {
    return text.split('\n').map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className={styles.sideCta}>
      <div className={styles.sideCtaDeco}>AH</div>

      <div className={styles.sideCtaLabel}>
        <span className={styles.goldLine} />
        <span>{label}</span>
      </div>

      <h2 className={styles.sideCtaTitle}>
        {formatTitle(title)}
      </h2>

      <p className={styles.sideCtaBody}>
        {description}
      </p>

      <div className={styles.sideCtaButtons}>
        <Link href={primaryBtnUrl} className={styles.btnGold}>
          {primaryBtn}
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <Link href={secondaryBtnUrl} className={styles.btnGhostDark}>
          {secondaryBtn}
        </Link>
      </div>
    </div>
  );
}
