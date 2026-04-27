"use client";

import Link from "next/link";
import { Category } from "../services/client.product.service";

type Props = {
  category: Category | null;
  isAllProducts: boolean;
};

const CategoryHeroBanner = ({ category, isAllProducts }: Props) => {
  const bannerDesktop = category?.bannerImage || category?.image;
  const bannerMobile = category?.bannerMobileImage || category?.bannerImage || category?.image;

  const categoryTitle = category?.bannerTitle;
  const categorySubtitle = category?.bannerSubtitle;
  const categoryCtaLabel = category?.bannerCtaLabel;
  const categoryCtaLink = category?.bannerCtaLink;

  const title = isAllProducts ? "Tất cả sản phẩm" : categoryTitle;

  const description = isAllProducts
    ? "Khám phá bộ sưu tập sản phẩm được tuyển chọn kỹ lưỡng cho bạn."
    : categorySubtitle;

  const derivedCtaLabel = isAllProducts ? "" : categoryCtaLabel;
  const derivedCtaLink = isAllProducts
    ? "/san-pham"
    : categoryCtaLink || (category?.slug ? `/danh-muc/${category.slug}` : undefined);

  const showCta = Boolean(derivedCtaLabel && derivedCtaLink);
  const showContent = isAllProducts || Boolean(title || description || showCta);

  return (
    <div className="w-full overflow-x-hidden">
      <section className="relative w-full text-white overflow-hidden">
      {/* Container Desktop - hình chữ nhật ngang */}
      <div className="hidden md:block relative w-full max-w-[2400px] mx-auto aspect-[16/9] min-h-screen lg:min-h-[110vh] max-h-[1550px]">
        {bannerDesktop ? (
          <img
            src={bannerDesktop}
            alt={title}
            width={2400}
            height={1350}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700" />
        )}
        {/* Content overlay - Desktop */}
        {showContent && (
          <div className="absolute bottom-0 left-0 w-full max-w-3xl flex flex-col items-start px-10 py-8 text-left drop-shadow z-10">
            {title && (
              <div className="text-lg md:text-2xl lg:text-3xl text-white tracking-wide mb-3 max-w-4xl">
                {title}
              </div>
            )}
            {description && (
              <p className="max-w-xl text-sm md:text-base lg:text-lg text-white mb-5">
                {description}
              </p>
            )}
            {showCta && derivedCtaLink && (
              <Link
                href={derivedCtaLink}
                className="inline-flex items-center gap-2 px-6 py-2 md:px-8 md:py-3 bg-white/90 hover:bg-white text-brand-900 rounded-full text-sm md:text-base font-semibold tracking-wide uppercase transition duration-150"
              >
                {derivedCtaLabel}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Container Mobile - hình chữ nhật đứng */}
      <div className="block md:hidden relative w-full mx-auto aspect-[4/5.3] mt-16 md:mt-0">
        {bannerMobile ? (
          <img
            src={bannerMobile}
            alt={title}
            width={1080}
            height={1920}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700" />
        )}
      </div>
      {showContent && (
        <div className="block md:hidden relative w-full left-0 px-3 pt-4 bg-gradient-to-b z-10 mt-5 flex flex-col items-center justify-center text-center">
          {title && (
            <div className="text-2xl text-black tracking-wide mb-3 max-w-sm">
              {title}
            </div>
          )}
          {description && (
            <p className="max-w-sm text-base text-black mb-3 text-justify">
              {description}
            </p>
          )}
          {showCta && derivedCtaLink && (
            <Link
              href={derivedCtaLink}
              className="inline-flex items-center gap-2 px-6 py-2 bg-black/90 hover:bg-white text-white rounded-full text-sm font-semibold tracking-wide uppercase transition duration-150"
            >
              {derivedCtaLabel}
            </Link>
          )}
        </div>
      )}
      </section>
    </div>
  );
};

export default CategoryHeroBanner;

