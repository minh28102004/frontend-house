"use client";

import Link from "next/link";
import { useBanner } from "../hooks/useBanner";

const BannerProduct = () => {
  const { useGetActiveBanners } = useBanner();
  const { data: banners = [], isLoading } = useGetActiveBanners("products");

  const homeBanners = banners[0];

  if (isLoading) {
    return (
      <section className={`relative w-full h-auto bg-gray-100 animate-pulse rounded-lg`}>
        <div className="w-full h-[200px] md:h-[400px] flex gap-2 md:gap-4 px-0 md:px-0 py-0 md:py-0">
          <div className="flex-1 bg-gray-200 rounded-2xl min-h-[200px] md:min-h-[400px]" />
        </div>
      </section>
    );
  }

  if (!homeBanners && !isLoading) {
    return null;
  }

  return (
    <div
      className="w-screen  overflow-hidden relative"
      style={{
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
      }}
    >

      <img
        src={homeBanners?.imagePath}
        className="object-cover w-full h-full absolute inset-0 max-w-screen max-h-screen"
        style={{ maxWidth: "100vw", maxHeight: "100vh" }}
        alt="Banner background"
        draggable={false}
      />

      {/* Lớp phủ gradient tối nhẹ để làm nổi bật chữ */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

      {/* Text phần dưới ảnh */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full flex flex-col items-center px-2">
        <div className="uppercase text-xs tracking-widest text-white mb-1 font-light text-center">
          {homeBanners?.title}
        </div>
        <div 
          className="text-lg md:text-2xl font-semibold text-white mb-1 text-center [&_*]:text-white [&_*]:text-center [&_*]:font-semibold"
          dangerouslySetInnerHTML={{ __html: homeBanners?.description || "" }}
        />
        <button className="mt-1 px-5 py-1.5 bg-white/80 hover:bg-white text-brand-900 rounded-full text-sm font-medium transition duration-150">
          <Link href={homeBanners?.link || "/"}>
            Khám phá ngay
          </Link>
        </button>
      </div>
    </div>
  );
};

export default BannerProduct;
