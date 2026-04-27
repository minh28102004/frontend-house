"use client";

import { useBanner } from "../hooks/useBanner";

const BannerPosts = () => {
  const { useGetActiveBanners } = useBanner();
  const { data: banners = [], isLoading } = useGetActiveBanners("posts");

  const homeBanners = banners[0];

  if (isLoading) {
    return (
      <div className="w-full flex justify-center">
        <div
          className="w-full max-w-[2400px] aspect-[16/9] min-h-[180px] md:min-h-[400px] lg:min-h-[500px] max-h-[300px] md:max-h-[800px] lg:max-h-[1350px] overflow-hidden relative bg-gray-100 animate-pulse"
        >
          <div className="object-cover w-full h-full absolute inset-0 bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!homeBanners && !isLoading) {
    return null;
  }

  return (
    <div className="w-full flex justify-center">
      <div
        className="relative w-full max-w-[2400px] aspect-[16/9] min-h-[180px] md:min-h-[400px] lg:min-h-[500px] max-h-[300px] md:max-h-[800px] overflow-hidden"
        style={{ position: "relative" }}
      >
        <img
          src={homeBanners?.imagePath}
          className="object-cover w-full h-full absolute inset-0"
          alt="Banner background"
          draggable={false}
          style={{
            objectPosition: "center",
          }}
        />

        {/* Lớp phủ gradient tối nhẹ để làm nổi bật chữ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent md:bg-gradient-to-t md:from-black/40 md:via-black/10 md:to-transparent pointer-events-none" />

        {/* Text phần dưới ảnh */}
        <div className="absolute bottom-2 md:bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 w-full max-w-7xl flex flex-col items-center px-4 md:px-6 lg:px-8">
          <div className="uppercase text-[10px] md:text-xs lg:text-sm tracking-widest text-white mb-1 md:mb-2 font-light text-center">
            {homeBanners?.title}
          </div>
          <div
            className="text-base md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-white mb-1 text-center [&_*]:text-white [&_*]:text-center [&_*]:font-semibold"
            style={{
              textShadow: "0px 2px 6px rgba(0,0,0,0.2)",
              lineHeight: "1.3",
              wordBreak: "break-word"
            }}
            dangerouslySetInnerHTML={{ __html: homeBanners?.description || "" }}
          />
        </div>
      </div>
    </div>
  );
};

export default BannerPosts;
