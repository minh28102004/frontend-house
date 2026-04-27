"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ROOMS } from "../data";
import { endpoint } from "@/shared/routes/endpoint";

/**
 * Featured rooms section — responsive.
 */
export default function Rooms() {
  return (
    <>
      {/* ── Desktop ── */}
      <section className="ah-rooms-section hidden md:block">
        <div className="ah-container">
          <div className="ah-rooms-header">
            <div>
              <div className="ah-rooms-label-row">
                <span className="gold-line" />
                <span className="f-label" style={{ color: "#C4944A" }}>Our spaces</span>
              </div>
              <h2 className="ah-rooms-title f-display">Featured rooms</h2>
            </div>
            <Link href={endpoint.rooms.list} className="ah-rooms-view-all">
              Xem tất cả phòng
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
                <path d="M1 6h14M9 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="ah-rooms-grid">
          {ROOMS.slice(0, 3).map((room) => (
            <Link key={room.id} href={room.href} className="ah-room-card reveal-fade-up">
              <Image
                src={room.image}
                alt={`${room.name} room`}
                fill
                loading="lazy"
                sizes="33vw"
                className="ah-room-card-img"
              />
              <div className="ah-room-card-overlay" />
              <div className="ah-room-card-body">
                <div className="ah-room-card-num">{room.number}</div>
                <div className="ah-room-card-name f-display">{room.name}</div>
                <div className="ah-room-card-desc">{room.description}</div>
                <div className="ah-room-card-link">
                  Khám phá
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
                    <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Mobile ── */}
      <section className="ah-rooms-mobile md:hidden">
        <div className="ah-rooms-mobile-header">
          <div className="ah-intro-mobile-label">
            <span className="gold-line" />
            <span className="f-label" style={{ color: "#C4944A" }}>Our spaces</span>
          </div>
          <h2 className="ah-rooms-mobile-title f-display">Featured rooms</h2>
          <p className="ah-rooms-mobile-subtitle">Swipe to explore our concept rooms</p>
        </div>

        <div className="ah-rooms-mobile-scroll">
          {ROOMS.map((room) => (
            <Link key={room.id} href={room.href} className="ah-room-mobile-card reveal-fade-up">
              <div className="ah-room-mobile-img-wrap">
                <Image
                  src={room.image}
                  alt={`${room.name} room`}
                  fill
                  loading="lazy"
                  sizes="260px"
                  className="ah-room-mobile-img"
                />
                <span className="ah-room-mobile-num">{room.number}</span>
              </div>
              <div className="ah-room-mobile-body">
                <div className="ah-room-mobile-name f-display">{room.name}</div>
                <div className="ah-room-mobile-desc">{room.description}</div>
                <div className="ah-room-mobile-price">
                  <strong>{room.price}</strong> / night
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link href={endpoint.rooms.list} className="ah-rooms-mobile-view-all">
          Xem tất cả phòng
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
            <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>
    </>
  );
}