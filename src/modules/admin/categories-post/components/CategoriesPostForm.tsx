"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  CreateCategoryPostDto,
  UpdateCategoryPostDto,
  CategoryPostTree,
} from "../models/categories-post.model";
import {
  useCategoryPostTree,
  useCategoryPosts,
} from "../hooks/useCategoriesPost";
import { useRouter } from "next/navigation";

type Props = {
  slug?: string;
  onSuccess?: () => void;
};

const CategoriesPostForm: React.FC<Props> = ({ slug, onSuccess }) => {
  const isEditMode = !!slug;
  const router = useRouter();

  const { data: currentCategory } = useCategoryPostTree(slug || "");
  const { createMutation, updateMutation, categories } = useCategoryPosts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateCategoryPostDto>({
    defaultValues: {
      name: "",
      parent: "",
      description: "",
    },
  });

  // Gán giá trị khi edit sau khi có currentCategory
  useEffect(() => {
    if (isEditMode && currentCategory) {
      reset({
        name: currentCategory.name,
        parent: currentCategory.parent || "",
        description: currentCategory.description || "",
      });
    }
  }, [currentCategory, isEditMode, reset]);

  const onSubmit = async (formData: CreateCategoryPostDto) => {
    try {
      // Xử lý giá trị parent: chuyển chuỗi rỗng thành null
      const parentValue =
        formData.parent?.trim() === "" ? null : formData.parent;

      if (isEditMode && currentCategory) {
        if (!formData.name?.trim()) {
          alert("⚠️ Tên danh mục không được để trống.");
          return;
        }

        const updatedFields: UpdateCategoryPostDto = {
          name: formData.name.trim(),
        };

        // Luôn gửi giá trị parent rõ ràng, không dùng undefined
        updatedFields.parent = parentValue ?? undefined;

        // Thêm description vào updatedFields
        const descriptionValue = formData.description?.trim() || undefined;
        updatedFields.description = descriptionValue;

        // Nếu không có gì thay đổi thì không gửi lên
        const currentDescription = currentCategory.description || "";
        const newDescription = descriptionValue || "";
        if (
          updatedFields.name === currentCategory.name &&
          ((updatedFields.parent === null && !currentCategory.parent) ||
            updatedFields.parent === currentCategory.parent) &&
          newDescription === currentDescription
        ) {
          alert("⚠️ Không có thay đổi nào.");
          return;
        }

        await updateMutation.mutateAsync({ slug: slug!, data: updatedFields });
        alert("Cập nhật thành công!");
      } else {
        if (!formData.name?.trim()) {
          alert("⚠️ Tên danh mục không được để trống.");
          return;
        }

        await createMutation.mutateAsync({
          name: formData.name.trim(),
          parent: parentValue ?? undefined,
          description: formData.description?.trim() || undefined,
        });
        alert("Tạo mới thành công!");
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra.");
    }
  };

  // Danh mục cha dạng cây (loại chính nó)
  const parentOptions = useMemo(() => {
    if (!categories?.length) return [];

    const flattenCategories = (
      categories: CategoryPostTree[]
    ): CategoryPostTree[] => {
      return categories.reduce((acc: CategoryPostTree[], category) => {
        acc.push(category);
        if (category.children?.length) {
          acc.push(...flattenCategories(category.children));
        }
        return acc;
      }, []);
    };

    const flatCategories = flattenCategories(categories);

    return flatCategories
      .filter((cat) => cat._id !== currentCategory?._id)
      .map((cat) => ({
        value: cat._id,
        label: `${"— ".repeat(cat.level)}${cat.name}`,
      }));
  }, [categories, currentCategory]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
      <h2 className="text-2xl font-bold text-gray-800">
        {isEditMode ? "Cập nhật danh mục" : "Thêm danh mục mới"}
      </h2>

      {/* Tên danh mục */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên danh mục <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name", { required: true })}
          type="text"
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="VD: Trang Trí Nhà Cửa"
        />
      </div>
      {/* Mô tả */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea {...register("description")} rows={3} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="VD: Danh mục này chứa các bài viết về trang trí nhà cửa" />
      </div>

      {/* Danh mục cha */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Danh mục cha
        </label>
        <select
          {...register("parent")}
          className="w-full px-3 py-2 border rounded bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="">— Không chọn —</option>
          {parentOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Nút hành động */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.push("/admin/categories-posts")}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Huỷ
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isEditMode ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
};

export default CategoriesPostForm;
