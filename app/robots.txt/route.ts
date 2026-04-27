import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { config } from '@/config/config';

async function getBaseUrl() {
  // Ưu tiên lấy từ config
  if (config.APP_URL) {
    return config.APP_URL;
  }
  
  // Lấy từ headers nếu đang chạy local
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  
  if (host) {
    return `${protocol}://${host}`;
  }
  
  // Fallback
  return 'https://vincens.vn';
}

export async function GET() {
  const baseUrl = await getBaseUrl();
  
  const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/pagesitemap.xml
Sitemap: ${baseUrl}/postsitemap.xml
Sitemap: ${baseUrl}/productsitemap.xml

# Disallow admin pages
Disallow: /admin/
Disallow: /api/

# Allow public assets
Allow: /images/
Allow: /img/
Allow: /video/
`;

  return new NextResponse(robots, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

