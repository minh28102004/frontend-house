import api from '@/config/api';
import { API_URL_CLIENT, apiRoutes } from '@/config/apiRoutes';

const API_URL = API_URL_CLIENT + apiRoutes.SETTINGS.BASE;

export interface Setting {
  _id?: string;
  key: string;
  value: string;
  description?: string;
  isActive: boolean;
  type: 'string' | 'number' | 'boolean' | 'json';
  category: 'vnpay' | 'vietqr' | 'general' | 'email' | 'other';
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateSettingDto {
  value?: string;
  description?: string;
  isActive?: boolean;
}

export interface BulkUpdateDto {
  settings: { key: string; value: string }[];
}

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`
});

export const SettingsService = {
  async getAll(): Promise<Setting[]> {
    const response = await api.get(API_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async getByCategory(category: string): Promise<Setting[]> {
    const response = await api.get(`${API_URL}?category=${category}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async getByKey(key: string): Promise<Setting | null> {
    try {
      const response = await api.get(`${API_URL}/keys/${key}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch {
      return null;
    }
  },

  async getByKeys(keys: string[]): Promise<Record<string, string>> {
    const response = await api.get(`${API_URL}/keys?keys=${keys.join(',')}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async update(key: string, data: UpdateSettingDto): Promise<Setting> {
    const response = await api.put(`${API_URL}/keys/${key}`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async bulkUpdate(settings: { key: string; value: string }[]): Promise<Setting[]> {
    const response = await api.patch(`${API_URL}/bulk`, { settings }, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async delete(key: string): Promise<void> {
    await api.delete(`${API_URL}/keys/${key}`, {
      headers: getAuthHeaders(),
    });
  },

  async initialize(): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`${API_URL}/init`, {}, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};

export interface VietQrAccountRow {
  id: string;
  bankBin: string;
  accountNumber: string;
  accountName: string;
}

export interface VietQrSettings {
  accounts: VietQrAccountRow[];
  activeAccountId: string;
}

export interface PaymentSettings {
  vnpay: {
    vnpUrl: string;
    tmnCode: string;
    hashSecret: string;
  };
  vietqr: VietQrSettings;
  paymentExpiryMinutes: string;
}

function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `acc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeVietQrRow(raw: Partial<VietQrAccountRow>): VietQrAccountRow {
  return {
    id: raw.id || newId(),
    bankBin: (raw.bankBin ?? '970422').trim(),
    accountNumber: (raw.accountNumber ?? '').trim(),
    accountName: (raw.accountName ?? '').trim(),
  };
}

export const PaymentSettingsService = {
  async getPaymentSettings(): Promise<PaymentSettings> {
    const keys = [
      'VNP_URL',
      'VNP_TMN_CODE',
      'VNP_HASH_SECRET',
      'VIETQR_ACCOUNTS',
      'VIETQR_BANK_BIN',
      'VIETQR_ACCOUNT_NUMBER',
      'VIETQR_ACCOUNT_NAME',
      'PAYMENT_EXPIRY_MINUTES',
    ];
    const settings = await SettingsService.getByKeys(keys);

    let vietqr: VietQrSettings = { accounts: [], activeAccountId: '' };
    const rawAccounts = settings.VIETQR_ACCOUNTS;
    if (rawAccounts) {
      try {
        const parsed = JSON.parse(rawAccounts) as {
          accounts?: Partial<VietQrAccountRow>[];
          activeAccountId?: string;
        };
        if (parsed && Array.isArray(parsed.accounts)) {
          vietqr = {
            accounts: parsed.accounts.map((a) => normalizeVietQrRow(a)),
            activeAccountId: parsed.activeAccountId?.trim() || '',
          };
        }
      } catch {
        /* ignore */
      }
    }

    if (
      vietqr.accounts.length === 0 &&
      (settings.VIETQR_ACCOUNT_NUMBER?.trim() || settings.VIETQR_BANK_BIN?.trim())
    ) {
      const id = newId();
      vietqr = {
        accounts: [
          {
            id,
            bankBin: settings.VIETQR_BANK_BIN?.trim() || '970422',
            accountNumber: settings.VIETQR_ACCOUNT_NUMBER?.trim() || '',
            accountName: settings.VIETQR_ACCOUNT_NAME?.trim() || '',
          },
        ],
        activeAccountId: id,
      };
    }

    if (vietqr.activeAccountId && !vietqr.accounts.some((a) => a.id === vietqr.activeAccountId)) {
      vietqr.activeAccountId = vietqr.accounts[0]?.id || '';
    }
    if (!vietqr.activeAccountId && vietqr.accounts.length > 0) {
      vietqr.activeAccountId = vietqr.accounts[0].id;
    }

    return {
      vnpay: {
        vnpUrl: settings.VNP_URL || '',
        tmnCode: settings.VNP_TMN_CODE || '',
        hashSecret: settings.VNP_HASH_SECRET || '',
      },
      vietqr,
      paymentExpiryMinutes: settings.PAYMENT_EXPIRY_MINUTES || '15',
    };
  },

  async saveVnpaySettings(vnpay: PaymentSettings['vnpay']): Promise<void> {
    await SettingsService.bulkUpdate([
      { key: 'VNP_URL', value: vnpay.vnpUrl },
      { key: 'VNP_TMN_CODE', value: vnpay.tmnCode },
      { key: 'VNP_HASH_SECRET', value: vnpay.hashSecret },
    ]);
  },

  async saveVietQrSettings(vietqr: VietQrSettings): Promise<void> {
    const accounts = vietqr.accounts
      .map((a) => normalizeVietQrRow(a))
      .filter((a) => a.accountNumber || a.accountName || a.bankBin);

    let activeAccountId = vietqr.activeAccountId;
    if (activeAccountId && !accounts.some((a) => a.id === activeAccountId)) {
      activeAccountId = accounts[0]?.id || '';
    }
    if (!activeAccountId && accounts.length > 0) {
      activeAccountId = accounts[0].id;
    }

    const payload = JSON.stringify({ accounts, activeAccountId });
    const bulk: { key: string; value: string }[] = [{ key: 'VIETQR_ACCOUNTS', value: payload }];

    const active = accounts.find((a) => a.id === activeAccountId);
    if (active?.accountNumber) {
      bulk.push(
        { key: 'VIETQR_BANK_BIN', value: active.bankBin || '970422' },
        { key: 'VIETQR_ACCOUNT_NUMBER', value: active.accountNumber },
        { key: 'VIETQR_ACCOUNT_NAME', value: active.accountName || 'ANOTHER HOUSE' },
      );
    }

    await SettingsService.bulkUpdate(bulk);
  },

  async saveGeneralSettings(paymentExpiryMinutes: string): Promise<void> {
    await SettingsService.bulkUpdate([{ key: 'PAYMENT_EXPIRY_MINUTES', value: paymentExpiryMinutes }]);
  },

  /** Lưu toàn bộ (VNPay + VietQR + chung) — dùng khi cần đồng bộ một lần */
  async savePaymentSettings(data: PaymentSettings): Promise<void> {
    await this.saveVnpaySettings(data.vnpay);
    await this.saveVietQrSettings(data.vietqr);
    await this.saveGeneralSettings(data.paymentExpiryMinutes);
  },
};

export function createEmptyVietQrAccount(): VietQrAccountRow {
  return {
    id: newId(),
    bankBin: '970422',
    accountNumber: '',
    accountName: '',
  };
}
