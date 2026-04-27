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
  
  // Danh sách các trang web đang có
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/maps', priority: '0.7', changefreq: 'monthly' },
    { url: '/search', priority: '0.9', changefreq: 'daily' },
    { url: '/posts', priority: '0.9', changefreq: 'daily' },
    { url: '/san-pham', priority: '0.9', changefreq: 'daily' },
    { url: '/danh-muc', priority: '0.8', changefreq: 'weekly' },
  ];

  const lastmod = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

