"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { endpoint } from "@/shared/routes/endpoint";

/**
 * Intro / Philosophy section — responsive.
 */
export default function Intro() {
  return (
    <>
      {/* ── Desktop ── */}
      <section className="ah-intro hidden md:block">
        <div className="ah-container">
          <div className="ah-intro-inner">
            {/* Left */}
            <div>
              <div className="ah-intro-label">
                <span className="gold-line" />
                <span className="f-label" style={{ color: "#C4944A" }}>
                  Our philosophy
                </span>
              </div>
              <h2 className="ah-intro-title">
                Curated like<br />a <em>gallery.</em>
              </h2>
              <p className="ah-intro-body">
                We focus on materials, light, and quiet details — the kind you
                notice slowly. Every room is a different atmosphere, so your stay
                can match your mood.
              </p>
              <div className="ah-intro-tags">
                {["Minimal luxury", "Concept-driven", "Soft lighting", "Modern comfort"].map((t) => (
                  <span key={t} className="ah-intro-tag">{t}</span>
                ))}
              </div>
              <div style={{ marginTop: "40px" }}>
                <Link href={endpoint.public.about} className="btn-ghost" style={{ color: "rgba(25,22,20,0.6)" }}>
                  About Another House
                  <span className="btn-ghost-arrow" />
                </Link>
              </div>
            </div>

            {/* Right */}
            <div className="ah-intro-img-wrap">
              <span className="ah-intro-side-text">Another House · Est. 2024</span>
              <div className="ah-intro-img-frame">
                <Image
                  src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80"
                  alt="Another House interior detail"
                  fill
                  loading="lazy"
                  sizes="50vw"
                  className="ah-intro-img"
                />
              </div>
              <div className="ah-intro-img-caption">Minimal room concept</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile ── */}
      <section className="ah-intro-mobile md:hidden">
        <div className="ah-intro-mobile-label">
          <span className="gold-line" />
          <span className="f-label" style={{ color: "#C4944A" }}>Our philosophy</span>
        </div>

        <h2 className="ah-intro-mobile-title">
          Curated like a <em>gallery.</em>
        </h2>

        <p className="ah-intro-mobile-body">
          We focus on materials, light, and quiet details — the kind you notice
          slowly. Every room is a different atmosphere, so your stay can match your mood.
        </p>

        <div className="ah-intro-mobile-tags">
          {["Minimal luxury", "Concept-driven", "Soft lighting"].map((t) => (
            <span key={t} className="ah-intro-mobile-tag">{t}</span>
          ))}
        </div>

        <div className="ah-intro-mobile-img-wrap">
          <Image
            src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=70"
            alt="Another House interior"
            fill
            loading="lazy"
            sizes="100vw"
            className="ah-intro-mobile-img"
          />
          <div className="ah-intro-mobile-img-caption">Minimal room concept</div>
        </div>
      </section>
    </>
  );
}