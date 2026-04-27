"use client";

import { useBanner } from "@/modules/client/posts/hooks/useBanner";
import { Banner } from "@/modules/client/posts/models/banner.model";

/**
 * Home page banner — responsive.
 * Shared logic for fetching banner data, separate layouts for desktop/mobile.
 */
const BannerHome = () => {
  const { useGetActiveBanners } = useBanner();
  const { data: banners = [], isLoading } = useGetActiveBanners("home");

  const bannerDesktop = banners.find((b: Banner) => b.type === "home") || banners[0];
  const bannerMobile = banners.find((b: Banner) => b.type === "home-mobile") || bannerDesktop;

  if (isLoading) {
    return (
      <div className="w-full flex justify-center bg-[#191614]">
        {/* Desktop loader */}
        <div
          className="hidden md:block w-full max-w-[2400px] aspect-[16/9] min-h-[400px] lg:min-h-[500px] max-h-[700px] lg:max-h-[900px] overflow-hidden relative bg-gray-200 animate-pulse"
        />
        {/* Mobile loader */}
        <div
          className="md:hidden w-full aspect-[4/3] min-h-[220px] max-h-[400px] overflow-hidden relative bg-gray-200 animate-pulse"
        />
      </div>
    );
  }

  if (!bannerDesktop && !bannerMobile) {
    return null;
  }

  return (
    <>
      {/* ── Desktop ── */}
      {bannerDesktop && (
        <div className="w-full flex justify-center bg-[#191614] hidden md:block">
          <div
            className="relative w-full max-w-[2400px] aspect-[16/9] min-h-[400px] lg:min-h-[500px] max-h-[700px] lg:max-h-[900px] overflow-hidden"
          >
            <img
              src={bannerDesktop.imagePath}
              className="object-cover w-full h-full absolute inset-0"
              alt={bannerDesktop.title || "Another House banner"}
              draggable={false}
              style={{ objectPosition: "center" }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-7xl flex flex-col items-center px-6">
              {bannerDesktop.title && (
                <div className="uppercase text-xs tracking-widest text-white/70 mb-3 font-light text-center font-[DM_Sans]">
                  {bannerDesktop.title}
                </div>
              )}
              {bannerDesktop.description && (
                <div
                  className="text-2xl lg:text-4xl font-semibold text-white mb-6 text-center [&_*]:text-white [&_*]:text-center [&_*]:font-semibold"
                  style={{
                    textShadow: "0px 2px 8px rgba(0,0,0,0.25)",
                    lineHeight: "1.3",
                    wordBreak: "break-word",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                  dangerouslySetInnerHTML={{ __html: bannerDesktop.description }}
                />
              )}
              {bannerDesktop.link && (
                <a
                  href={bannerDesktop.link}
                  className="btn-primary"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span>Discover More</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile ── */}
      {bannerMobile && (
        <div className="w-full flex justify-center bg-[#191614] md:hidden">
          <div
            className="relative w-full aspect-[4/3] min-h-[220px] max-h-[400px] overflow-hidden"
          >
            <img
              src={bannerMobile.imagePath}
              className="object-cover w-full h-full absolute inset-0"
              alt={bannerMobile.title || "Another House banner"}
              draggable={false}
              style={{ objectPosition: "center" }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-7xl flex flex-col items-center px-4">
              {bannerMobile.title && (
                <div className="uppercase text-[9px] tracking-widest text-white/70 mb-2 font-light text-center font-[DM_Sans]">
                  {bannerMobile.title}
                </div>
              )}
              {bannerMobile.description && (
                <div
                  className="text-base font-semibold text-white mb-3 text-center [&_*]:text-white [&_*]:text-center [&_*]:font-semibold"
                  style={{
                    textShadow: "0px 2px 6px rgba(0,0,0,0.25)",
                    lineHeight: "1.3",
                    wordBreak: "break-word",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                  dangerouslySetInnerHTML={{ __html: bannerMobile.description }}
                />
              )}
              {bannerMobile.link && (
                <a
                  href={bannerMobile.link}
                  className="btn-primary"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span>Discover</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BannerHome;