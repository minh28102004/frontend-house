"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Slide config — dễ sửa, thêm/bớt slide tại đây ───────────────────────────
const SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=2000&q=85",
    label: "Romantic Suite",
    title: "Stay in a room\nthat feels like a",
    titleAccent: "story.",
    subtitle:
      "Không gian boutique được thiết kế để mang lại cảm giác bình yên, hiện đại và lặng lẽ sang trọng.",
    cta: { primary: "Đặt phòng ngay", secondary: "Khám phá phòng" },
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=2000&q=85",
    label: "Sky Room",
    title: "Drift above the\ncity into",
    titleAccent: "calm.",
    subtitle:
      "Sky Room — nơi ánh sáng tự nhiên tràn vào, đánh thức một ngày mới hoàn toàn khác biệt.",
    cta: { primary: "Đặt phòng ngay", secondary: "Khám phá phòng" },
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=2000&q=85",
    label: "Cinema Room",
    title: "An evening made\nfor",
    titleAccent: "wonder.",
    subtitle:
      "Cinema Room — màn hình lớn, ánh đèn ấm, và một bữa tối riêng tư chỉ dành cho hai người.",
    cta: { primary: "Đặt phòng ngay", secondary: "Khám phá phòng" },
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=2000&q=85",
    label: "Nature Suite",
    title: "Breathe. Rest.\nReturn to",
    titleAccent: "yourself.",
    subtitle:
      "Nature Suite — xanh mát, yên tĩnh và đủ ấm cúng để bạn quên mất mình đang ở giữa lòng thành phố.",
    cta: { primary: "Đặt phòng ngay", secondary: "Khám phá phòng" },
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2000&q=85",
    label: "Minimal Room",
    title: "Less clutter.\nMore",
    titleAccent: "presence.",
    subtitle:
      "Minimal Room — bố cục tinh gọn, chọn lọc từng chi tiết, dành cho những ai trân trọng sự đơn giản.",
    cta: { primary: "Đặt phòng ngay", secondary: "Khám phá phòng" },
  },
] as const;

const SLIDE_DURATION = 5000; // ms
const TRANSITION_DURATION = 800; // ms — must match CSS transition

// ─── Routes (replace with your actual endpoint imports) ───────────────────────
const ROUTES = {
  booking: "/booking",
  rooms: "/rooms",
};

// ─── Stats shown at bottom ───────────────────────────────────────────────────
const STATS = [
  { label: "Rooms", value: "05" },
  { label: "Concepts", value: "05" },
  { label: "Check-in", value: "14:00" },
  { label: "Mood", value: "Calm", italic: true },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────
type SlideIndex = 0 | 1 | 2 | 3 | 4;

export default function Hero() {
  const [current, setCurrent] = useState<number>(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // Advance to a specific slide
  const goTo = useCallback(
    (index: number) => {
      if (index === current || transitioning) return;
      setTransitioning(true);
      setContentVisible(false);
      setPrev(current);
      setProgress(0);

      setTimeout(
        () => {
          setCurrent(index);
          setTransitioning(false);
          setPrev(null);
          // Re-show content after image settles
          setTimeout(() => setContentVisible(true), 80);
        },
        prefersReduced ? 0 : TRANSITION_DURATION
      );
    },
    [current, transitioning, prefersReduced]
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  // Progress bar tick
  const startProgress = useCallback(() => {
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
    const tick = 50; // ms
    const steps = SLIDE_DURATION / tick;
    let step = 0;
    progressRef.current = setInterval(() => {
      step++;
      setProgress(Math.min((step / steps) * 100, 100));
    }, tick);
  }, []);

  // Auto-advance
  useEffect(() => {
    startProgress();
    intervalRef.current = setInterval(goNext, SLIDE_DURATION);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // Reset auto-advance on manual navigation
  const handleDotClick = (index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    goTo(index);
    // Re-arm interval after transition
    setTimeout(() => {
      intervalRef.current = setInterval(goNext, SLIDE_DURATION);
      startProgress();
    }, TRANSITION_DURATION + 100);
  };

  const slide = SLIDES[current];
  const prevSlide = prev !== null ? SLIDES[prev] : null;

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          DESKTOP (md+)
      ══════════════════════════════════════════════════════ */}
<section
  className="relative hidden md:flex items-center overflow-hidden bg-black"
  style={{
    width: "100vw",
    marginLeft: "calc(50% - 50vw)",
    marginRight: "calc(50% - 50vw)",
    height: "calc(100vh - 78px)",
    minHeight: 560,
  }}
>
        {/* ── Background images with crossfade ── */}
        {/* Outgoing slide */}
        {prevSlide && (
          <div
            className="absolute inset-0 z-0"
            style={{
              opacity: transitioning ? 0 : 1,
              transition: prefersReduced
                ? "none"
                : `opacity ${TRANSITION_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
            }}
          >
            <Image
              src={prevSlide.image}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              quality={85}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        )}

        {/* Incoming / current slide */}
        <div
          className="absolute inset-0 z-10"
          style={{
            opacity: transitioning ? 0 : 1,
            transition: prefersReduced
              ? "none"
              : `opacity ${TRANSITION_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
          }}
        >
          <Image
            src={slide.image}
            alt={`Another House — ${slide.label}`}
            fill
            className="object-cover"
            sizes="100vw"
            quality={85}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* ── Main content ── */}
        <div className="relative z-20 w-full h-full flex flex-col justify-center pl-10 lg:pl-20 xl:pl-28 pb-20">
          {/* Eyebrow */}
          <div
            className="flex items-center gap-3 mb-6"
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(12px)",
              transition: prefersReduced
                ? "none"
                : "opacity 500ms ease 0ms, transform 500ms ease 0ms",
            }}
          >
            <div className="w-10 h-px bg-gradient-to-r from-amber-400 to-yellow-300 shrink-0" />
            <span className="text-xs tracking-[3px] uppercase font-medium text-amber-100/80">
              {slide.label} · Ho Chi Minh City
            </span>
          </div>

          {/* Title */}
          <h1
            className="max-w-xl text-white font-light leading-[1.08] mb-5"
            style={{
              fontSize: "clamp(40px, 5vw, 68px)",
              letterSpacing: "-1.5px",
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(16px)",
              transition: prefersReduced
                ? "none"
                : "opacity 550ms ease 60ms, transform 550ms ease 60ms",
            }}
          >
            {slide.title.split("\n").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
            <span className="italic font-medium text-amber-300">
              {slide.titleAccent}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="max-w-sm text-neutral-300 leading-relaxed mb-10"
            style={{
              fontSize: "clamp(15px, 1.3vw, 18px)",
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(14px)",
              transition: prefersReduced
                ? "none"
                : "opacity 550ms ease 120ms, transform 550ms ease 120ms",
            }}
          >
            {slide.subtitle}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-3 mb-14"
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(12px)",
              transition: prefersReduced
                ? "none"
                : "opacity 550ms ease 180ms, transform 550ms ease 180ms",
            }}
          >
            <Link
              href={ROUTES.booking}
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-amber-400 hover:bg-white text-black font-medium rounded-full transition-all duration-300"
              style={{ fontSize: "clamp(13px, 1vw, 15px)", letterSpacing: "0.3px" }}
            >
              {slide.cta.primary}
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>
            <Link
              href={ROUTES.rooms}
              className="group inline-flex items-center gap-2 px-8 py-3.5 border border-white/50 hover:border-white/90 text-white hover:text-amber-200 font-medium rounded-full transition-all duration-300"
              style={{ fontSize: "clamp(13px, 1vw, 15px)", letterSpacing: "0.3px" }}
            >
              {slide.cta.secondary}
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                ↗
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-4 gap-x-10 text-white"
            style={{
              opacity: contentVisible ? 1 : 0,
              transition: prefersReduced
                ? "none"
                : "opacity 600ms ease 250ms",
            }}
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-[10px] tracking-widest uppercase text-amber-100/60 mb-1">
                  {s.label}
                </div>
                <div
                  className={`text-3xl font-light ${s.italic ? "italic text-amber-200" : ""}`}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Rating badge ── */}
        <div className="absolute bottom-10 right-10 lg:right-16 z-30 flex items-center gap-4 bg-black/60 backdrop-blur-sm border border-white/10 px-6 py-4 rounded-2xl">
          <div className="text-4xl font-light tracking-tight text-amber-300">
            5★
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-white/80">
              Guest rating
            </div>
            <div className="text-[11px] text-amber-100/60">
              Based on 87 reviews
            </div>
          </div>
        </div>

        {/* ── Slide controls: dots + progress ── */}
        <div className="absolute bottom-10 left-10 lg:left-20 z-30 flex items-center gap-4">
          {/* Progress bar for current slide */}
          <div className="w-32 h-px bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-300 rounded-full"
              style={{
                width: `${progress}%`,
                transition: "width 50ms linear",
              }}
            />
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-5 h-1.5 bg-amber-300"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <span className="text-[11px] text-white/50 tracking-widest">
            {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        {/* ── Scroll hint ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 hidden lg:flex flex-col items-center gap-2 text-white/40 text-[10px] tracking-[3px] uppercase">
          <span>Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MOBILE (< md)
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative flex flex-col md:hidden overflow-hidden bg-black"
        style={{ minHeight: "75vh" }}
      >
        {/* Image */}
        <div className="relative w-full" style={{ height: "45vh", minHeight: 260 }}>
          <Image
            src={slide.image}
            alt={`Another House — ${slide.label}`}
            fill
            className="object-cover"
            sizes="100vw"
            quality={75}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />

          {/* Badge */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3 bg-black/60 backdrop-blur-sm border border-white/10 px-4 py-2.5 rounded-xl">
            <span className="text-2xl font-light text-amber-300">5★</span>
            <span className="text-[10px] uppercase tracking-widest text-white/70">
              Guest rating
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 bg-neutral-950 px-5 pt-6 pb-8">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-amber-400 shrink-0" />
            <span className="text-[10px] tracking-[2.5px] uppercase text-amber-100/70">
              {slide.label} · HCMC
            </span>
          </div>

          {/* Title */}
          <h1 className="text-white font-light leading-[1.1] mb-3" style={{ fontSize: "clamp(28px, 7.5vw, 38px)", letterSpacing: "-0.8px" }}>
            {slide.title.split("\n").map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
            <span className="italic font-medium text-amber-300">{slide.titleAccent}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-neutral-400 leading-relaxed mb-6 text-[13px]">
            {slide.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-2.5 mb-6">
            <Link
              href={ROUTES.booking}
              className="w-full text-center py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-medium rounded-full text-sm tracking-wide transition-colors duration-200"
            >
              {slide.cta.primary}
            </Link>
            <Link
              href={ROUTES.rooms}
              className="w-full text-center py-3.5 border border-white/30 text-white/80 font-medium rounded-full text-sm tracking-wide transition-colors duration-200"
            >
              {slide.cta.secondary}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/10">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-[9px] tracking-widest uppercase text-amber-100/50 mb-0.5">
                  {s.label}
                </div>
                <div className={`text-lg font-light text-white ${s.italic ? "italic text-amber-200" : ""}`}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-4 h-1 bg-amber-300"
                    : "w-1 h-1 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}