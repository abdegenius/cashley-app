"use client";

import { enterPinModal } from "@/controllers/enter-pin-modal";
import { motion } from "framer-motion";
import { Delete, X } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "./ui/Modal";

interface EnterPinProps {
  otp: string[];
  show: boolean;
  setOtp: (otp: string[]) => void;
  headerText?: string;
  buttonText?: string;
  onConfirm: () => void;
  onBack: () => void;
}

export function EnterPin({
  otp,
  show,
  setOtp,
  headerText,
  buttonText,
  onConfirm,
  onBack,
}: EnterPinProps) {
  const [active, setActive] = useState(show);

  useEffect(() => {
    enterPinModal.register(setActive);
  }, []);

  const handleKeyPress = (key: string) => {
    const newOtp = [...otp];
    const idx = newOtp.findIndex((v) => v === "");
    if (idx !== -1) {
      newOtp[idx] = key;
      setOtp(newOtp);
    }
  };

  const handleDelete = () => {
    const newOtp = [...otp];
    const idx = newOtp.findLastIndex((v) => v !== "");
    if (idx !== -1) {
      newOtp[idx] = "";
      setOtp(newOtp);
    }
  };

  const handleConfirm = () => {
    if (otp.every((d) => d !== "")) onConfirm();
  };

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

  return (
    <Modal show={show} onClose={() => setActive(false)}>
      <div className="w-full flex flex-col items-center justify-center space-y-10 py-8 px-4 bg-card rounded-t-3xl">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-100 hover:text-gray-200"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col items-center space-y-2 pt-4">
          <h2 className="text-md font-normal text-gray-100">{headerText}</h2>
        </div>
        <div className="flex gap-x-8">
          {otp.map((digit, i) => (
            <motion.div
              key={i}
              className={`w-8 h-8 rounded-full border-2 ${digit ? "primary-orange-to-purple" : "border-gray-300"}`}
              animate={{ scale: digit ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 w-[300px]">
          {digits.map((key, i) =>
            key === "" ? (
              <div key={i}></div>
            ) : key === "del" ? (
              <motion.button
                key={i}
                onClick={handleDelete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 rounded-xl bg-card flex justify-center items-center transition-all"
              >
                <Delete className="w-5 h-5 text-gray-50" />
              </motion.button>
            ) : (
              <motion.button
                key={i}
                onClick={() => handleKeyPress(key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 text-lg font-semibold bg-card rounded-xl text-gray-50 transition-all"
              >
                {key}
              </motion.button>
            )
          )}
        </div>
        <motion.button
          onClick={handleConfirm}
          disabled={!otp.every((d) => d !== "")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-[300px] py-3 rounded-lg font-semibold text-white ${otp.every((d) => d !== "") ? "primary-orange-to-purple" : "bg-gray-900 opacity-25 cursor-not-allowed"} transition-all`}
        >
          {buttonText ?? "Pay"}
        </motion.button>
      </div>
    </Modal>
  );
}
