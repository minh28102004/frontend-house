"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { App } from "antd";
import { AdminPageHeader } from "@/modules/admin/common/components/AdminUi";
import { useProducts } from "../hooks/useProducts";
import { Product } from "../models/product.model";
import { ProductForm } from "./ProductForm";

const CreateProduct = () => {
  const router = useRouter();
  const { createProduct } = useProducts();
  const { message } = App.useApp();

  const handleSubmit = async (productData: Partial<Product>) => {
    await createProduct(productData);
    router.push("/admin/products/edit/" + productData.slug);
    message.success("Tạo sản phẩm thành công.");
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader title="Thêm sản phẩm" description="Tạo mới dịch vụ/tiện ích trong hệ thống." />
      <ProductForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CreateProduct;

