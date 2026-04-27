'use client';

import React, { useEffect } from 'react';
import styles from './FooterPc.module.css';

const MARQUEE_ITEMS = [
  'Romantic',
  'Sky',
  'Cinema',
  'Nature',
  'Minimal',
  'Boutique mood',
  'Minimal luxury',
  'Unique concepts',
  'Another House',
];

const FooterPc: React.FC = () => {
  useEffect(() => {
    // Dynamic year update
    const yearEl = document.getElementById('ahFooterYear');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }, []);

  const buildMarquee = () => {
    const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
    return doubled.map((item, index) => (
      <span key={index} className={styles.marqueeItem}>
        <span className={styles.marqueeDot}></span>
        {item}
      </span>
    ));
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Marquee strip */}
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeInner}>{buildMarquee()}</div>
      </div>

      {/* Main grid */}
      <div className={styles.footerTop}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandName}>Another House</div>
          <p className={styles.brandDesc}>
            A creative boutique homestay with unique themed rooms. Minimal luxury, unique concepts.
          </p>
          <div className={styles.tagline}>
            <span className={styles.taglineLine}></span>
            <span className={styles.taglineText}>
              Boutique mood &nbsp;·&nbsp; Minimal luxury &nbsp;·&nbsp; Unique concepts
            </span>
          </div>
        </div>

        {/* Navigate */}
        <div>
          <div className={styles.colTitle}>Navigate</div>
          <div className={styles.links}>
            <a href="index.html" className={styles.link}>
              Home
            </a>
            <a href="rooms.html" className={styles.link}>
              Rooms
            </a>
            <a href="about.html" className={styles.link}>
              About
            </a>
            <a href="contact.html" className={styles.link}>
              Contact
            </a>
            <a href="news.html" className={styles.link}>
              News
            </a>
          </div>
        </div>

        {/* Book */}
        <div>
          <div className={styles.colTitle}>Stay</div>
          <div className={styles.links}>
            <a href="bookingDesktop.html" className={styles.linkHighlight}>
              Book a room
              <svg
                width="12"
                height="9"
                viewBox="0 0 12 9"
                fill="none"
                aria-hidden="true"
                className={styles.linkArrow}
              >
                <path
                  d="M1 4.5h10M7 1l3.5 3.5L7 8"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="contact.html" className={styles.link}>
              Ask a question
            </a>
            <a href="rooms.html" className={styles.link}>
              View all rooms
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.footerBottom}>
        <div className={styles.bottomInner}>
          <span className={styles.copyright}>
            © <span id="ahFooterYear">{new Date().getFullYear()}</span> Another House
          </span>

          <div className={styles.socials} aria-label="Social links">
            {/* Instagram */}
            <a href="#" className={styles.social} aria-label="Instagram">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" className={styles.social} aria-label="Facebook">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            {/* TikTok */}
            <a href="#" className={styles.social} aria-label="TikTok">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterPc;
