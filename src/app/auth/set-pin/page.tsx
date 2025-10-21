"use client";

import { Keypad } from "@/components/models/Keypad";
import Button from "@/components/ui/Button";
import { toDigitArray } from "@/utils/string";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

export default function SetPin() {
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPin, setshowPin] = useState<boolean>(false);
  const [step, setStep] = useState(1);

  const handleShowPin = () => {
    setshowPin(!showPin);
  };

  const validatePins = () => {
    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
      return false;
    }
    if (step === 2 && pin !== confirmPin) {
      setError("PINs don't match");
      return false;
    }
    setError(null);
    return true;
  };

  const handleNumberClick = (num: string) => {
    if (step === 1) {
      if (pin.length < 4) {
        setPin((prev) => prev + num);
      }
    } else {
      if (confirmPin.length < 4) {
        setConfirmPin((prev) => prev + num);
      }
    }
  };

  const handleDelete = () => {
    if (step === 1) {
      setPin((prev) => prev.slice(0, -1));
    } else {
      setConfirmPin((prev) => prev.slice(0, -1));
    }
  };

  const handleConfirm = () => {
    if (!validatePins()) return;

    if (step === 1) {
      setStep(2);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const handleNext = () => {
    handleConfirm();
  };

  const renderDots = (val: string) => (
    <div className="w-full flex justify-center gap-3 mb-6">
      {!showPin ? [...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ scale: val[i] ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`w-6 h-6 rounded-full ${val[i]
            ? "primary-purple-to-blue shadow-md"
            : "bg-stone-200 border border-stone-300"
            }`}
        ></motion.div>
      )) :
        toDigitArray(pin).map((p, i) => (
          <span key={i} className="text-4xl font-bold font-mono text-center px-2">{p}</span>
        ))
      }
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="w-full flex flex-col justify-around">
            {renderDots(pin)}

            <div className="text-center mb-8">
              <h2 className="text-xl mb-2">Create PIN</h2>
              <p className="text-sm text-gray-600 mb-2">
                Enter a 4-digit PIN to secure your account
              </p>
              <button
                onClick={handleShowPin}
                className="cursor-pointer text-gray-500 hover:text-gray-700"
                type="button"
              >
                {showPin ? (
                  <Eye size={16} className="inline" />
                ) : (
                  <EyeOff size={16} className="inline" />
                )}
                <span className="ml-2 text-xs">
                  {showPin ? "Hide" : "Show"}
                </span>
              </button>
              {/* {showPin && pin && (
                
              )} */}
            </div>

            <Keypad
              numbers={keypadNumbers}
              onNumberClick={handleNumberClick}
              onDelete={handleDelete}
              onConfirm={handleConfirm}
              disableConfirm={pin.length < 4}
              loading={false}
              step={step}
            />
          </div>
        );
      case 2:
        return (
          <div className="w-full flex flex-col justify-around">
            {renderDots(confirmPin)}

            <div className="text-center mb-8">
              <h2 className="text-xl mb-2">Confirm PIN</h2>
              <p className="text-sm text-gray-600 mb-2">
                Re-enter your 4-digit PIN to confirm
              </p>
              {error && (
                <span className="text-red-500 text-sm block mb-2">{error}</span>
              )}
              <button
                onClick={handleShowPin}
                className="cursor-pointer text-gray-500 hover:text-gray-700"
                type="button"
              >
                {showPin ? (
                  <Eye size={16} className="inline" />
                ) : (
                  <EyeOff size={16} className="inline" />
                )}
                <span className="ml-2 text-xs">
                  {showPin ? "Hide PIN" : "Show PIN"}
                </span>
              </button>
              {showPin && confirmPin && (
                <div className="mt-2 text-lg font-mono">{confirmPin}</div>
              )}
            </div>

            <Keypad
              numbers={keypadNumbers}
              onNumberClick={handleNumberClick}
              onDelete={handleDelete}
              onConfirm={handleConfirm}
              disableConfirm={confirmPin.length < 4}
              loading={false}
              step={step}
            />
          </div>
        );
    }
  };

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
    "←",
    "0",
    "#",
  ];

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setConfirmPin("");
      setError(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col my-auto items-center justify-between space-y-6">
      <div className="w-full flex flex-col space-y-12 items-center">
        {renderStep()}
      </div>

      <div className="w-full max-w-sm space-y-3">
        {step === 2 && (
          <Button
            onclick={handleBack}
            type="secondary"
            text="Back"
            width="w-full"
          />
        )}
        {/* <Button
          loading={loading}
          onclick={handleNext}
          type="secondary"
          text={step === 1 ? "Continue" : "Set PIN"}
          width="w-full"
        /> */}
      </div>
    </div>
  );
}
