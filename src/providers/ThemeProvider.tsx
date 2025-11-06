"use client";

import * as React from "react";

export type Theme = "dark" | "light" | "system";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light",
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "system";
    }
    return "system";
  });

  const [resolvedTheme, setResolvedTheme] = React.useState<"dark" | "light">("light");

  const getSystemTheme = (): "dark" | "light" => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  };

  React.useEffect(() => {
    if (theme === "system") {
      setResolvedTheme(getSystemTheme());
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const themeToApply = theme === "system" ? getSystemTheme() : theme;
    root.classList.add(themeToApply);

    if (theme !== "system") {
      localStorage.setItem("theme", theme);
    } else {
      localStorage.removeItem("theme");
    }
  }, [theme]);

  // Listen for system theme changes
  React.useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      const newTheme = mediaQuery.matches ? "dark" : "light";
      root.classList.add(newTheme);
      setResolvedTheme(newTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
