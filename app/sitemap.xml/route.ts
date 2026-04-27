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
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/pagesitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/postsitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/productsitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

