"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";

const SearchHome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Tự động chuyển trang khi gõ (debounced)
  useEffect(() => {
    const trimmed = searchTerm.trim();

    if (!trimmed) {
      return;
    }

    const handler = setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }, 500); // Debounce 500ms

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    router.push('/search');
  };

  return (
    <div className="w-full md:hidden px-4 pt-15 pb-2">
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full h-11 border border-gray-300 rounded-full py-3 pl-12 pr-12 text-base outline-none focus:border-black transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoSearchOutline size={20} />
          </button>
          {searchTerm && (
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={clearSearch}
            >
              <IoCloseOutline size={20} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchHome