export interface HostVietQrConfig {
  bankBin: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  template?: 'compact' | 'compact2' | 'qr_only';
  isActive: boolean;
}

export interface HostQrSettings {
  vietQr: HostVietQrConfig;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
}
