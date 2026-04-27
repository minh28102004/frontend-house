import PostDetailClientPage from "@/modules/client/pages/PostDetailClient";
import type { Metadata } from "next";
import { getPostBySlug } from "@/modules/client/posts/services/post.service";

// Build absolute image URL from post thumbnail (string or array)
function resolveImageUrl(thumbnail: any): string | undefined {
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  if (!thumbnail) return undefined;

  let imagePath = "";

  if (Array.isArray(thumbnail)) {
    const first = thumbnail[0];
    if (!first) return undefined;
    imagePath = String(first);
  } else {
    imagePath = String(thumbnail);
  }

  if (!imagePath || imagePath === "undefined" || imagePath === "null") return undefined;

  // Nếu đã là URL đầy đủ
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Nếu bắt đầu với /uploads
  if (imagePath.startsWith("/uploads")) {
    return `${base}${imagePath}`;
  }

  // Nếu không có / ở đầu, thêm /
  if (!imagePath.startsWith("/")) {
    return `${base}/${imagePath}`;
  }

  return `${base}${imagePath}`;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const slug = (await params).slug;
  try {
    const post = await getPostBySlug(slug);
    const title = post?.title ? post.title.toUpperCase() : "BÀI VIẾT";
    // Ưu tiên metaDescription, chỉ dùng excerpt khi metaDescription trống
    const metaDesc = post?.metaDescription?.toString().trim();
    const excerpt = post?.excerpt?.toString().trim();
    const rawDesc = metaDesc || excerpt || "";

    const sanitizedDesc = rawDesc
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const description = sanitizedDesc ? (sanitizedDesc.length > 160 ? `${sanitizedDesc.slice(0, 157)}...` : sanitizedDesc) : undefined;
    const image = resolveImageUrl((post as any)?.thumbnail);
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/posts/${slug}`;

    // Debug log để kiểm tra hình ảnh
    console.log('Post thumbnail:', (post as any)?.thumbnail);
    console.log('Resolved image URL:', image);

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: "article",
        images: image ? [{
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }] : undefined,
        siteName: "Wekee",
      },
      twitter: {
        card: image ? "summary_large_image" : "summary",
        title,
        description,
        images: image ? [image] : undefined,
        creator: "@wekee",
      },
    };
  } catch {
    return { title: "BÀI VIẾT", description: undefined };
  }
}

export default async function CategoryPageWrapper({ params, }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <PostDetailClientPage slug={slug} />
  );

}
