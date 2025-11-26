"use client";

import { useTheme } from "@/providers/ThemeProvider";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useBack } from "@/hooks/useBack";
import { motion } from "framer-motion";
import { Mail, Instagram, Twitter, Facebook, Send } from "lucide-react";

export default function About() {
  const { resolvedTheme } = useTheme();
  const [imageSrc, setImageSrc] = useState("/svg/cashley.svg");
  const goBack = useBack();

  useEffect(() => {
    setImageSrc(
      resolvedTheme === "dark"
        ? "/svg/cashley.svg"
        : "/svg/cashley-dark.svg"
    );
  }, [resolvedTheme]);

  return (
    <div className="flex flex-col h-full w-full items-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-background rounded-3xl shadow-xl w-full max-w-2xl border border-white/10 p-8 space-y-10"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src={imageSrc}
            alt="Cashley Logo"
            width={130}
            height={40}
            priority
            className="select-none opacity-90"
          />
        </div>

        {/* --- Introduction --- */}
        {/* <section className="space-y-4 text-center">
          <h2 className="text-xl font-semibold text-white">
            Description of the Business
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Cashley Ltd. is a dynamic fintech company designed to simplify financial
            transactions and create a seamless experience for users of all ages.
            The platform functions as a digital wallet that integrates savings, investments,
            crypto trading, local transfers, bill payments, and airtime/data purchases—
            all inside one secure, intuitive app.
            <br /><br />
            Currently in its testing and final development phase, Cashley is engineered
            for speed, security, and reliability, bridging the gap between traditional
            banking and modern digital finance. Through this all-in-one structure,
            Cashley promotes financial inclusion and empowers individuals to manage,
            grow, and transact their money easily without technical barriers.
          </p>
        </section> */}

        {/* --- Company Profile Card --- */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-5"
        >
          <h3 className="text-lg font-black">Business Profile</h3>

          {/* Overview */}
          <div>
            <h4 className="font-bold text-white/90 mb-1">Company Overview</h4>
            <p className="text-sm text-stone-400 leading-relaxed">
              Cashley Ltd. is an emerging fintech company headquartered in Rivers State,
              Nigeria. Its core product, the Cashley App, enables users to save, invest,
              pay bills, and trade cryptocurrency through one seamless platform.
            </p>
          </div>

          {/* Mission */}
          <div>
            <h4 className="font-bold text-white/90 mb-1">Mission Statement</h4>
            <p className="text-sm text-stone-400 leading-relaxed">
              To make digital payments—both in local currency and cryptocurrency—
              simple, fast, and accessible to every single human being.
            </p>
          </div>

          {/* Vision */}
          <div>
            <h4 className="font-bold text-white/90 mb-1">Vision Statement</h4>
            <p className="text-sm text-stone-400 leading-relaxed">
              To become Africa’s most trusted and versatile digital financial ecosystem,
              empowering individuals to manage all aspects of their financial lives
              in one place.
            </p>
          </div>

          {/* Core Values */}
          <div className="space-y-2">
            <h4 className="font-bold text-white/90">Core Values</h4>
            <ul className="text-sm text-stone-400 space-y-1 list-disc pl-4">
              <li>Innovation — Building for a digital-first generation.</li>
              <li>Accessibility — Financial tools for everyone.</li>
              <li>Security — Complete safety + confidentiality.</li>
              <li>Speed — Fast, real-time operations.</li>
              <li>Inclusiveness — Equal access to financial opportunities.</li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-2">
            <h4 className="font-bold text-white/90">Services</h4>
            <ul className="text-sm text-stone-400 list-disc pl-4 space-y-1">
              <li>Digital wallet & savings management</li>
              <li>Local money transfers</li>
              <li>Bill payments, airtime & data</li>
              <li>Crypto trading & exchange</li>
              <li>Investment opportunities</li>
            </ul>
          </div>

          {/* Competitive Advantage */}
          <div>
            <h4 className="font-bold text-white/90 mb-1">Competitive Advantage</h4>
            <p className="text-sm text-stone-400 leading-relaxed">
              Cashley stands out by combining local and crypto transactions into
              one simple platform—no switching between apps. With fast processing,
              advanced security, and an intuitive UI, Cashley makes digital finance
              effortless for everyone.
            </p>
          </div>

          {/* Target Market */}
          <div>
            <h4 className="font-bold text-white/90 mb-1">Target Market</h4>
            <p className="text-sm text-stone-400 leading-relaxed">
              Cashley serves students, workers, entrepreneurs, and business owners
              who need fast, convenient, and reliable digital financial solutions.
            </p>
          </div>

          {/* Company Stage */}
          <div>
            <h4 className="font-bold text-white/90 mb-1">Company Stage</h4>
            <p className="text-sm text-stone-400 leading-relaxed">
              Cashley is currently in its testing phase, polishing core features and
              ensuring top-tier user experience before launch.
            </p>
          </div>
        </motion.section>

        {/* --- Contact Section --- */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-bold mb-2">Contact Information</h3>

          <div className="space-y-3 text-sm text-stone-400">
            <p className="flex items-center gap-2">
              <Mail size={18} /> support@cashley.app
            </p>

            <p className="flex items-center gap-2">
              <Instagram size={18} /> @cashley_app
            </p>

            <p className="flex items-center gap-2">
              <Twitter size={18} /> @cashley_app
            </p>

            <p className="flex items-center gap-2">
              <Facebook size={18} /> Cashley App
            </p>

            <p className="flex items-center gap-2">
              <Send size={18} /> @cashleyapp
            </p>
          </div>
        </motion.section>

        {/* Close Button */}
        <div className="pt-4">
          <button
            onClick={goBack}
            className="w-full py-3 rounded-full text-white font-semibold 
              bg-gradient-to-r from-purple-600 to-blue-500 
              hover:opacity-90 transition active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
