"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!mounted) {
    return (
      <div className="w-14 h-8 flex items-center rounded-full transition-all duration-300 bg-gray-900 p-1">
        <span className="w-6 h-6 rounded-full bg-white shadow"></span>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`w-14 h-8 flex items-center rounded-full transition-all duration-300 ${
        theme === "dark"
          ? "bg-[#21A29D]/30 justify-end"
          : "bg-stone-200 justify-start"
      } p-1`}
    >
      <span
        className={`w-6 h-6 rounded-full transition-all duration-300 ${
          theme === "dark" ? "bg-[#21A29D]" : "bg-white shadow"
        }`}
      ></span>
    </button>
  );
}