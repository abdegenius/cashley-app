import { Transaction } from "@/types/api";
import { formatToNGN } from "@/utils/amount";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import React from "react";

interface TransactionProps {
  transaction: Transaction;
  onClose: () => void
}
export default function ViewTransactionDetails({ transaction, onClose }: TransactionProps) {
  return (
    <div>
      <div className="fixed z-5 inset-0 w-full h-full bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center max-w-xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 text-center py-4 bg-card rounded-2xl px-4"
        >
          <div className="w-full flex p-2 items-end justify-end">
            <button
              onClick={onClose}
              className="text-lg font-medium text-red-400"
            >
              Close
            </button>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 primary-purple-to-blue rounded-full flex items-center justify-center mx-auto"
          >
            {transaction.status === "completed" ? (
              <Check size={40} className="" />
            ) : (
              <X size={40} className="" />
            )}
          </motion.div>

          <div className="space-y-0">
            <h2 className="text-xl text-stone-400 font-black">
              {transaction.status === "completed"
                ? "Transaction Successful"
                : "Transaction Failed"}
            </h2>
            <p className="text-sm text-stone-200">
              {transaction.status === "completed"
                ? "Your transaction has been processed successfully"
                : "Something went wrong. Please try again."}
            </p>
            <div className="flex flex-col gap-0 pt-2">
              <span className="font-black purple-text text-4xl">
                {formatToNGN(Number(transaction.amount))}
              </span>
              <span className="text-stone-400 text-sm">Amount</span>
            </div>
          </div>

          <div className="w-full rounded-2xl p-2 space-y-2">
            <div className="flex justify-between items-start space-x-4">
              <span className="text-stone-400 text-sm">Type</span>
              <span className="font-mono text-sm text-right text-stone-200">
                {transaction.type}
              </span>
            </div>
            <div className="flex justify-between items-start space-x-4">
              <span className="text-stone-400 text-sm">Service</span>
              <span className="font-mono text-sm text-right text-stone-200">
                {transaction.action}
              </span>
            </div>
            <div className="flex justify-between items-start space-x-4">
              <span className="text-stone-400 text-sm">Status</span>
              <span className="font-mono text-sm text-right text-stone-200">
                {transaction.status}
              </span>
            </div>
            <div className="flex justify-between items-start space-x-4">
              <span className="text-stone-400 text-sm">Amount</span>
              <span className="font-mono text-sm text-right text-stone-200">
                {formatToNGN(Number(transaction.amount))}
              </span>
            </div>
            <div className="flex justify-between items-start space-x-4">
              <span className="text-stone-400 text-sm">Date</span>
              <span className="font-mono text-sm text-right text-stone-200">
                {transaction.created_at}
              </span>
            </div>
            <div className="flex justify-between items-start space-x-4">
              <span className="text-stone-400 text-sm">Reference</span>
              <span className="font-mono text-sm text-right text-stone-200">
                {transaction.reference}
              </span>
            </div>

            <div className="flex justify-between items-start space-x-4">
              <span className="text-stone-400 text-sm">Description</span>
              <span className="font-mono text-sm text-right text-stone-200">
                {transaction.description}
              </span>
            </div>
          </div>
        </motion.div>
        <div className="my-6 w-full flex gap-4 px-4">
          <button className="w-full p-4 rounded-full bg-card">
            Share as image
          </button>
          <button className="w-full p-4 rounded-full bg-card">
            Share as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
