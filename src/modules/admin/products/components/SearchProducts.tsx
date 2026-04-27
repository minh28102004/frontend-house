"use client";

import React, { useState } from "react";
import { AdminSearchGroup } from "@/modules/admin/common/components/AdminUi";

interface SearchProductsProps {
  onSearch: (searchTerm: string) => void;
  isSearching?: boolean;
  placeholder?: string;
}

const SearchProducts = ({
  onSearch = () => {},
  isSearching = false,
  placeholder = "Nhap ten san pham can tim...",
}: SearchProductsProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AdminSearchGroup
      value={searchTerm}
      onChange={setSearchTerm}
      onSubmit={() => onSearch(searchTerm)}
      onClear={() => setSearchTerm("")}
      placeholder={placeholder}
      disabled={isSearching}
    />
  );
};

export default SearchProducts;
