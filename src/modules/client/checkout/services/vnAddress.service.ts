export type Province = { code: number; name: string };
export type District = { code: number; name: string };
export type Ward = { code: number; name: string };

const BASE = "https://provinces.open-api.vn/api";

export const VnAddressService = {
  listProvinces: async (): Promise<Province[]> => {
    const res = await fetch(`${BASE}/p/`, { cache: "no-store" });
    if (!res.ok) throw new Error("Không tải được danh sách tỉnh/thành");
    const data = await res.json();
    return (data || []).map((p: any) => ({ code: p.code, name: p.name }));
  },

  listDistrictsByProvince: async (provinceCode: number): Promise<District[]> => {
    const res = await fetch(`${BASE}/p/${provinceCode}?depth=2`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Không tải được danh sách quận/huyện");
    const data = await res.json();
    const districts = data?.districts || [];
    return districts.map((d: any) => ({ code: d.code, name: d.name }));
  },

  listWardsByDistrict: async (districtCode: number): Promise<Ward[]> => {
    const res = await fetch(`${BASE}/d/${districtCode}?depth=2`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Không tải được danh sách phường/xã");
    const data = await res.json();
    const wards = data?.wards || [];
    return wards.map((w: any) => ({ code: w.code, name: w.name }));
  },
};

