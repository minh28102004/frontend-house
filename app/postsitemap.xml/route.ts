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
    // Lấy tất cả danh mục bài viết
    const categoriesResponse = await fetch(
      `${API_URL_CLIENT}/api/category-postsapi?limit=0`,
      { next: { revalidate: 3600 } }
    );
    const categoriesData = categoriesResponse.ok ? await categoriesResponse.json() : { data: [] };
    const categories = categoriesData.data || [];

    // Lấy tất cả bài viết (visible và published)
    // Lấy nhiều trang để có đủ bài viết
    let allPosts: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 50) { // Giới hạn 50 trang để tránh vòng lặp vô hạn
      const postsResponse = await fetch(
        `${API_URL_CLIENT}/api/postsapi?page=${page}&limit=100&includeHidden=false`,
        { next: { revalidate: 3600 } }
      );
      
      if (!postsResponse.ok) break;
      
      const postsData = await postsResponse.json();
      const posts = postsData.data || [];
      
      if (posts.length === 0) {
        hasMore = false;
      } else {
        allPosts = [...allPosts, ...posts];
        page++;
        
        // Nếu không còn trang tiếp theo
        if (postsData.totalPages && page > postsData.totalPages) {
          hasMore = false;
        }
      }
    }
    
    const posts = allPosts;

    const lastmod = new Date().toISOString();

    // Hàm helper để lấy tất cả danh mục từ cây danh mục
    const getAllCategories = (cats: any[]): any[] => {
      const result: any[] = [];
      const traverse = (items: any[]) => {
        items.forEach((item: any) => {
          if (item.slug && !item.isDeleted) {
            result.push(item);
          }
          if (item.children && Array.isArray(item.children)) {
            traverse(item.children);
          }
        });
      };
      traverse(cats);
      return result;
    };

    // Tạo URL cho danh mục bài viết (bao gồm cả danh mục con)
    const allCategories = getAllCategories(categories);
    const categoryUrls = allCategories.map((cat: any) => ({
      url: `/posts/danh-muc/${cat.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: cat.updatedAt || cat.createdAt || lastmod,
    }));

    // Tạo URL cho bài viết
    const postUrls = posts
      .filter((post: any) => post.slug && post.isVisible && !post.isDeleted)
      .map((post: any) => ({
        url: `/posts/${post.slug}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: post.updatedAt || post.createdAt || lastmod,
      }));

    const allUrls = [
      { url: '/posts', priority: '0.9', changefreq: 'daily', lastmod },
      { url: '/posts/danh-muc', priority: '0.8', changefreq: 'weekly', lastmod },
      ...categoryUrls,
      ...postUrls,
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
    console.error('Error generating posts sitemap:', error);
    
    // Fallback sitemap với các trang cơ bản
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/posts</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/posts/danh-muc</loc>
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

