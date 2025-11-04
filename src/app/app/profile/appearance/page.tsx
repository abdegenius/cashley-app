"use client";

import Button from "@/components/ui/Button";
import { Moon, Settings, Sun } from "lucide-react";
import React from "react";
import { useTheme } from "@/providers/ThemeProvider";

export default function Appearance() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="w-full space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-black">Appearance</h1>
        <h1 className="text-lg">Choose your preferred theme</h1>
      </div>

      <div className="space-y-4">
        {/* Light Theme */}
        <div
          className={` rounded-full p-0.5 w-full ${
            theme === "light" ? "primary-purple-to-blue" : "card"
          }`}
        >
          <div
            onClick={() => setTheme("light")}
            className="w-full cursor-pointer bg-card rounded-full py-5 px-6 flex items-center justify-between"
          >
            <div className="flex gap-3 items-center">
              <Sun size={24} className="placeholder-text" />
              <p className="font-bold">Light</p>
            </div>
            <div className="rounded-full border border-border">
              <Button
                onclick={() => setTheme("light")}
                type={theme === "light" ? "secondary" : "card"}
                width="w-6 h-5 flex flex-none"
              />
            </div>
          </div>
        </div>

        {/* Dark Theme */}
        <div
          className={` rounded-full p-0.5 w-full ${
            theme === "dark" ? "primary-purple-to-blue" : "card"
          }`}
        >
          <div
            onClick={() => setTheme("dark")}
            className="w-full cursor-pointer bg-card rounded-full py-5 px-6 flex items-center justify-between"
          >
            <div className="flex gap-3 items-center">
              <Moon size={24} className="placeholder-text" />
              <p className="font-bold">Dark</p>
            </div>
            <div className="rounded-full border border-border">
              <Button
                type={theme === "dark" ? "secondary" : "card"}
                width="w-6 h-5 flex flex-none"
              />
            </div>
          </div>
        </div>
        {/* System Theme */}
        <div
          className={` rounded-full p-0.5 w-full ${
            theme === "system" ? "primary-purple-to-blue" : "card"
          }`}
        >
          <div
            onClick={() => setTheme("system")}
            className="w-full cursor-pointer bg-card rounded-full py-5 px-6 flex items-center justify-between"
          >
            <div className="flex gap-3 items-center">
              <Settings size={24} className="placeholder-text" />
              <div>
                <p className="font-bold">System</p>
                <p className="text-xs text-zinc-500">
                  {resolvedTheme === "dark"
                    ? "Using dark theme"
                    : "Using light theme"}
                </p>
              </div>
            </div>
            <div className="rounded-full border border-border">
              <Button
                onclick={() => setTheme("system")}
                type={theme === "system" ? "secondary" : "card"}
                width="w-6 h-5 flex flex-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
