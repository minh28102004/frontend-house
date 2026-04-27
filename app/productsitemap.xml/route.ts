import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { config } from '@/config/config';
import { API_URL_CLIENT } from '@/config/apiRoutes';

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
  
  try {
    // Lấy tất cả danh mục sản phẩm
    const categoriesResponse = await fetch(
      `${API_URL_CLIENT}/api/categories-productsapi`,
      { next: { revalidate: 3600 } }
    );
    const categories = categoriesResponse.ok ? await categoriesResponse.json() : [];

    // Lấy tất cả sản phẩm (visible)
    // Lấy nhiều trang để có đủ sản phẩm
    let allProducts: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 50) { // Giới hạn 50 trang để tránh vòng lặp vô hạn
      const productsResponse = await fetch(
        `${API_URL_CLIENT}/api/productsapi?page=${page}`,
        { next: { revalidate: 3600 } }
      );
      
      if (!productsResponse.ok) break;
      
      const productsData = await productsResponse.json();
      const products = productsData.data || [];
      
      if (products.length === 0) {
        hasMore = false;
      } else {
        allProducts = [...allProducts, ...products];
        page++;
        
        // Nếu không còn trang tiếp theo
        if (productsData.totalPages && page > productsData.totalPages) {
          hasMore = false;
        }
      }
    }

    const lastmod = new Date().toISOString();

    // Tạo URL cho tất cả danh mục sản phẩm đang active (không giới hạn level)
    const categoryUrls = categories
      .filter((cat: any) => cat.slug && cat.isActive)
      .map((cat: any) => ({
        url: `/danh-muc/${cat.slug}`,
        priority: '0.8',
        changefreq: 'weekly',
      }));

    // Tạo URL cho sản phẩm
    const productUrls = allProducts
      .filter((product: any) => product.slug && product.isVisible)
      .map((product: any) => ({
        url: `/san-pham/${product.slug}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: product.updatedAt || product.createdAt || lastmod,
      }));

    const allUrls = [
      { url: '/san-pham', priority: '0.9', changefreq: 'daily' },
      { url: '/danh-muc', priority: '0.8', changefreq: 'weekly' },
      ...categoryUrls,
      ...productUrls,
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (item) => `  <url>
    <loc>${baseUrl}${item.url}</loc>
    <lastmod>${item.lastmod || lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
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
  } catch (error) {
    console.error('Error generating products sitemap:', error);
    
    // Fallback sitemap với các trang cơ bản
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/san-pham</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/danh-muc</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    return new NextResponse(fallbackSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }
}

