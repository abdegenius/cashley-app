"use client";

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      title: "How do I deposit money into my wallet?",
      description:
        "You can fund your wallet by transferring to your Cashley virtual bank account, using a debit card, or depositing cash through supported Cashley agents. Most deposits reflect instantly.",
    },
    {
      title: "Can I make bank transfers with Cashley?",
      description:
        "Yes. Cashley lets you send money to any supported bank account instantly. Just enter the recipient’s account number, verify their name, and complete the transfer in seconds.",
    },
    {
      title: "Is my money safe with Cashley?",
      description:
        "Absolutely. Cashley uses bank-level security with 256-bit SSL encryption, device authorization, PIN protection, and optional two-factor authentication. Your data and funds are fully secured using industry best practices.",
    },
    {
      title: "How long do transfers take?",
      description:
        "Transfers to banks and other Cashley wallets are instant. In rare cases, delays may occur due to bank network issues, but most transactions complete within seconds.",
    },
    {
      title: "Can I receive crypto into my wallet?",
      description:
        "Yes. Cashley supports receiving crypto from supported wallets globally. Once received, it is securely stored and viewable inside the app.",
    },
    {
      title: "What can I pay for inside Cashley?",
      description:
        "You can recharge airtime, buy data bundles, pay utility bills, subscribe to TV services, settle electricity payments, and more — all directly from your wallet.",
    },
    {
      title: "What are the fees for using Cashley?",
      description:
        "Most services are free. Some actions, like bank transfers or bill payments, may include a small convenience fee which is always shown upfront before you confirm any transaction.",
    },
    {
      title: "Can I use Cashley internationally?",
      description:
        "Cashley currently supports users in select countries. However, you can still receive international crypto payments from anywhere around the world.",
    },
    {
      title: "How do I reset my password?",
      description:
        "Tap ‘Forgot Password’ on the login page, follow the secure link sent to your email or phone number, and set a new password in seconds.",
    },
  ];


  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  return (
    <div className="min-h-screen w-full max-w-3xl mx-auto py-10 px-4 space-y-10">
      {/* Header */}
      <motion.div
        className="text-center space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold">Frequently Asked Questions</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Find answers to the most common questions about using Cashley.
        </p>
      </motion.div>

      {/* FAQ List */}
      <motion.div initial="hidden" animate="visible" className="space-y-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={itemVariants}
            className="border border-border/50 rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <button
              onClick={() => toggleFaq(i)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              aria-expanded={openIndex === i}
            >
              <span className="text-lg font-medium">{faq.title}</span>
              <motion.div
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <ChevronDown size={20} className="text-muted-foreground" />
              </motion.div>
            </button>

            {/* Content */}
            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden border-t border-border/30"
                >
                  <div className="p-5 text-sm md:text-base text-muted-foreground leading-relaxed">
                    {faq.description}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
