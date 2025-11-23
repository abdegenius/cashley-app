"use client";

import { useTheme } from "@/providers/ThemeProvider";
import React, { useState } from "react";
import Image from "next/image";
import { useBack } from "@/hooks/useBack";
import { motion } from "framer-motion";

export default function About() {
  const { resolvedTheme } = useTheme();
  const [imageSrc, setImageSrc] = useState(resolvedTheme === "dark" ? "/svg/cashley.svg" : "/svg/cashley-dark.svg");
  const goBack = useBack();


  return (
    <div className="flex flex-col h-full w-full justify-end items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-background rounded-3xl shadow-lg text-center flex flex-col items-center space-y-8 py-10 px-6 max-w-md mx-auto"
      >
        {/* Logo */}
        <Image
          src={imageSrc}
          alt="Cashley Logo"
          width={120}
          height={40}
          priority
          className="select-none"
        />

        {/* Description */}
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Meet your all-in-one wallet designed to simplify every part of your financial life.
          From topping up airtime and purchasing data to settling your utility bills and making
          instant local transfers, everything is just a tap away. Need to deposit cash? No problem.
          Want to receive crypto quickly and securely? We've built that in too. This is your
          complete financial companion — fast, flexible, and effortless.
        </p>

        {/* Close Button */}
        <div className="w-full">
          <button
            onClick={goBack}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 text-white font-medium rounded-full transition-all"
            aria-label="Close"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
