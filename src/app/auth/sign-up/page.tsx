"use client";

import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function SignUp() {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold ">Airtime & Data Top-up</h1>
            <h3 className="text-lg">
              Easily recharge any mobile network on Cashley within seconds and
              stay connected anytime, anywhere.
            </h3>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold ">Crypto Receiving Address</h1>
            <h3 className="text-lg">
              Receive crypto, usdt, and other major cryptocurrencies directly no
              middlemen, no delays.
            </h3>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold ">Local Bank Transfers</h1>
            <h3 className="text-lg">
              Send and receive naira instantly, no delays, no worries. Enjoy
              smooth, secure transactions that work always.
            </h3>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold ">Cable & Utility Payments</h1>
            <h3 className="text-lg">
              Settle your DSTV, GOTV, and other utility bills instantly with
              zero hidden fees. Fast, reliable, and hassle-free.
            </h3>
          </div>
        );
      default: {
        return (
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold ">Thas all hommie</h1>
            <h3 className="text-lg">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque,
              laboriosam?
            </h3>
          </div>
        );
      }
    }
  };
  return (
    <div className="w-full h-full max-w-lg mx-auto flex flex-col justify-between">
      {renderStep()}
      <div
        onClick={handleNext}
        className="flex flex-col gap-2 h-full items-center justify-center"
      >
        <div className="w-full h-full flex items-center justify-center ">
          <Image
            src={"/svg/keyboard.svg"}
            alt="KeyBoard"
            width={350}
            height={350}
          />
        </div>
        <div className="flex gap-3 justify-center w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              key={index}
              className={`${
                step === index ? "bg-white" : "bg-card"
              } rounded-full w-4 h-4`}
            ></span>
          ))}
        </div>
        <Button type="secondary" text="Create Account" width=" w-full" />
        <div>
          Already have an account?{" "}
          <Link
            href={"/auth/login"}
            className="gradient-text-purple-to-blue font-bold text-lg"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
