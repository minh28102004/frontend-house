"use client";

import React, { useEffect, useState } from "react";
import { AdminSearchGroup } from "@/modules/admin/common/components/AdminUi";

interface SearchProductsProps {
  onSearch: (searchTerm: string) => void;
  isSearching?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

const SearchProducts = ({
  onSearch = () => {},
  isSearching = false,
  placeholder = "Nhap ten bai viet can tim...",
  defaultValue = "",
}: SearchProductsProps) => {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [debouncedTerm, setDebouncedTerm] = useState(defaultValue);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    onSearch(debouncedTerm);
  }, [debouncedTerm, onSearch]);

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
