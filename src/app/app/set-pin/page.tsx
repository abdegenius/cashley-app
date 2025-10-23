"use client";

import { Keypad } from "@/components/models/Keypad";
import Button from "@/components/ui/Button";
import api from "@/libs/axios";
import { ApiResponse } from "@/types/api";
import { toDigitArray } from "@/utils/string";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { useRouter } from "next/navigation";

const setPinSchema = z
  .object({
    pin: z.string().length(4, "PIN must be exactly 4 digits"),
    confirm_pin: z.string().length(4, "PIN must be exactly 4 digits"),
  })
  .refine((data) => data.pin === data.confirm_pin, {
    message: "PINs don't match",
    path: ["confirm_pin"],
  });

type setPinFormData = z.infer<typeof setPinSchema>;

export default function SetPin() {
  const [pin, setPin] = useState<string>("");
  const [confirm_pin, setConfirm_pin] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPin, setshowPin] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<setPinFormData>({
    resolver: zodResolver(setPinSchema),
    mode: "onChange",
  });

  useEffect(() => {
    setValue("pin", pin);
    if (pin.length === 4) {
      trigger("pin");
    }
  }, [pin, setValue, trigger]);

  useEffect(() => {
    setValue("confirm_pin", confirm_pin);
    if (confirm_pin.length === 4) {
      trigger("confirm_pin");
    }
  }, [confirm_pin, setValue, trigger]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  const handleShowPin = () => {
    setshowPin(!showPin);
  };

  const handleNumberClick = (num: string) => {
    if (step === 1) {
      if (pin.length < 4) {
        const newPin = pin + num;
        setPin(newPin);
      }
    } else {
      if (confirm_pin.length < 4) {
        const newconfirm_pin = confirm_pin + num;
        setConfirm_pin(newconfirm_pin);
      }
    }
  };

  const handleDelete = () => {
    if (step === 1) {
      setPin((prev) => prev.slice(0, -1));
    } else {
      setConfirm_pin((prev) => prev.slice(0, -1));
    }
  };

  const onSubmit = async (data: setPinFormData) => {
    setLoading(true);
    try {
      const res = await api.post<ApiResponse>("user/set/pin", {
        pin: data.pin,
        confirm_pin: data.confirm_pin,
      });

      if (res?.data && !res.data.error) {
        toast.success("PIN set successfully");
        router.push("/auth/login");
      } else {
        const err = res.data.message || "Error setting PIN";
        toast.error(err);
        setError(err);
      }
    } catch (err: any) {
      console.log("Failed to set PIN", err);
      const errorMessage = err.response?.data?.message || "Failed to set PIN";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (step === 1) {
      if (pin.length !== 4) {
        setError("PIN must be 4 digits");
        return;
      }
      setError(null);
      setStep(2);
    } else {
      if (confirm_pin.length !== 4) {
        setError("Confirm PIN must be 4 digits");
        return;
      }
      
      const isValid = await trigger();
      if (!isValid) {
        setError("Please fix the validation errors");
        return;
      }
      
      setError(null);
      
      // Call onSubmit directly instead of using handleSubmit
      const formData: setPinFormData = {
        pin,
        confirm_pin
      };
      await onSubmit(formData);
    }
  };

  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderInput = (val: string, showValue: boolean) => (
    <div className="w-full flex justify-center mb-6">
      <div 
        className="relative flex items-center justify-center"
        onClick={handleInputClick}
      >
        {/* Hidden input for focus management */}
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          className="absolute opacity-0 w-1 h-1"
          readOnly
        />
        
        {/* Visual input display */}
        <div className="flex gap-3 items-center">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: val[i] ? 1.05 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`
                w-14 h-14 rounded-xl border-2 flex items-center justify-center
                text-xl font-bold font-mono transition-all duration-200
                ${val[i] 
                  ? "border-purple-500 bg-purple-50 text-purple-700 shadow-sm" 
                  : "border-stone-300 bg-stone-50 text-stone-400"
                }
                ${i === val.length ? 'ring-2 ring-purple-400' : ''}
              `}
            >
              {showValue && val[i] ? (
                <span>{val[i]}</span>
              ) : val[i] ? (
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              ) : (
                <span className="text-stone-300">•</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // Alternative: Simple text input style
  const renderTextInput = (val: string, showValue: boolean) => (
    <div className="w-full flex justify-center mb-6">
      <div className="relative">
        <input
          ref={inputRef}
          type={showValue ? "text" : "password"}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={val}
          readOnly
          className="
            w-48 h-12 text-center text-2xl font-bold font-mono
            border-2 border-stone-300 rounded-xl bg-stone-50
            focus:outline-none focus:border-purple-500 focus:bg-purple-50
            transition-all duration-200
          "
          placeholder="••••"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {val.length === 0 && (
            <span className="text-stone-400 text-lg">Enter PIN</span>
          )}
        </div>
      </div>
    </div>
  );

  // Alternative: Character-by-character input
  const renderCharInput = (val: string, showValue: boolean) => (
    <div className="w-full flex justify-center mb-6">
      <div 
        className="flex gap-2 items-center"
        onClick={handleInputClick}
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              scale: val[i] ? 1.05 : 1,
              borderColor: val[i] ? '#8b5cf6' : '#d6d3d1'
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`
              w-12 h-12 rounded-lg border-2 flex items-center justify-center
              text-xl font-bold font-mono bg-white transition-all duration-200
              ${i === val.length ? 'ring-2 ring-purple-400 shadow-md' : ''}
            `}
          >
            {val[i] ? (
              showValue ? (
                <span className="text-purple-700">{val[i]}</span>
              ) : (
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              )
            ) : (
              <span className="text-stone-300 text-lg">○</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="w-full flex flex-col justify-around">
            {renderInput(pin, showPin)}
            {/* Or use one of the alternatives: */}
            {/* {renderTextInput(pin, showPin)} */}
            {/* {renderCharInput(pin, showPin)} */}

            <div className="text-center mb-8">
              <h2 className="text-xl mb-2">Create PIN</h2>
              <p className="text-sm text-gray-600 mb-2">
                Enter a 4-digit PIN to secure your account
              </p>
              {errors.pin && (
                <span className="text-red-500 text-sm block mb-2">
                  {errors.pin.message}
                </span>
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
                  {showPin ? "Hide" : "Show"}
                </span>
              </button>
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
            {renderInput(confirm_pin, showPin)}
            {/* Or use one of the alternatives: */}
            {/* {renderTextInput(confirm_pin, showPin)} */}
            {/* {renderCharInput(confirm_pin, showPin)} */}

            <div className="text-center mb-8">
              <h2 className="text-xl mb-2">Confirm PIN</h2>
              <p className="text-sm text-gray-600 mb-2">
                Re-enter your 4-digit PIN to confirm
              </p>
              {(error || errors.confirm_pin) && (
                <span className="text-red-500 text-sm block mb-2">
                  {error || errors.confirm_pin?.message}
                </span>
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
            </div>

            <Keypad
              numbers={keypadNumbers}
              onNumberClick={handleNumberClick}
              onDelete={handleDelete}
              onConfirm={handleConfirm}
              disableConfirm={confirm_pin.length < 4}
              loading={loading}
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
      setConfirm_pin("");
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
      </div>
    </div>
  );
}