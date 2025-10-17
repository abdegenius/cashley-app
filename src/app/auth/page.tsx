"use client";

import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function CreateAccount() {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    setStep((prevStep) => prevStep == 3 ? 0 : prevStep + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="w-full flex flex-col space-y-2">
            <h1 className="text-2xl font-bold ">Airtime & Data Top-up</h1>
            <h3 className="text-md placeholder-text">
              Easily recharge any mobile network on Cashley within seconds and
              stay connected anytime, anywhere.
            </h3>
          </div>
        );
      case 1:
        return (
          <div className="w-full flex flex-col space-y-2">
            <h1 className="text-2xl font-bold ">Crypto Receiving Address</h1>
            <h3 className="text-md placeholder-text">
              Receive crypto, usdt, and other major cryptocurrencies directly no
              middlemen, no delays.
            </h3>
          </div>
        );
      case 2:
        return (
          <div className="w-full flex flex-col space-y-2">
            <h1 className="text-2xl font-bold ">Local Bank Transfers</h1>
            <h3 className="text-md placeholder-text">
              Send and receive naira instantly, no delays, no worries. Enjoy
              smooth, secure transactions that work always.
            </h3>
          </div>
        );
      case 3:
        return (
          <div className="w-full flex flex-col space-y-2">
            <h1 className="text-2xl font-bold ">Cable & Utility Payments</h1>
            <h3 className="text-md placeholder-text">
              Settle your DSTV, GOTV, and other utility bills instantly with
              zero hidden fees. Fast, reliable, and hassle-free.
            </h3>
          </div>
        );
      default: {
      }
    }
  };
  return (
    <div className="w-full h-full max-w-lg items-center mx-auto flex flex-col justify-between pt-4">
      {renderStep()}
      <div
        onClick={handleNext}
        onDoubleClick={handleNext}
        className="w-full flex flex-col space-y-12 h-full items-center justify-center"
      >
        <div className="w-full h-full flex items-center justify-center py-8">
          <Image
            src={"/svg/keyboard.svg"}
            alt="KeyBoard"
            width={300}
            height={300}
          />
        </div>
        <div className="flex gap-3 justify-center w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              key={index}
              className={`${step === index ? "bg-white" : "bg-card"
                } rounded-full w-4 h-4`}
            ></span>
          ))}
        </div>
        <div className="w-full items-center flex gap-2 max-w-md">
          <Link
            href={"/auth/login"} className="w-1/2">
            <Button type="primary" text="Log In" width="w-full" />
          </Link>
          <Link
            href={"/auth/login"} className="w-1/2">
            <Button type="secondary" text="Create Account" width="w-full" />
          </Link>
        </div>
      </div>
    </div>
  );
}
