'use client';

import {
  ContactHeroDesktop,
  ContactHeroMobile,
  ContactMap,
  ContactInfo,
  ContactAddressStrip,
  ContactCta,
  ContactForm,
} from './components';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  return (
    <div className="w-full">
      {/* Desktop: ≥ 768px */}
      <div className="hide-mobile">
        <ContactHeroDesktop />

        <section className={styles.contactMain}>
          <div className={styles.contactGrid}>
            {/* Left: Map + address */}
            <div className={`${styles.mapCol} reveal-fade-up`}>
              <ContactMap />
              <ContactAddressStrip />
            </div>

            {/* Right: Info + CTA */}
            <div className={`${styles.sidePanel} reveal-fade-up`} style={{ transitionDelay: '0.15s' }}>
              <ContactInfo />
              <ContactForm />
              <ContactCta />
            </div>
          </div>
        </section>
      </div>

      {/* Mobile: < 768px */}
      <div className="show-mobile-only">
        <ContactHeroMobile />

        <ContactMap />

        <ContactAddressStrip />

        <ContactInfo />

        <div className={styles.ctaMobile}>
          <div className={styles.ctaLabel}>
            <span className={styles.goldLine} />
            <span>Plan your stay</span>
          </div>
          <h2 className={styles.ctaTitle}>Tell us your <em>mood.</em></h2>
          <p className={styles.ctaBody}>
            Romantic, sky, cinema, nature, or minimal — share the feeling you're after and we'll
            match you with the right room.
          </p>
          <div className={styles.ctaActions}>
            <a href="/rooms" className={styles.btnGold}>
              Explore rooms
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="/booking" className={styles.btnOutlineLight}>
              Book now
            </a>
          </div>
        </div>

        <div className={styles.contactFormSection}>
          <h3 className={styles.contactFormTitle}>Liên hệ với chúng tôi</h3>
          <ContactForm />
        </div>

        <div className={styles.infoStrip}>
          <div className={styles.infoStripInner}>
            <div className={styles.infoItem}>
              <span className={styles.infoDot} />Check-in from 2:00 PM
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoDot} />Check-out by 12:00 PM
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoDot} />No smoking
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoDot} />Pets welcome
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
