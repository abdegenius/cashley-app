"use client";

import React from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { services } from "@/utils/string";
import { Sparkles } from "lucide-react";

export default function ServicesPage() {
  const { user } = useAuthContext();

  return (
    <div className="w-full h-full flex flex-col space-y-8 p-4 sm:p-8">
      {/* Header Section */}
      <div className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-violet-500 to-blue-400">
          Explore Our Services
        </h1>
        <h4 className="text-sm text-muted-foreground">
          Choose a service to get started and take control of your digital finance.
        </h4>
      </div>

      {/* Crypto Highlight */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-700/10 via-purple-500/5 to-blue-500/10 border border-purple-600/20 rounded-2xl p-5 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center backdrop-blur-sm">
        <div className="space-y-1 w-[80%]">
          <h2 className="text-xl font-semibold text-purple-500 flex items-center gap-2">
            <Sparkles size={18} className="animate-pulse text-purple-400" />
            Buy & Sell Crypto
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Buy, sell, and swap crypto seamlessly — your gateway to digital wealth.
          </p>
        </div>
        <Link
          href="/app/crypto"
          className="mt-3 sm:mt-0 flex-1 flex bg-gradient-to-r from-purple-600 to-blue-500 text-white px-5 py-2 rounded-full text-sm font-medium shadow-lg hover:scale-105 transition-transform"
        >
          Explore
        </Link>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
        {services?.map((service, id) => (
          <Link
            key={id}
            href={service.link}
            className="group relative w-full p-5 rounded-2xl bg-card flex flex-col border border-transparent hover:border-purple-600/40 hover:shadow-purple-300/10 hover:shadow-lg transition-all duration-300 items-center justify-center gap-2 text-center"
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-400 text-white mb-2 shadow-md group-hover:scale-110 transition-transform">
              <service.icon size={22} />
            </div>
            <span className="text-base font-semibold group-hover:text-purple-600 transition-colors">
              {service.name}
            </span>
            <span className="text-xs text-muted-foreground">{service.title}</span>

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/0 to-blue-500/0 group-hover:from-purple-600/10 group-hover:to-blue-500/10 transition-all duration-300" />
          </Link>
        ))}
      </div>

      {/* Footer / CTA */}
      <div className="text-center pt-6 text-sm text-muted-foreground">
        Empower your wallet — explore secure, fast, and seamless transactions with{" "}
        <span className="font-semibold text-purple-600">Cashley</span>.
      </div>
    </div>
  );
}
