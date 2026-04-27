/**
 * Chuẩn hóa URL ảnh/video tĩnh để luôn tải qua cùng origin (Next.js rewrite → /uploads).
 * Tránh CORS khi dùng crossOrigin trên <img> hoặc khi API trả URL đầy đủ :8080.
 */
const PLACEHOLDER = "/placeholder.svg?height=400&width=600";

function stripApiOrigin(fullUrl: string): string | null {
  const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (api && fullUrl.startsWith(api)) {
    return fullUrl.slice(api.length) || "/";
  }
  try {
    const u = new URL(fullUrl);
    if (u.pathname.startsWith("/uploads")) {
      return `${u.pathname}${u.search}`;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function resolveMediaUrl(input: unknown, placeholder = PLACEHOLDER): string {
  if (input == null) return placeholder;

  let path: string | undefined;
  if (Array.isArray(input)) {
    const first = input[0];
    path = typeof first === "string" ? first : undefined;
  } else if (typeof input === "string") {
    path = input;
  }

  if (!path?.trim()) return placeholder;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    const local = stripApiOrigin(path);
    if (local) return local;
    return path;
  }

  if (path.startsWith("/uploads")) return path;
  if (path.startsWith("/")) return path;
  if (path.startsWith("uploads/")) return `/${path}`;
  return path;
}
