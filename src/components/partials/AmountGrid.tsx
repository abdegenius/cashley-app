"use client";
import React, { memo } from "react";

interface AmountGridProps {
  amounts: number[];
  selectedAmount?: number;
  onSelect: (amount: number) => void;
}

const AmountGridComponent: React.FC<AmountGridProps> = ({
  amounts,
  selectedAmount,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {amounts.map((amt) => (
        <button
          key={amt}
          onClick={() => onSelect(amt)}
          className={`py-3 rounded-xl font-semibold transition-all border ${
            selectedAmount === amt
              ? "bg-purple-600 text-white border-purple-600"
              : "border-gray-300 hover:border-purple-400"
          }`}
        >
          ₦{amt.toLocaleString()}
        </button>
      ))}
    </div>
  );
};

export const AmountGrid = memo(AmountGridComponent);
