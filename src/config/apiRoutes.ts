// /src/config/apiRoutes.ts
// Browser: calls same origin (/api/...) so Next.js rewrite proxy forwards to backend → avoids CORS.
// Server (SSR, route handlers): calls backend directly via NEXT_PUBLIC_API_URL.
export const API_URL_CLIENT =
  typeof window !== 'undefined'
    ? ''
    : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080');

export const API_URL_FALLBACK = 'http://localhost:8080';

export const apiRoutes = {
    AUTH: {
        BASE: '/api/authapi',
        CHECK_EMAIL: '/api/authapi/check-email',
        REGISTER: '/api/authapi/register',
        LOGIN: '/api/authapi/login',
        LOGOUT: '/api/authapi/logout',
        VERIFY_TOKEN: (token: string) => `/api/authapi/verify-token/${token}`,
        ME: '/api/authapi/me',
        USERS: '/api/authapi/users',
        UPDATE: '/api/authapi/update',
        GOOGLE: '/api/authapi/google',
        GOOGLE_REDIRECT: '/api/authapi/google/redirect',
        REQUEST_PASSWORD_RESET: '/api/authapi/request-password-reset',
        VERIFY_OTP: '/api/authapi/verify-otp',
        RESET_PASSWORD_WITH_TOKEN: '/api/authapi/reset-password/token',
        RESET_PASSWORD_WITH_OTP: '/api/authapi/reset-password/otp',
    },
    VIDEOS: {
        BASE: '/api/videosapi',
        GET_ALL: '/api/videosapi',
        UPLOAD: '/api/videosapi/upload',
        UPLOAD_MULTIPLE: '/api/videosapi/upload-multiple',
        DELETE: (slug: string) => `/api/videosapi/${slug}`,
    },
    IMAGES: {
        BASE: '/api/imagesapi',
        GET_ALL: '/api/imagesapi',
        // Upload 1 ảnh (field: file)
        UPLOAD: '/api/imagesapi/upload',
        // Upload nhiều ảnh (field: files)
        UPLOAD_MULTIPLE: '/api/imagesapi/upload-multiple',
        // Upload ảnh cho SunEditor (field: file)
        UPLOAD_SUNEDITOR: '/api/imagesapi/sunEditor',
        // Xóa ảnh theo slug
        DELETE: (slug: string) => `/api/imagesapi/${slug}`,
    },
    BANNERS: {
        BASE: '/api/bannersapi',
        CREATE: '/api/bannersapi',
        GET_ALL: '/api/bannersapi',
        GET_ACTIVE_BY_TYPE: (type: string) => `/api/bannersapi/active/${type}`,
        GET_BY_ID: (id: string) => `/api/bannersapi/${id}`,
        UPDATE: (id: string) => `/api/bannersapi/${id}`,
        UPDATE_ORDER: (id: string) => `/api/bannersapi/${id}/order`,
        TOGGLE_ACTIVE: (id: string) => `/api/bannersapi/${id}/toggle-active`,
        DELETE: (id: string) => `/api/bannersapi/${id}`,
    },
    USERS: {
        BASE: '/api/users',
        GET_ME: '/api/users/me',
        UPDATE_ME: '/api/users/me',
        GET_ALL: '/api/users',
        GET_BY_ID: (id: string) => `/api/users/${id}`,
        CREATE: '/api/users',
        UPDATE: (id: string) => `/api/users/${id}`,
        DELETE: (id: string) => `/api/users/${id}`,
    },
    VERIFY: {
        BASE: '/api/verify',
        SEND_VERIFICATION_EMAIL: '/api/verify/send',
        VERIFY_EMAIL: '/api/verify/verify-email',
    },
    PRODUCTS: {
        BASE: '/api/productsapi',
        CREATE: '/api/productsapi',
        GET_ALL: (page: number = 1) => `/api/productsapi?page=${page}`,
        GET_ALL_BASIC_INFO: (page: number = 1) => `/api/productsapi/basic-info?page=${page}`,
        SEARCH: (q: string, page: number = 1) =>
            `/api/productsapi/search?q=${encodeURIComponent(q)}&page=${page}`,
        GET_BY_SLUG: (slug: string) => `/api/productsapi/${slug}`,
        UPDATE: (slug: string) => `/api/productsapi/${slug}`,
        DELETE: (slug: string) => `/api/productsapi/${slug}`,
        /** Host: chỉ sản phẩm của seller (JWT role host) */
        HOST_ME: '/api/productsapi/host/me',
        HOST_ME_BY_SLUG: (slug: string) =>
            `/api/productsapi/host/me/${encodeURIComponent(slug)}`,
    },
    POSTS: {
        BASE: '/api/postsapi',
        CREATE: '/api/postsapi',
        GET_ALL: '/api/postsapi',
        GET_MY_POSTS: (userId: string, page: number = 1, limit: number = 10) =>
            `/api/postsapi/my-posts?userId=${userId}&page=${page}&limit=${limit}`,
        GET_BY_STATUS: (status: string, page: number = 1, limit: number = 10, includeHidden: boolean = false) =>
            `/api/postsapi/by-status/${status}?page=${page}&limit=${limit}&includeHidden=${includeHidden}`,
        GET_BY_SLUG: (slug: string, includeHidden: boolean = false) =>
            `/api/postsapi/${slug}?includeHidden=${includeHidden}`,
        UPDATE: (slug: string) => `/api/postsapi/${slug}`,
        UPDATE_SLUG: (slug: string) => `/api/postsapi/${slug}/update-slug`,
        UPDATE_VISIBILITY: (slug: string) => `/api/postsapi/${slug}/visibility`,
        UPDATE_STATUS: (slug: string) => `/api/postsapi/${slug}/status`,
        DELETE: (slug: string) => `/api/postsapi/${slug}`,
        HARD_DELETE: (slug: string) => `/api/postsapi/${slug}/force`,
        TRANSFER_ALL: '/api/postsapi/transfer-all',
        TRANSFER_SELECTED: '/api/postsapi/transfer-selected',
    },
    CATEGORIES_POST: {
        BASE: '/api/category-postsapi',
        CREATE: '/api/category-postsapi',
        UPDATE: (slug: string) => `/api/category-postsapi/${slug}`,
        GET_ONE: (slug: string) => `/api/category-postsapi/${slug}`,
        // GET_ALL hỗ trợ phân trang, tìm kiếm, lọc
        GET_ALL: (params?: { page?: number; limit?: number; search?: string }) => {
            let url = '/api/category-postsapi';
            if (params) {
                const searchParams = new URLSearchParams();
                if (params.page !== undefined) searchParams.append('page', String(params.page));
                if (params.limit !== undefined) searchParams.append('limit', String(params.limit));
                if (params.search) searchParams.append('search', params.search);
                const queryString = searchParams.toString();
                if (queryString) url += `?${queryString}`;
            }
            return url;
        },
        SOFT_DELETE: (slug: string) => `/api/category-postsapi/${slug}/soft-delete`,
        DELETE: (slug: string) => `/api/category-postsapi/${slug}`,
    },
    CATEGORIES_PRODUCT: {
        BASE: '/api/categories-productsapi',
        CREATE: '/api/categories-productsapi',
        GET_ALL: '/api/categories-productsapi',
        GET_BY_ID: (id: string) => `/api/categories-productsapi/id/${id}`,
        GET_MAIN: '/api/categories-productsapi/main',
        GET_SUB_BY_PARENT_ID: (parentId: string) => `/api/categories-productsapi/sub/${parentId}`,
        GET_BY_SLUG: (slug: string) => `/api/categories-productsapi/${slug}`,
        UPDATE: (slug: string) => `/api/categories-productsapi/${slug}`,
        DELETE: (slug: string) => `/api/categories-productsapi/${slug}`,
        /** Host: chỉ danh mục của chính host (JWT bắt buộc) */
        HOST_ME: {
            ALL: '/api/categories-productsapi/host/me/all',
            MAIN: '/api/categories-productsapi/host/me/main',
            SUB: (parentId: string) =>
                `/api/categories-productsapi/host/me/sub/${parentId}`,
            BY_ID: (id: string) =>
                `/api/categories-productsapi/host/me/by-id/${id}`,
            BY_SLUG: (slug: string) =>
                `/api/categories-productsapi/host/me/slug/${encodeURIComponent(slug)}`,
        },
    },
    TAGS: {
        BASE: '/api/tagsapi',
        CREATE: '/api/tagsapi',
        GET_ALL: '/api/tagsapi',
        UPDATE: (slug: string) => `/api/tagsapi/${slug}`,
        DELETE: (slug: string) => `/api/tagsapi/${slug}`,
    },
    MAPS: {
        BASE: '/api/mapsapi',
        GET_ALL: (page: number = 1, limit: number = 10, isActive?: boolean) => {
            let url = '/api/mapsapi';
            const params = new URLSearchParams();
            params.append('page', String(page));
            params.append('limit', String(limit));
            if (isActive !== undefined) params.append('isActive', String(isActive));
            return `${url}?${params.toString()}`;
        },
        GET_ACTIVE: '/api/mapsapi/active',
        GET_BY_ID: (id: string) => `/api/mapsapi/${id}`,
        UPDATE: (id: string) => `/api/mapsapi/${id}`,
        DELETE: (id: string) => `/api/mapsapi/${id}`,
    },
    CART: {
        BASE: '/api/cartapi',
        GET: '/api/cartapi',
        ADD: '/api/cartapi/add',
        UPDATE_ITEM: '/api/cartapi/update-item',
        REMOVE: (productId: string) => `/api/cartapi/remove/${productId}`,
        UPDATE: '/api/cartapi',
        CLEAR: '/api/cartapi/clear',
    },
    FLASH_SALE: {
        BASE: '/api/flash-saleapi',
        CREATE: '/api/flash-saleapi',
        GET_ALL: (page: number = 1, limit: number = 12, isActive?: boolean) => {
            let url = '/api/flash-saleapi';
            const params = new URLSearchParams();
            params.append('page', String(page));
            params.append('limit', String(limit));
            if (isActive !== undefined) params.append('isActive', String(isActive));
            return `${url}?${params.toString()}`;
        },
        GET_ACTIVE: '/api/flash-saleapi/active',
        GET_BY_SLUG: (slug: string) => `/api/flash-saleapi/${slug}`,
        UPDATE: (slug: string) => `/api/flash-saleapi/${slug}`,
        DELETE: (slug: string) => `/api/flash-saleapi/${slug}`,
    },
    SEND_EMAIL: {
        SEND: '/api/mail/send-email'
    },
    ORDERS: {
        BASE: '/api/ordersapi',
        CREATE: '/api/ordersapi',
        GET_ALL: (page: number = 1, limit: number = 20) => `/api/ordersapi?page=${page}&limit=${limit}`,
        GET_BY_ID: (id: string) => `/api/ordersapi/${id}`,
        MY: '/api/ordersapi/me',
        LOOKUP: '/api/ordersapi/lookup',
    },
    CONTACT: {
        BASE: '/api/contactsapi',
        CREATE: '/api/contactsapi',
        GET_ALL: (section?: string, isActive?: boolean) => {
            let url = '/api/contactsapi';
            const params = new URLSearchParams();
            if (section) params.append('section', section);
            if (isActive !== undefined) params.append('isActive', String(isActive));
            const queryString = params.toString();
            if (queryString) url += `?${queryString}`;
            return url;
        },
        GET_BY_SECTION: (section: string) => `/api/contactsapi/section/${section}`,
        GET_BY_ID: (id: string) => `/api/contactsapi/${id}`,
        UPDATE: (id: string) => `/api/contactsapi/${id}`,
        UPDATE_ORDER: (id: string) => `/api/contactsapi/${id}/order`,
        TOGGLE_ACTIVE: (id: string) => `/api/contactsapi/${id}/toggle-active`,
        DELETE: (id: string) => `/api/contactsapi/${id}`,
        BULK_UPDATE: '/api/contactsapi/bulk',
    },
    ROOMS: {
        BASE: '/api/roomsapi',
        // Room APIs
        CREATE: '/api/roomsapi',
        GET_ALL: '/api/roomsapi',
        GET_ALL_ADMIN: (page: number = 1, limit: number = 10) => `/api/roomsapi/admin/list?page=${page}&limit=${limit}`,
        GET_ALL_HOST: (page: number = 1, limit: number = 100) => `/api/roomsapi/host/list?page=${page}&limit=${limit}`,
        GET_BY_CONCEPT: (concept: string) => `/api/roomsapi/${concept}`,
        UPDATE: (concept: string) => `/api/roomsapi/${concept}`,
        TOGGLE_VISIBILITY: (concept: string) => `/api/roomsapi/${concept}/visibility`,
        DELETE: (concept: string) => `/api/roomsapi/${concept}`,
        // Booking APIs
        CREATE_BOOKING: '/api/roomsapi/bookings',
        /** JWT: booking confirmed, đang trong kỳ ở (theo email tài khoản) */
        MY_CURRENT_STAY: '/api/roomsapi/bookings/me/current-stay',
        CHECK_AVAILABILITY: '/api/roomsapi/check-availability',
        GET_BOOKINGS_ADMIN: (params?: {
            page?: number;
            limit?: number;
            concept?: string;
            status?: string;
            guestEmail?: string;
            checkInDate?: string;
            checkOutDate?: string;
        }) => {
            let url = '/api/roomsapi/bookings/admin/list';
            const searchParams = new URLSearchParams();
            if (params) {
                if (params.page !== undefined) searchParams.append('page', String(params.page));
                if (params.limit !== undefined) searchParams.append('limit', String(params.limit));
                if (params.concept) searchParams.append('concept', params.concept);
                if (params.status) searchParams.append('status', params.status);
                if (params.guestEmail) searchParams.append('guestEmail', params.guestEmail);
                if (params.checkInDate) searchParams.append('checkInDate', params.checkInDate);
                if (params.checkOutDate) searchParams.append('checkOutDate', params.checkOutDate);
            }
            const queryString = searchParams.toString();
            if (queryString) url += `?${queryString}`;
            return url;
        },
        GET_BOOKING_BY_ID: (id: string) => `/api/roomsapi/bookings/${id}`,
        UPDATE_BOOKING: (id: string) => `/api/roomsapi/bookings/${id}`,
        DELETE_BOOKING: (id: string) => `/api/roomsapi/bookings/${id}`,
        GET_BOOKINGS_BY_DATE_RANGE: (concept: string, startDate: string, endDate: string) =>
            `/api/roomsapi/bookings/room/${concept}/range?startDate=${startDate}&endDate=${endDate}`,
        GET_ACTIVE_ROOMS: '/api/roomsapi/active-rooms',
        /** JWT: lấy tất cả booking của user đăng nhập */
        MY_BOOKINGS: '/api/roomsapi/bookings/me',
    },
    /** Chat khách đang ở phòng ↔ admin */
    ROOM_CHAT: {
        GUEST_MESSAGES: (bookingId: string) =>
            `/api/roomchatapi/guest/messages?bookingId=${encodeURIComponent(bookingId)}`,
        GUEST_POST: '/api/roomchatapi/guest/messages',
        GUEST_READ: '/api/roomchatapi/guest/read',
        ADMIN_THREADS: '/api/roomchatapi/admin/threads',
        ADMIN_MESSAGES: (threadId: string) =>
            `/api/roomchatapi/admin/threads/${encodeURIComponent(threadId)}/messages`,
        ADMIN_POST: (threadId: string) =>
            `/api/roomchatapi/admin/threads/${encodeURIComponent(threadId)}/messages`,
        ADMIN_READ: (threadId: string) =>
            `/api/roomchatapi/admin/threads/${encodeURIComponent(threadId)}/read`,
    },
    PAYMENTS: {
        CREATE: '/api/payments/create',
        TRANSACTION: (transactionId: string) => `/api/payments/transaction/${transactionId}`,
    },
    SETTINGS: {
        BASE: '/api/settings',
        GET_ALL: '/api/settings',
        GET_BY_CATEGORY: (category: string) => `/api/settings?category=${category}`,
        GET_BY_KEY: (key: string) => `/api/settings/keys/${key}`,
        GET_BY_KEYS: (keys: string) => `/api/settings/keys?keys=${keys}`,
        UPDATE: (key: string) => `/api/settings/keys/${key}`,
        BULK_UPDATE: '/api/settings/bulk',
        DELETE: (key: string) => `/api/settings/keys/${key}`,
        INIT: '/api/settings/init',
    },
    POINTS: {
        BASE: '/api/pointsapi',
        ME: '/api/pointsapi/me',
        RANKS: '/api/pointsapi/ranks',
        EARN: '/api/pointsapi/earn',
        SPEND: '/api/pointsapi/spend',
        ADJUST: '/api/pointsapi/adjust',
        EXCHANGE: '/api/pointsapi/exchange',
        EXCHANGE_COUPONS: '/api/pointsapi/exchange-coupons',
        MY_COUPONS: '/api/pointsapi/my-coupons',
    },
    CHATBOT: {
        CONFIG: '/api/chatbotapi/config',
        CHAT: '/api/chatbotapi/chat',
        ITEMS: '/api/chatbotapi/items',
        ITEMS_ACTIVE: '/api/chatbotapi/items/active',
        ITEM: (id: string) => `/api/chatbotapi/items/${id}`,
        ITEM_TOGGLE: (id: string) => `/api/chatbotapi/items/${id}/toggle`,
        ROOMS: '/api/chatbotapi/rooms',
        QUICK_REPLIES: '/api/chatbotapi/quick-replies',
        SETTINGS: '/api/chatbotapi/settings',
        STATS: '/api/chatbotapi/stats',
    },
};

// For backward compatibility
export const API_ROUTES = apiRoutes;
