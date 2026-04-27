import DetailCategoriesProduct from "@/modules/admin/categories-product/pages/DetailCategoriesProduct";

export default async function DetailCategoriesProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <DetailCategoriesProduct slug={slug} />
  );
}
