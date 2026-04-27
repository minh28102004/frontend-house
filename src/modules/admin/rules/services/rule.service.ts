const BASE = '/api/rules';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export interface Rule {
  _id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  sortOrder: number;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRulePayload {
  title: string;
  slug: string;
  content?: string;
  isPublished?: boolean;
  sortOrder?: number;
  language?: string;
}

export interface UpdateRulePayload {
  title?: string;
  content?: string;
  isPublished?: boolean;
  sortOrder?: number;
  language?: string;
}

export const ruleService = {
  // Public - get all published rules
  getAllPublished: async (): Promise<Rule[]> => {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Không thể tải danh sách rules');
    return res.json();
  },

  // Public - get by slug
  getBySlug: async (slug: string): Promise<Rule> => {
    const res = await fetch(`${BASE}/slug/${slug}`);
    if (!res.ok) throw new Error('Không thể tải rule');
    return res.json();
  },

  // Admin - get all rules including unpublished
  getAllAdmin: async (): Promise<Rule[]> => {
    const res = await fetch(`${BASE}/admin`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Không thể tải danh sách rules');
    return res.json();
  },

  getById: async (id: string): Promise<Rule> => {
    const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Không thể tải thông tin rule');
    return res.json();
  },

  create: async (payload: CreateRulePayload): Promise<Rule> => {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Lỗi tạo rule' }));
      throw new Error(err.message || 'Lỗi tạo rule');
    }
    return res.json();
  },

  update: async (id: string, payload: UpdateRulePayload): Promise<Rule> => {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Lỗi cập nhật rule' }));
      throw new Error(err.message || 'Lỗi cập nhật rule');
    }
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Không thể xóa rule');
  },

  reorder: async (ids: string[]): Promise<void> => {
    const res = await fetch(`${BASE}/reorder`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Không thể sắp xếp lại rules');
  },
};
