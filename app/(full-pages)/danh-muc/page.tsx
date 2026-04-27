import ProductListMobileSection from "@/modules/client/product/ProductListMobileSection";
import ProductListPCSection from "@/modules/client/product/ProductListPCSection";

interface DanhMucParams {
  params: Promise<{
    slug?: string;
  }>;
}

export default async function DanhMucSanPham({ params }: DanhMucParams) {
  const { slug } = await params;
  const safeSlug = slug ?? "";

  return (
    <div>
      <div className="hidden md:block">
        <ProductListPCSection slug={safeSlug} />
      </div>
      <div className="block md:hidden">
        <ProductListMobileSection slug={safeSlug} />
      </div>
    </div>
  );
}
