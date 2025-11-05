"use client";

import React from "react";
import { Theme, useTheme } from "@/providers/ThemeProvider";
import { Moon, Settings, Sun } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Appearance() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themes = [
    {
      id: "light",
      label: "Light",
      icon: <Sun size={24} className="text-yellow-500" />,
      description: "Bright mode for better visibility in daylight.",
    },
    {
      id: "dark",
      label: "Dark",
      icon: <Moon size={24} className="text-purple-400" />,
      description: "A sleek dark mode for low-light environments.",
    },
    {
      id: "system",
      label: "System",
      icon: <Settings size={24} className="text-blue-500" />,
      description: `Currently using ${resolvedTheme === "dark" ? "dark" : "light"
        } theme based on system.`,
    },
  ];

  return (
    <div className="w-full h-full flex items-start justify-center px-4 py-6">
      <div className="w-full max-w-lg flex flex-col gap-8">
        {/* HEADER */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black">Appearance</h1>
          <p className="text-sm text-muted-foreground">
            Personalize your Cashley experience by selecting your preferred theme.
          </p>
        </div>

        {/* THEME PREVIEW */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-900/10 dark:to-blue-900/10 p-5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500" />
          <div className="flex flex-col items-center text-center space-y-3 py-6">
            {resolvedTheme === "dark" ? (
              <Moon size={32} className="text-purple-400" />
            ) : (
              <Sun size={32} className="text-yellow-500" />
            )}
            <h2 className="font-semibold">
              Currently using{" "}
              <span className="capitalize text-purple-600">{resolvedTheme}</span> mode
            </h2>
            <p className="text-xs text-muted-foreground">
              Switch between light, dark, or automatic system theme.
            </p>
          </div>
        </div>

        {/* THEME SELECTION */}
        <div className="flex flex-col gap-4">
          {themes.map((t) => {
            const active = theme === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setTheme(t.id as unknown as Theme)}
                className={`w-full cursor-pointer flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${active
                    ? "border-transparent bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                    : "bg-card border-border hover:bg-muted/60"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${active
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {t.icon}
                  </div>
                  <div>
                    <p
                      className={`font-semibold ${active ? "text-white" : "text-foreground"
                        }`}
                    >
                      {t.label}
                    </p>
                    <p
                      className={`text-xs ${active ? "text-white/80" : "text-muted-foreground"
                        }`}
                    >
                      {t.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${active
                        ? "border-white bg-white/30"
                        : "border-border bg-background"
                      }`}
                  >
                    {active && (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-muted-foreground pt-4">
          Your theme preference is saved automatically.
        </div>
      </div>
    </div>
  );
}
