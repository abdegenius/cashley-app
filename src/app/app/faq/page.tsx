"use client";

import { CornerLeftDown } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Faq() {
  const [toggle, setToggle] = useState<number | null>(null);

  const handleDropdown = (id: number) => {
    setToggle(toggle === id ? null : id);
  };

  const faqs = [
    {
      title: "How do I deposit money into my wallet?",
      description:
        "Cashley uses bank-level security with 256-bit SSL encryption, two-factor authentication, and complies with all financial regulations. Your funds and personal information are protected with the highest security standards.",
    },
    {
      title: "Is my money safe with Cashley?",
      description:
        "Cashley uses bank-level security with 256-bit SSL encryption, two-factor authentication, and complies with all financial regulations. Your funds and personal information are protected with the highest security standards.",
    },
    {
      title: "How long do transfers take?",
      description:
        "Cashley uses bank-level security with 256-bit SSL encryption, two-factor authentication, and complies with all financial regulations. Your funds and personal information are protected with the highest security standards.",
    },
    {
      title: "What are the fees for using Cashley?",
      description:
        "Cashley uses bank-level security with 256-bit SSL encryption, two-factor authentication, and complies with all financial regulations. Your funds and personal information are protected with the highest security standards.",
    },
    {
      title: "Can I use Cashley internationally?",
      description:
        "Cashley uses bank-level security with 256-bit SSL encryption, two-factor authentication, and complies with all financial regulations. Your funds and personal information are protected with the highest security standards.",
    },
    {
      title: "How do I reset my password?",
      description:
        "Cashley uses bank-level security with 256-bit SSL encryption, two-factor authentication, and complies with all financial regulations. Your funds and personal information are protected with the highest security standards.",
    },
  ];

  // Correct animation variants with proper TypeScript types
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  };

  const contentVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    }
  };

  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 }
  };

  return (
    <div className="space-y-10">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-black">FAQ</h1>
        <h4 className="">
          Get answers to common questions about our services and platform.
        </h4>
      </motion.div>

      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {faqs?.map((faq, id) => (
          <motion.div
            key={id}
            className=" rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            variants={itemVariants}
            layout
          >
            <motion.div 
              className="p-6 cursor-pointer "
              onClick={() => handleDropdown(id)}
              whileHover={{ backgroundColor: "bg-card" }}
              whileTap={{ scale: 0.995 }}
            >
              <div className="flex justify-between items-center w-full">
                <motion.h1 
                  className="text-xl w-full max-w-lg font-semibold"
                  layout
                >
                  {faq.title}
                </motion.h1>
                <motion.button
                  className="p-2 rounded-full hover:bg-card cursor-pointer transition-colors"
                  variants={iconVariants}
                  animate={toggle === id ? "open" : "closed"}
                  transition={{ duration: 0.2 }}
                >
                  <CornerLeftDown size={16} />
                </motion.button>
              </div>
            </motion.div>

            <AnimatePresence>
              {toggle === id && (
                <motion.div
                  className="overflow-hidden"
                  variants={contentVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  layout
                >
                  <motion.div 
                    className="px-6 pb-6 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {faq.description}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}