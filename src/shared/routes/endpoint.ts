/**
 * 🚀 TẬP TRUNG QUẢN LÝ TẤT CẢ ROUTE FRONTEND
 *
 * ⚠️ RULES:
 * 1. Khai báo tất cả route tại đây, không dùng hard-code trực tiếp trong component
 * 2. Không đổi đường dẫn URL public nếu không cần thiết
 * 3. Phân nhóm rõ ràng theo module
 * 4. Đặt tên biến tiếng Anh, route path giữ nguyên theo project
 * 5. TypeScript tự động kiểm tra tính chính xác
 */

export const endpoint = {
  // =============================================
  // 📌 PUBLIC ROUTES
  // =============================================
  public: {
    home: "/",
    about: "/about",
    contact: "/contact",
    maps: "/maps",
    rules: "/rules",
    search: "/search",
  },

  // =============================================
  // 📌 ROOMS / PHÒNG
  // =============================================
  rooms: {
    list: "/rooms",
    detail: (slug: string) => `/rooms/${slug}`,
    booking: "/booking",
    myRoom: "/my-room",
  },

  // =============================================
  // 📌 PRODUCTS / SẢN PHẨM
  // =============================================
  products: {
    list: "/san-pham",
    category: (slug: string) => `/danh-muc/${slug}`,
    detail: (slug: string) => `/chi-tiet-san-pham/${slug}`,
    flashSale: "/flash-sale",
  },

  // =============================================
  // 📌 SERVICES / DỊCH VỤ
  // =============================================
  services: {
    list: "/services",
    detail: (slug: string) => `/services/${slug}`,
  },

  // =============================================
  // 📌 BLOG / POSTS / BÀI VIẾT
  // =============================================
  blog: {
    list: "/posts",
    detail: (slug: string) => `/posts/${slug}`,
  },

  // =============================================
  // 📌 CART / CHECKOUT / ORDER
  // =============================================
  cart: {
    view: "/cart",
    checkout: "/checkout",
    payment: "/payment",
    orderDetail: (id: string | number) => `/order/${id}`,
  },

  // =============================================
  // 📌 USER / ACCOUNT / PROFILE
  // =============================================
  account: {
    profile: "/profile",
    orders: "/account/orders",
  },

  // =============================================
  // 📌 AUTH / XÁC THỰC
  // =============================================
  auth: {
    signin: "/signin",
    signup: "/signup",
    forgotPassword: "/forgot-password",
  },

  // =============================================
  // 📌 ADMIN AREA
  // =============================================
  admin: {
    dashboard: "/admin",

    // Products & Categories
    products: "/admin/products",
    productCreate: "/admin/products/create",
    productEdit: (id: string | number) => `/admin/products/edit/${id}`,
    categoriesProduct: "/admin/categories-product",

    // Posts & Categories
    posts: "/admin/posts",
    postCreate: "/admin/posts/create",
    postEdit: (id: string | number) => `/admin/posts/edit/${id}`,
    categoriesPost: "/admin/categories-posts",

    // Rooms
    rooms: "/admin/rooms",
    roomCreate: "/admin/rooms/create",
    roomEdit: (id: string | number) => `/admin/rooms/edit/${id}`,

    // Bookings / Orders
    orders: "/admin/orders",
    orderDetail: (id: string | number) => `/admin/orders/${id}`,

    // Management
    banners: "/admin/banners",
    coupons: "/admin/coupons",
    flashSale: "/admin/flash-sale",
    contact: "/admin/contact",
    notifications: "/admin/notifications",
    users: "/admin/users",
    hosts: "/admin/hosts",
    traffic: "/admin/traffic",
    media: "/admin/media",
    settings: "/admin/settings",
    rules: "/admin/rules",
    tags: "/admin/tags",
    provinces: "/admin/provinces",
    chatbot: "/admin/chatbot",
    maps: "/admin/maps",
  },

  // =============================================
  // 📌 HOST AREA
  // =============================================
  host: {
    dashboard: "/host",
    rooms: "/host/rooms",
    banners: "/host/banners",
    content: "/host/content",
    coupons: "/host/coupons",
    media: "/host/media",
    profile: "/host/profile",
    qrcode: "/host/qrcode",
    seo: "/host/seo",
    store: "/host/store",
    traffic: "/host/traffic",
  },

  // =============================================
  // 📌 SEO / SITEMAP
  // =============================================
  seo: {
    sitemap: "/sitemap.xml",
    pageSitemap: "/pagesitemap.xml",
    postSitemap: "/postsitemap.xml",
    productSitemap: "/productsitemap.xml",
    robots: "/robots.txt",
  },

} as const;

// Type helper
export type Endpoint = typeof endpoint;