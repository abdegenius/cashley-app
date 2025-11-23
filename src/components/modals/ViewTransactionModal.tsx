import { Transaction } from "@/types/api";
import { formatToNGN } from "@/utils/amount";
import { motion } from "framer-motion";
import { Check, Loader2, Star, X } from "lucide-react";
import React, { useEffect } from "react";
import useBeneficiary from "@/hooks/useBeneficiary";
import useFavourite from "@/hooks/useFavourite";
interface TransactionProps {
  transaction: Transaction;
  type: string | null;
  onClose: () => void;
}
export default function ViewTransactionDetails({ transaction, onClose, type }: TransactionProps) {
  const {
    beneficiaries,
    addBeneficiary,
    fetchBeneficiaries,
    status: beneficiaryStatus,
    loading: loadingBeneficiary,
    error: beneficiaryError,
  } = useBeneficiary();
  const {
    favourites,
    addFavourite,
    fetchFavourites,
    status: favoriteStatus,
    loading: loadingFavorite,
    error: favoriteError,
  } = useFavourite();

  const exitingBenficiary = beneficiaries?.find(
    (i) =>
      i.data.service_id === transaction.extra.phone ||
      i.data.phone === transaction.extra.phone ||
      i.data.account_number === transaction.extra.account_number
  );

  useEffect(() => {
    fetchBeneficiaries(type);
    fetchFavourites(type);
  }, []);


  const payload = () => {
    switch (type) {
      case "entity":
        return {
          phone: transaction.extra.entity,
          action: "intra",
          data: {
            phone: transaction.extra.entity,
            recipiant: transaction.extra.verify_data.name,
          },
        };
      case "bank":
        return {
          phone: transaction.extra.account_number,
          action: "Inter",
          data: {
            phone: transaction.extra.account_number,
            bank_name: transaction.extra.bank_name,
            bank_code: transaction.extra.bank_code,
          },
        };
      default:
        return {
          phone: transaction.extra.phone,
          action: type,
          data: {
            phone: transaction.extra.phone,
            servicer_id: transaction.extra.service_id,
          },
        };
    }
  };
  return (
    <div>
      <div className="fixed z-5 inset-0 w-full h-full bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center max-w-xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 text-center py-4 bg-card rounded-2xl px-4"
        >
          <div className="w-full flex p-2 items-end justify-between">
            <button onClick={onClose} className="text-lg font-medium text-red-400">
              Close
            </button>
            {!exitingBenficiary && (
              <div>
                {loadingFavorite ? (
                  <Loader2 className="animate-spin" />
                ) : favoriteStatus === "Favorite created" ? (
                  <span className="bg-background px-2 py-1 rounded-full ">
                    <Star fill="gold" size={20} color="cold" />
                  </span>
                ) : (
                  <button
                    onClick={() => addFavourite(payload())}
                    className="bg-background px-2 py-1 rounded-full text-sm "
                  >
                    <Star size={20} color="gold" />
                  </button>
                )}
              </div>
            )}
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
            <h2 className="text-xl font-black">
              {transaction.status === "completed" ? "Transaction Successful" : "Transaction Failed"}
            </h2>
            <p className="text-sm text-stone-400">
              {transaction.status === "completed"
                ? "Your transaction has been processed successfully"
                : "Something went wrong. Please try again."}
            </p>
            <div className="flex flex-col gap-0 pt-2">
              <span className="font-black purple-text text-4xl">
                {formatToNGN(Number(transaction.amount))}
              </span>
              <span className="text-sm">Amount</span>
            </div>
          </div>

          <div className="w-full rounded-2xl p-2 space-y-2">
            <div className="flex justify-between items-start space-x-4">
              <span className="text-sm">Type</span>
              <span className="font-mono text-sm text-right text-stone-400">
                {transaction.type}
              </span>
            </div>
            <div className="flex justify-between items-start space-x-4">
              <span className="text-sm">Service</span>
              <span className="font-mono text-sm text-right text-stone-400">
                {transaction.action}
              </span>
            </div>
            <div className="flex justify-between items-start space-x-4">
              <span className="text-sm">Status</span>
              <span className="font-mono text-sm text-right text-stone-400">
                {transaction.status}
              </span>
            </div>
            <div className="flex justify-between items-start space-x-4">
              <span className="text-sm">Amount</span>
              <span className="font-mono text-sm text-right text-stone-400">
                {formatToNGN(Number(transaction.amount))}
              </span>
            </div>
            <div className="flex justify-between items-start space-x-4">
              <span className="text-sm">Date</span>
              <span className="font-mono text-sm text-right text-stone-400">
                {transaction.created_at}
              </span>
            </div>
            <div className="flex justify-between items-start space-x-4">
              <span className="text-sm">Reference</span>
              <span className="font-mono text-sm text-right text-stone-400">
                {transaction.reference}
              </span>
            </div>
            {transaction.session_id && (
              <div className="flex justify-between items-start space-x-4">
                <span className="text-sm">Session ID</span>
                <span className="font-mono text-sm text-right text-stone-400">
                  {transaction.session_id}
                </span>
              </div>
            )}

            <div className="flex justify-between items-start space-x-4">
              <span className="text-sm">Description</span>
              <span className="font-mono text-sm text-right text-stone-400">
                {transaction.description}
              </span>
            </div>
            {!exitingBenficiary && (
              <div className="flex w-full items-center justify-between ">
                <div className="gradient-text-purple-to-blue">Add as Beneficiary</div>

                {loadingBeneficiary ? (
                  <Loader2 className="animate-spin" />
                ) : beneficiaryStatus === "Beneficiary created" ? (
                  <Check size={30} className="bg-background px-2 py-1 rounded-full " />
                ) : (
                  <button
                    onClick={() => addBeneficiary(payload())}
                    className="bg-background px-2 py-1 rounded-full text-sm "
                  >
                    Add
                  </button>
                )}
              </div>
            )}

            {beneficiaryError && <div className="text-red-500 font-sm">{beneficiaryError}</div>}
          </div>
        </motion.div>
        <div className="my-6 w-full flex gap-4 px-4">
          <button className="w-full p-4 rounded-full bg-card">Share as image</button>
          <button className="w-full p-4 rounded-full bg-card">Share as PDF</button>
        </div>
      </div>
    </div>
  );
}
