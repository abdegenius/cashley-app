"use client";
import { useTheme } from "@/providers/ThemeProvider";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function CenteredLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [imageSrc, setImageSrc] = useState(resolvedTheme === "dark" ? "/svg/cashley.svg" : "/svg/cashley-dark.svg");

  return (
    <div className="w-full overflow-none min-h-screen h-full flex flex-col items-center p-6 bg-background">
      <div className="flex items-center justify-center flex-col max-w-lg w-full">
        {pathname !== "/auth" && (
          <div className="flex w-full flex-row items-center justify-between mb-6">
            <div className="w-100 h-10 relative flex justify-start">
              <Image src={imageSrc || "/svg/cashley.svg"} alt="cashley" width={100} height={30} />
            </div>
          </div>
        )}
        <div className="w-full h-full">{children}</div>
      </div>
    </div>
  );
}
