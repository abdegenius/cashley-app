import React, { MouseEventHandler } from "react";

export default function Button({
  type,
  width = "w-full",
  text,
  onclick,
}: {
  type?: "primary" | "secondary" | "blue" | "orange" | "purple" | undefined;
  width?: string | undefined;
  text?: string | undefined;
  onclick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}): React.JSX.Element {
  return (
    <button
      onClick={onclick}
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
      } py-3 rounded-3xl text-white font-bold text-lg`}
    >
      {text}
    </button>
  );
}
