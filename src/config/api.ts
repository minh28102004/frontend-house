// /src/config/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
export { API_URL };

export const API_HEADERS = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

export const getAuthHeaders = (token?: string | null) => {
    const headers: Record<string, string> = { ...API_HEADERS };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const buildApiUrl = (endpoint: string): string => {
    return `${API_URL}${endpoint}`;
};

export const API_TIMEOUT = 10000;

// Client-side axios instance — no baseURL, services provide full relative path.
export const api = axios.create({
    headers: API_HEADERS,
    timeout: API_TIMEOUT,
});

// Server-side axios instance — uses backend URL directly (for SSR/route handlers).
export const apiServer = axios.create({
    baseURL: API_URL,
    headers: API_HEADERS,
    timeout: API_TIMEOUT,
});

export default api;
