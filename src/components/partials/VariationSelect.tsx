"use client";
import React, { memo } from "react";

interface VariationSelectProps {
  variations: { id: string; name: string; price: number }[];
  selectedVariation?: string;
  onSelect: (id: string) => void;
}

const VariationSelectComponent: React.FC<VariationSelectProps> = ({
  variations,
  selectedVariation,
  onSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {variations.map((v) => (
        <button
          key={v.id}
          onClick={() => onSelect(v.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
            selectedVariation === v.id
              ? "bg-purple-600 text-white border-purple-600"
              : "border-gray-300 hover:border-purple-400"
          }`}
        >
          {v.name} — ₦{v.price.toLocaleString()}
        </button>
      ))}
    </div>
  );
};

export const VariationSelect = memo(VariationSelectComponent);
