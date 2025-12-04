import React from "react";
import Link from "next/link";

interface ButtonProps {
  type?:
    | "primary"
    | "secondary"
    | undefined;
  width?: string;
  text?: string;
  children?: React.ReactNode;
  onclick?: React.MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  variant?: "button" | "submit" | "reset" | undefined;
}

export default function Button({
  type,
  width = "w-full",
  text,
  onclick,
  children,
  loading,
  disabled = false,
  href,
  variant,
}: ButtonProps): React.JSX.Element {
  const buttonClasses = `
    ${width} 
    ${type === "primary" ? "bg-stone-400" : type === "secondary" ? "bg-tansaparent" : "bg-blue-700"} 
    cursor-pointer
    py-3 
    rounded-3xl  
    font-bold 
    text-lg 
    relative 
    ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
  `
    .replace(/\s+/g, " ")
    .trim();

  if (href && !disabled && !loading) {
    return (
      <Link href={href} className={`${buttonClasses} text-center`}>
        {text || children}
      </Link>
    );
  }

  return (
    <button
      type={variant}
      onClick={onclick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {text || children}
      {(loading || disabled) && (
        <span className="absolute top-0 w-full bg-black/50 rounded-3xl left-0 h-full flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </span>
      )}
    </button>
  );
}
