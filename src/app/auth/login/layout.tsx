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
      <div className="flex w-full   items-center justify-between ">
        <div className="w-100 h-10 relative flex justify-start">
          <Image src={imageSrc || "/svg/cashly.svg"} alt="cashly" width={100} height={30} />
        </div>
        <div className="w-full flex justify-end">
          <Image
            src={"/globe.svg"}
            alt="user avata"
            width={30}
            height={30}
            className="rounded-full object-cover"
          />
        </div>
        <ThemeToggle />
      </div>
      <div className="w-full h-full">

      {children}
      </div>
    </div>
  );
}
