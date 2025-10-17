"use client";

import { Keypad } from "@/components/models/Keypad";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Eye, EyeOff, ScanEye } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function LoginPage() {
  const [pin, setPin] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(1);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
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
          className={`w-4 h-4 rounded-full ${val[i]
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
    <div className="w-full h-full flex flex-col my-auto items-center justify-between space-y-6">
      <div className="w-full flex flex-col space-y-12">
        <div className="flex items-center gap-2 bg-card p-2 flex-1 w-full rounded-full">
          {[
            { id: 1, title: "Sign In with Pin" },
            { id: 2, title: "Sign in with Email" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-1/2 truncate flex-1 font-medium text-sm p-3 rounded-3xl transition-all duration-300 ${activeTab === tab.id
                ? "primary-purple-to-blue shadow-md "
                : " hover:primary-orange-to-purple"
                }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {activeTab === 1 ? (
          <div className="w-full flex flex-col justify-around">
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

            <Link href={"/auth/forgot-password"} className="text-center placeholder-text text-sm pt-4">
              Forgot password?
            </Link>
          </div>
        ) : (
          <div className="space-y-3 mt-5 w-full max-w-sm">
            <div className="w-full  bg-card rounded-3xl px-4 py-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="placeholder:placeholder-text bg-card px-2 outline-none border-none w-full py-2"
                placeholder="Email Address"
              />
            </div>
            <div className="w-full flex items-center bg-card rounded-3xl px-4 py-2">
              <input
                type={showPassword ? "password" : "text"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="placeholder:placeholder-text bg-card  px-2 outline-none border-none w-full py-2"
                placeholder="Password"
              />
              <button onClick={handleShowPassword} className="placeholder-text">
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>

            <div className="flex justify-end pt-4">
              <Link href={"/auth/forgot-password"} className="text-center placeholder-text text-sm">
                Forgot password?
              </Link>
            </div>
          </div>
        )}
      </div>

      <Button type="secondary" text="Log in" width="w-full max-w-sm" />

      <div className="flex w-full items-center justify-center flex-row space-x-1">
        <span className="text-sm font-normal">Don't have an account?</span>
        <Link href={"/auth/create-account"} className=" placeholder-text">
          Create account now..
        </Link>
      </div>
    </div>
  );
}
