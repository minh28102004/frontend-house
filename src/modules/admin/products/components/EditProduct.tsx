"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { App, Spin } from "antd";
import { AdminPageHeader } from "@/modules/admin/common/components/AdminUi";
import { useProducts } from "../hooks/useProducts";
import { Product } from "../models/product.model";
import { ProductForm } from "./ProductForm";

const EditProduct = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const { productDetail, getProductBySlug, updateProduct } = useProducts();
  const { message } = App.useApp();

  useEffect(() => {
    if (slug) {
      getProductBySlug(slug);
    }
  }, [slug, getProductBySlug]);

  const handleSubmit = async (productData: Partial<Product>) => {
    if (!productDetail) return;
    await updateProduct(slug, productData);
    message.success("Cập nhật sản phẩm thành công.");
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  if (!productDetail) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spin />
      </div>
    );
  }

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        title="Chỉnh sửa sản phẩm"
        description="Cập nhật thông tin, giá, hiển thị và danh mục."
      />
      <ProductForm
        mode="edit"
        initialData={productDetail}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditProduct;

