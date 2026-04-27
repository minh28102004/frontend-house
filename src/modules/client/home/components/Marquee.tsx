"use client";

import React from "react";

/**
 * Marquee animation section — responsive.
 */
export default function Marquee() {
  return (
    <>
      {/* ── Desktop ── */}
      <div className="ah-marquee-strip hidden md:block" aria-hidden="true">
        <div className="ah-marquee-inner">
          {[
            "Romantic", "Sky", "Cinema", "Nature", "Minimal",
            "Boutique mood", "Minimal luxury", "Unique concepts",
            "Romantic", "Sky", "Cinema", "Nature", "Minimal",
            "Boutique mood", "Minimal luxury", "Unique concepts",
          ].map((item, i) => (
            <span key={i} className="ah-marquee-item">
              <span className="ah-marquee-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="ah-marquee-mobile md:hidden" aria-hidden="true">
        <div className="ah-marquee-mobile-inner">
          {[
            "Romantic", "Sky", "Cinema", "Nature", "Minimal", "Boutique mood",
            "Romantic", "Sky", "Cinema", "Nature", "Minimal", "Boutique mood",
          ].map((item, i) => (
            <span key={i} className="ah-marquee-mobile-item">
              <span className="ah-marquee-mobile-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
