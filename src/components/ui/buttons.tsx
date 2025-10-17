"use client";

import Link from "next/link";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Url } from "url";

export function MenuItem({
  icon,
  label,
  label2,
  isRed = false,
  showBorder = false,
  onclick,
  type = "button",
  link = "#",
  amount = "0.00",
}: {
  icon: ReactNode;
  label: string;
  label2?: string;
  isRed?: boolean;
  showBorder?: boolean;
  onclick?: () => void;
  type?: "button" | "link" | "data" | undefined;
  link?: Url | string | undefined;
  amount?: number | string | undefined;
}) {
  const baseClasses =
    "w-full flex items-center justify-between px-0 py-2 transition-all duration-200 hover:bg-violet-950/10";
  const borderClass = showBorder ? "border-b border-border" : "";
  const labelClass = `flex-1 text-[15px] font-medium ${isRed ? "text-red-500" : ""
    }`;
  const labelClass2 = `flex-1 text-[11px] font-medium ${isRed ? "text-red-500" : ""
    }`;

  const iconWrapper =
    "w-10 h-10 flex items-center justify-center rounded-full placeholder-text flex-shrink-0";

  const Chevron = () => (
    <svg
      className="w-5 h-5 placeholder-text"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );

  if (type === "button") {
    return (
      <button
        onClick={onclick}
        type="button"
        className={`${baseClasses} ${borderClass}`}
      >
        <div className="flex justify-start items-center gap-2 flex-row">
          <div className={iconWrapper}>{icon}</div>
          <span className={labelClass}>{label}</span>
        </div>
        {/* <Chevron /> */}
      </button>
    );
  }

  if (type === "link") {
    return (
      <Link href={link || "#"} className={`${baseClasses} ${borderClass}`}>
        <div className="flex items-center py-2 gap-2 flex-1">
          <div className={iconWrapper}>{icon}</div>
          <div className="flex flex-col">
            <span className={labelClass}>{label}</span>
            <span className={labelClass2}>{label2}</span>
          </div>
        </div>
        <Chevron />
      </Link>
    );
  }

  if (type === "data") {
    return (
      <Link href={link || "#"} className={`${baseClasses} ${borderClass}`}>
        <div className="flex items-center gap-4 flex-1">
          <div className={iconWrapper}>{icon}</div>
          <div className="flex flex-col">
            <span className="text-stone-800 font-semibold">{label}</span>
            <span className="text-sm text-stone-500">Total Amount</span>
          </div>
        </div>
        <span className="text-stone-700 font-medium">{amount}</span>
      </Link>
    );
  }

   if (type === "verify") {
    return (
      <Link href={link || "#"} className={`${baseClasses} ${borderClass}`}>
        <div className="flex items-center gap-4 flex-1">
          <div className={iconWrapper}>{icon}</div>
          <div className="flex flex-col">
            <span className="text-stone-800 font-semibold">{label}</span>
            <span className="text-sm text-stone-500">Total Amount</span>
          </div>
        </div>
        <span className="px-4 bg-card text-sm rounded-3xl py-2 font-medium">{amount}</span>
      </Link>
    );
  }

  return null;
}

export function ToggleItem({
  icon,
  label,
  showBorder = true,
  isToggled,
}: {
  icon?: ReactNode;
  label?: string;
  showBorder?: boolean;
  isToggled?: string;
}) {
  return (
    <div
      className={`cursor-pointer transition-all duration-200 rounded-xl p-4 hover:bg-violet-950/10 ${showBorder ? "border-b border-stone-100" : ""
        }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-950/5 text-violet-950 flex-shrink-0">
          {icon}
        </div>
        <span className="flex-1 text-[15px] text-stone-700 font-medium">
          {label}
        </span>
        <button
          type="button"
          className={`w-14 h-8 flex items-center rounded-full transition-all duration-300 ${isToggled === "dark"
            ? "bg-violet-950/30 justify-end"
            : "bg-stone-200 justify-start"
            } p-1`}
        >
          <div
            className={`w-6 h-6 rounded-full transition-all duration-300 ${isToggled ? "bg-violet-950" : "bg-white shadow"
              }`}
          ></div>
        </button>
      </div>
    </div>
  );
}
