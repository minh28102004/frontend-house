'use client';

import {
  AboutHeroDesktop,
  AboutHeroMobile,
  AboutManifesto,
  AboutPillars,
  AboutSpace,
  AboutCta,
} from './components';

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Desktop: ≥ 768px */}
      <div className="hide-mobile">
        <AboutHeroDesktop />
        <AboutManifesto />
        <AboutPillars />
        <AboutSpace />
        <AboutCta />
      </div>

      {/* Mobile: < 768px */}
      <div className="show-mobile-only">
        <AboutHeroMobile />
        <AboutManifesto />
        <AboutPillars />
        <AboutSpace />
        <AboutCta />
      </div>
    </div>
  );
}
