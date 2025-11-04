"use client";

import { useTheme } from "@/providers/ThemeProvider";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useBack } from "@/hooks/useBack";

export default function About() {
  const { resolvedTheme } = useTheme();
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    setImageSrc(
      resolvedTheme === "dark" ? "/svg/cashley.svg" : "/svg/cashley-dark.svg"
    );
  }, [resolvedTheme]);

  return (
    <div className="w-full  h-full flex flex-col justify-end bg-card">
      <div className="text-center bg-background flex flex-col items-center  space-y-10 py-6 px-4">
        <Image
          src={imageSrc || "/svg/cashley.svg"}
          alt="cashley"
          width={100}
          height={30}
        />
        <div className="">
          Your All-in-One Wallet for Everyday Payments & Crypto. Top-up airtime,
          buy data, pay bills, transfer locally, deposit cash, and even receive
          crypto — all in one seamless app.
        </div>

        <div onClick={useBack()} className="w-full rounded-full p-0.5 primary-purple-to-blue">
            <button className="w-full py-4 bg-background rounded-full">
                close
            </button>
        </div>
      </div>
    </div>
  );
}
