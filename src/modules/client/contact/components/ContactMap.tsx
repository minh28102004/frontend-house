'use client';

import styles from './ContactMap.module.css';

interface ContactMapProps {
  embedUrl?: string;
  name?: string;
  address?: string;
}

export default function ContactMap({
  embedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15677.605077990398!2d106.69163786213329!3d10.780547279894273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175298bf34f2e83%3A0xdcd33a83dfe51c49!2sAnother%20House!5e0!3m2!1svi!2s!4v1774224566996!5m2!1svi!2s',
  name = 'Another House',
  address = 'Ho Chi Minh City, Vietnam',
}: ContactMapProps) {
  return (
    <div className={styles.mapWrap}>
      <iframe
        title={`${name} location`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={embedUrl}
        className={styles.mapIframe}
      />
      <div className={styles.mapBadge}>
        <div className={styles.mapBadgeName}>{name}</div>
        <div className={styles.mapBadgeAddr}>{address.split('\n').map((line, i) => (
          <span key={i}>{line}{i < address.split('\n').length - 1 && <br />}</span>
        ))}</div>
      </div>
    </div>
  );
}
