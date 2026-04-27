"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { endpoint } from "@/shared/routes/endpoint";

/**
 * Call to action section — responsive.
 */
export default function Cta() {
  return (
    <>
      {/* ── Desktop ── */}
      <section className="ah-cta-section hidden md:block">
        <div className="ah-container">
          <div className="ah-cta-block">
            <Image
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70"
              alt="Another House room"
              fill
              loading="lazy"
              sizes="50vw"
              className="ah-cta-img"
            />
            <div className="ah-cta-overlay" />
            <div className="ah-cta-content">
              <div className="ah-cta-label">
                <span className="gold-line" />
                <span>Sẵn sàng?</span>
              </div>
              <h2 className="ah-cta-title">
                Chọn phong cách<br /><em>của bạn.</em>
              </h2>
              <p className="ah-cta-body">
                Chọn không gian phù hợp với tâm trạng của bạn — romantic, sky, cinema, nature, hoặc minimal
                — chúng tôi sẽ lo liệu phần còn lại.
              </p>
              <div className="ah-cta-actions">
                <Link href={endpoint.rooms.booking} className="btn-light">Đặt phòng ngay</Link>
                <Link href={endpoint.rooms.list} className="btn-outline-light">Xem tất cả phòng</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile ── */}
      <section className="ah-cta-mobile md:hidden">
        <div className="ah-cta-mobile-label">
          <span className="gold-line" />
          <span className="f-label" style={{ color: "#C4944A" }}>Sẵn sàng?</span>
        </div>

        <h2 className="ah-cta-mobile-title">
          Chọn phong cách <em>của bạn.</em>
        </h2>

        <p className="ah-cta-mobile-body">
          Chọn không gian phù hợp với tâm trạng của bạn — romantic, sky, cinema, nature, hoặc minimal — chúng tôi sẽ lo liệu phần còn lại.
        </p>

        <div className="ah-cta-mobile-actions">
          <Link href={endpoint.rooms.booking} className="btn-primary ah-btn-mobile-full">
            <span>Đặt phòng ngay</span>
          </Link>
          <Link href={endpoint.rooms.list} className="btn-outline-light ah-btn-mobile-full">
            Xem tất cả phòng
          </Link>
        </div>
      </section>
    </>
  );
}