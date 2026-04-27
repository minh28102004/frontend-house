export interface HostSeoSettings {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
  facebookPixel?: string;
  googleTagManager?: string;
  storeName?: string;
  storeDescription?: string;
  storeLogo?: string;
  storeFavicon?: string;
  googleAnalyticsId?: string;
  robotsTxt?: string;
  canonicalUrl?: string;
}

export interface HostSeoUpdateDto extends Partial<HostSeoSettings> {}
