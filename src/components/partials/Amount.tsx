"use client";
import React, { memo } from "react";

interface AmountProps {
  value: string;
  onChange: (value: string) => void;
  minAmount?: string;
  maxAmount?: string;
}

function Amount({ value, onChange, minAmount, maxAmount }: AmountProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold">Amount</label>

      <TextInput
        value={value}
        onChange={onChange}
        placeholder="Enter amount"
        type="number"
        currency="₦"
      // min={minAmount}
      // max={maxAmount}
      />

      {(minAmount || maxAmount) && (
        <p className="text-xs text-zinc-500">
          Amount range:
          {formatToNGN(Number(minAmount))}
          {" - "}
          {formatToNGN(Number(maxAmount))}
        </p>
      )}
    </div>
  );
}
const AmountComponent: React.FC<AmountProps> = ({
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

export const Amount = memo(AmountComponent);
