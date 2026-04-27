"use client";
import type { FC } from "react";

type Props = {
  tags?: string[];
};

const fallbackTags = ["Tin tức", "Hướng dẫn", "Kiến thức", "Mẹo hay"];

const TagList: FC<Props> = ({ tags }) => (
  <div className="bg-gray-50 p-6 rounded-xl">
    <h3 className="text-xl font-bold mb-4">Thẻ</h3>
    <div className="flex flex-wrap gap-2">
      {(tags && tags.length > 0 ? tags : fallbackTags).map((tag) => (
        <span
          key={tag}
          className="bg-white px-3 py-1 rounded-full text-sm shadow"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default TagList;