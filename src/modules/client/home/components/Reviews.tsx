"use client";

import React from "react";
import { REVIEWS } from "../data";

const StarIcon = () => (
  <svg className="ah-review-star" width="10" height="10" viewBox="0 0 10 10" aria-hidden>
    <path d="M5 0l1.1 3.5H10L6.9 5.6l1.1 3.4L5 6.8 1.9 9l1.1-3.4L0 3.5h3.9L5 0z" fill="#C4944A" />
  </svg>
);

/**
 * Guest reviews section — responsive.
 */
export default function Reviews() {
  return (
    <>
      {/* ── Desktop ── */}
      <section className="ah-reviews hidden md:block">
        <div className="ah-container">
          <div className="ah-reviews-header">
            <div>
              <div className="ah-reviews-label-row">
                <span className="gold-line" />
                <span className="f-label" style={{ color: "#C4944A" }}>Guest voices</span>
              </div>
              <h2 className="ah-reviews-title f-display">What guests say</h2>
            </div>
            <div className="ah-reviews-stars">
              <div className="ah-reviews-stars-count f-display">5.0</div>
              <div className="ah-reviews-stars-label">Average rating</div>
            </div>
          </div>

          <div className="ah-reviews-grid">
            {REVIEWS.map((r) => (
              <div key={r.id} className="ah-review-card reveal-fade-up">
                <div className="ah-review-stars">
                  {Array.from({ length: r.stars }).map((_, i) => <StarIcon key={i} />)}
                </div>
                <p className="ah-review-quote">{r.quote}</p>
                <div className="ah-review-author">
                  <div className="ah-review-author-dot">{r.authorInitial}</div>
                  <span className="ah-review-author-name">{r.authorName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mobile ── */}
      <section className="ah-reviews-mobile md:hidden">
        <div className="ah-reviews-mobile-header">
          <div className="ah-intro-mobile-label">
            <span className="gold-line" />
            <span className="f-label" style={{ color: "#C4944A" }}>Guest voices</span>
          </div>
          <h2 className="ah-reviews-mobile-title f-display">What guests say</h2>
          <div className="ah-reviews-mobile-rating">
            <div className="ah-reviews-mobile-rating-num f-display">5.0</div>
            <div className="ah-reviews-mobile-rating-label">Average rating</div>
          </div>
        </div>

        <div className="ah-reviews-mobile-list">
          {REVIEWS.slice(0, 2).map((r) => (
            <div key={r.id} className="ah-review-mobile-card reveal-fade-up">
              <div className="ah-review-mobile-stars">
                {Array.from({ length: r.stars }).map((_, i) => <StarIcon key={i} />)}
              </div>
              <p className="ah-review-mobile-quote">{r.quote}</p>
              <div className="ah-review-mobile-author">
                <div className="ah-review-mobile-author-dot">{r.authorInitial}</div>
                <span className="ah-review-mobile-author-name">{r.authorName}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}