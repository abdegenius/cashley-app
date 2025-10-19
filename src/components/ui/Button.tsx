import React, { MouseEventHandler } from "react";

export default function Button({
  type,
  width = "w-full",
  text,
  onclick,
  children,
  loading,
}: {
  type?: "primary" | "secondary" | "blue" | "orange" | "purple" | undefined;
  width?: string | undefined;
  text?: string | undefined;
  children?: string | undefined;
  onclick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  loading?: boolean;
}): React.JSX.Element {
  return (
    <button
      onClick={onclick}
      disabled={loading}
      className={`${width} ${
        type === "primary"
          ? "primary-purple-to-blue"
          : type === "secondary"
          ? "primary-orange-to-purple"
          : type === "blue"
          ? "bg-blue"
          : type === "orange"
          ? "bg-orange"
          : "bg-purple"
      } py-3 rounded-3xl text-white font-bold text-lg relative ${children}`}
    >
      {text}
      {loading && (
        <span className="absolute top-0 w-full bg-black/50 rounded-3xl left-0 h-full" />
      )}
    </button>
  );
}
