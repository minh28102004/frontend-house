import React from "react";
import EditProduct from "@/modules/admin/products/components/EditProduct";

export default async function CreateProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const {slug} = await params;

  return <EditProduct slug={slug} />
};

