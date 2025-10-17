"use client";

import { ThemeToggle } from "@/components/ui/themeToggle";
import { useTheme } from "@/providers/themeProvider";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function CenteredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    setImageSrc(
      resolvedTheme === "dark" ? "/svg/cashly.svg" : "/svg/cashly-dark.svg"
    );
  }, [resolvedTheme]);

  return (
    <div className="h-screen min-h-full flex flex-col bg-background p-6">
      <div className="w-full h-full">{children}</div>
    </div>
  );
}
