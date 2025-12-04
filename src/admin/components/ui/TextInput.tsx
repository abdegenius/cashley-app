"use client";

import React from "react";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  currency?: string;
  disabled?: boolean;
  minLength?: string | number;
  maxLength?: string | number;
}

const TextInput: React.FC<TextInputProps> = ({
  disabled = false,
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  currency,
  minLength,
  maxLength,
}) => {
  return (
    <div className={`w-full flex bg-card rounded-xl p-4 text-md`}>
      {currency && <span>{currency}</span>}
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`placeholder:placeholder-text placeholder:text-[12px] bg-card rounded-xl text-md font-medium px-2 select-none appearance-none outline-none border-none w-full ${className}`}
        min={minLength}
        max={maxLength}
      />
    </div>
  );
};

export default TextInput;
