"use client";

import { Keypad } from "@/components/models/keyPad";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Eye, EyeOff, ScanEye } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function Page() {
  const [pin, setPin] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(1);
  const [type, setType] = useState<boolean>();

  const handleShowPassword = () => {
    setType(!type);
  };
  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (pin.length === 4) {
      console.log("PIN entered:", pin);
      setPin("");
    }
  };

  const renderDots = (val: string) => (
    <div className="flex justify-center gap-3 mb-6">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ scale: val[i] ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`w-4 h-4 rounded-full ${
            val[i]
              ? "primary-purple-to-blue shadow-md"
              : "bg-stone-200 border border-stone-300"
          }`}
        ></motion.div>
      ))}
    </div>
  );

  const keypadNumbers = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "✓",
    "0",
    "←",
  ];

  return (
    <div className="w-full h-full flex flex-col my-auto items-center justify-between">
      <div className=" space-y-10">
        <div className="flex items-center gap-2 bg-card p-2 max-w-sm w-full mt-10 rounded-3xl">
          {[
            { id: 1, title: "Sign In with Pin" },
            { id: 2, title: "Sign in with Email" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`truncate flex-1 font-medium text-sm p-3 rounded-3xl transition-all duration-300 ${
                activeTab === tab.id
                  ? "primary-purple-to-blue shadow-md "
                  : " hover:primary-orange-to-purple"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {activeTab === 1 ? (
          <div className="w-full flex flex-col justify-around ">
            {renderDots(pin)}

            <div className="text-center mb-8">
              <h2 className="text-xl mb-2">Enter PIN</h2>
            </div>
            <Keypad
              numbers={keypadNumbers}
              onNumberClick={handleNumberClick}
              onDelete={handleDelete}
              onConfirm={handleConfirm}
              disableConfirm={pin.length < 4}
              loading={false}
            />

            <Link href={"#"} className="text-center placeholder-text text-sm">
              Forget password?
            </Link>
          </div>
        ) : (
          <div className="space-y-3 mt-5 w-full max-w-sm">
            <div className="w-full  bg-card rounded-3xl px-4 py-2">
              <input
                type="text"
                className="placeholder:placeholder-text bg-card px-2 outline-none border-none w-full py-2"
                placeholder="Email Address"
              />
            </div>
            <div className="w-full flex items-center bg-card rounded-3xl px-4 py-2">
              <input
                type={type ? "password" : "text"}
                className="placeholder:placeholder-text bg-card  px-2 outline-none border-none w-full py-2"
                placeholder="Password"
              />
              <button onClick={handleShowPassword} className="placeholder-text">
                {type ? <Eye /> : <EyeOff />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link href={"#"} className="text-center placeholder-text text-sm">
                Forget password?
              </Link>
            </div>
          </div>
        )}
      </div>

      <Button type="secondary" text="Sign in" width=" w-full max-w-sm" />
    </div>
  );
}
