"use client";

import React from "react";
import Link from "next/link";
import { CONCEPTS } from "../data";

/**
 * Room concepts section — responsive.
 */
export default function Concepts() {
  return (
    <>
      {/* ── Desktop ── */}
      <section className="ah-concepts hidden md:block">
        <div className="ah-container">
          <div className="ah-concepts-header">
            <h2 className="ah-concepts-title">Room <em>concepts</em></h2>
            <p className="ah-concepts-subtitle">
              Each concept is designed as a different feeling — not just a style.
            </p>
          </div>
          <div className="ah-concepts-list">
            {CONCEPTS.map((c) => (
              <Link key={c.id} href={c.href} className="ah-concept-row">
                <span className="ah-concept-row-num">{c.number}</span>
                <span className="ah-concept-row-name">{c.name}</span>
                <span className="ah-concept-row-desc">{c.description}</span>
                <span className="ah-concept-row-arrow" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mobile ── */}
      <section className="ah-concepts-mobile md:hidden">
        <div className="ah-concepts-mobile-header">
          <h2 className="ah-concepts-mobile-title">
            Room <em>concepts</em>
          </h2>
          <p className="ah-concepts-mobile-subtitle">
            Each concept is designed as a different feeling — not just a style.
          </p>
        </div>

        <div className="ah-concepts-mobile-list">
          {CONCEPTS.map((c) => (
            <Link key={c.id} href={c.href} className="ah-concept-mobile-row">
              <div className="ah-concept-mobile-left">
                <span className="ah-concept-mobile-num">{c.number}</span>
                <span className="ah-concept-mobile-name">{c.name}</span>
              </div>
              <span className="ah-concept-mobile-arrow" aria-hidden />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}