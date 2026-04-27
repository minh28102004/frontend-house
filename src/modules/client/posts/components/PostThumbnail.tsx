import type { FC } from "react";

interface PostThumbnailProps {
  src: string;
  alt: string;
}

const PostThumbnail: FC<PostThumbnailProps> = ({ src, alt }) => (
  <div className="relative w-full max-w-[800px] h-[300px] md:h-[600px] md:w-[800px] mb-8 overflow-hidden mx-auto">
    <img
      src={src}
      alt={alt}
      className="object-cover w-full h-full"
      width={800}
      height={600}
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "800px",
        maxHeight: "600px",
        display: "block",
      }}
    />
  </div>
);

export default PostThumbnail;