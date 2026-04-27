'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './AboutSpace.module.css';

const AMENITIES = [
  'Premium linens',
  'Filtered air',
  'Acoustic walls',
  'Rain shower',
  'Soft lighting scenes',
  'Fast Wi-Fi',
  'Daily fresh flowers',
  'Curated amenities',
];

const GALLERY = [
  {
    src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=70',
    alt: 'Nature room',
  },
  {
    src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=70',
    alt: 'Sky room',
  },
  {
    src: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=70',
    alt: 'Romantic room',
  },
];

export default function AboutSpace() {
  return (
    <section className={styles.spaceSection}>
      <div className={styles.spaceTop}>
        <div className={styles.spaceImgWrap}>
          <Image
            src="https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1400&q=70"
            alt="Another House space"
            fill
            className={styles.spaceImg}
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className={styles.spaceContent}>
          <div className={styles.spaceLabel}>
            <span className={styles.goldLine} />
            <span>The space</span>
          </div>
          <h2 className={styles.spaceTitle}>
            Designed to<br />slow you<br /><em>down.</em>
          </h2>
          <p className={styles.spaceBody}>
            Beyond the concepts, every shared and private space at Another House is calibrated
            for rest. We think carefully about acoustics, temperature, and the small rituals of a good stay.
          </p>
          <div className={styles.spaceAmenities}>
            {AMENITIES.map((item) => (
              <div key={item} className={styles.spaceAmenity}>
                <span className={styles.spaceAmenityDot} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.spaceGallery}>
        {GALLERY.map((item) => (
          <div key={item.alt} className={styles.spaceGalleryItem}>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className={styles.spaceGalleryImg}
              sizes="(max-width: 600px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
