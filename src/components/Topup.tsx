"use client";

import { useEffect, useState } from "react";
import { topupModal } from "@/controllers/topup-modal";
import { useBankAccount } from "@/hooks/useBankAccount";
import Modal from "./ui/Modal";
import { Copy, CheckCircle2, Building2, Loader2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function TopupModal() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const { loading, bankAccount, hasBankAccount } = useBankAccount();

  useEffect(() => {
    topupModal.register(setShow);
  }, []);

  const handleCopy = async () => {
    if (bankAccount?.account_number) {
      await navigator.clipboard.writeText(bankAccount.account_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateAccount = async () => {
    try {
      const res = await api.post("/user/create-bank-account");
      if (!res.data.error) {
        toast.success("New account generated successfully!");
        setShow(false);
        router.refresh();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.warn(err);
      toast.error("Failed to generate new account");
    }
  };
  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <div className="w-full bg-card rounded-t-3xl p-6 space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Top Up Your Wallet</h2>
          <button
            onClick={() => setShow(false)}
            className="text-red-400 hover:text-red-500 transition"
          >
            <XCircle size={22} />
          </button>
        </div>

        {/* Info */}
        <p className="text-sm text-gray-400 leading-relaxed">
          {hasBankAccount
            ? "Deposit any amount to the account below. Your wallet will be credited automatically within minutes."
            : "You don’t currently have a virtual account. Click the button below to generate one instantly."}
        </p>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-purple-500" size={32} />
          </div>
        )}

        {/* Bank Account Details */}
        {!loading && hasBankAccount && bankAccount && (
          <div className="w-full bg-gradient-to-br from-zinc-800 via-slate-800 to-stone-800 p-6 rounded-2xl text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-full p-2">
                  <Building2 className="text-purple-600" size={20} />
                </div>
                <div>
                  <h3 className="text-sm text-gray-300">Bank Name</h3>
                  <p className="text-lg font-semibold">{bankAccount.bank_name || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 my-3"></div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm text-gray-300">Account Number</h3>
                <p className="text-2xl font-bold tracking-wider">
                  {bankAccount.account_number || "N/A"}
                </p>
              </div>
              {bankAccount.account_number && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition px-3 py-2 rounded-xl text-sm font-medium"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={16} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Copy
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="mt-3">
              <h3 className="text-sm text-gray-300">Account Name</h3>
              <p className="text-base font-medium">{bankAccount.account_name || "N/A"}</p>
            </div>
          </div>
        )}

        {/* Generate Account Section */}
        {!loading && !hasBankAccount && (
          <div className="flex justify-center">
            <button
              onClick={handleGenerateAccount}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-3 rounded-xl font-semibold"
            >
              <Building2 size={18} />
              Generate Account
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
