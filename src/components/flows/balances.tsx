"use client";

import { Copy, Eye, EyeOff, EllipsisVertical, ArrowLeft } from "lucide-react";
import React, { MouseEventHandler, useState, useEffect } from "react";
import Button from "../ui/Button";
import api from "@/libs/axios";
import { ApiResponse } from "@/types/api";
import { useAuth } from "@/hooks/useAuth";
 import {Transaction} from '@/types/api'
 
export default function Balances({
  type = "ngn",
  close,
}: {
  type: string;
  close: MouseEventHandler<HTMLButtonElement>;
}) {
  const [showbal, setShowbal] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const handleShowbal = (id: string) => {
    setShowbal((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get<ApiResponse>("/transactions/history");

        if (res.data.error === false) {
          setTransactions(res.data.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const balances = [
    { currency: "NGN", value: user?.ngn_balance, symbol: "₦" },
    { currency: "USD", value: user?.usdt_balance, symbol: "$" },
  ];

  const balance = balances?.find(
    (bal) => bal.currency.toLowerCase() === type.toLowerCase()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options).replace(",", " -");
  };

  // Format amount with proper currency symbol
  const formatAmount = (amount: string, currency: string) => {
    const numericAmount = parseFloat(amount);
    const formattedAmount = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);

    return currency.toLowerCase() === "usd"
      ? `$${formattedAmount}`
      : `₦${formattedAmount}`;
  };

  // Get display type for transaction
  const getDisplayType = (action: string, type: string) => {
    const typeMap: { [key: string]: string } = {
      airtime: "Airtime",
      data: "Data",
      tv: "TV Subscription",
      transfer: "Transfer",
      deposit: "Deposit",
      withdrawal: "Withdrawal",
    };

    return typeMap[action] || "Transaction";
  };

  if (!balance) return null;

  return (
    <div className="w-full h-full space-y-8">
      {/* Balance Card */}
      <div className="w-full gap-4">
        <div className="w-full p-4 rounded-xl bg-card flex flex-col justify-between min-h-30">
          <div className="flex justify-between items-start w-full">
            <div className="w-full flex gap-3 items-center">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-stone-300"></span>
                <span className="font-semibold">{balance.currency}</span>
              </div>

              <button onClick={() => handleShowbal(balance.currency)}>
                {showbal === balance.currency ? (
                  <Eye size={16} />
                ) : (
                  <EyeOff size={16} />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div>8101842464</div>
              <button className="cursor-pointer">
                <Copy size={18} className="placeholder-text" />
              </button>
            </div>
          </div>
          <div className="w-full flex items-center justify-between">
            <div className="w-full truncate text-lg font-black">
              {showbal === balance.currency ? balance.value : "••••••••"}
            </div>
            <Button type="primary" text="Convert" width="text-sm py-1 px-4" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6 w-full">
        <Button type="secondary" text="Send Money" />
        <Button type="primary" text="Receive Money" />
      </div>

      {/* Back Button */}
      <button
        onClick={close}
        className="p-2 rounded-full hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={16} />
      </button>

      {/* Recent Transactions */}
      <div className="space-y-4 max-h-150 overflow-y-scroll">
        <h1 className="text-xl font-semibold">Recent transactions</h1>

        <div className="w-full">
          {loading ? (
            <div className="text-center py-4">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center min-h-150 py-4">
              No transactions found
            </div>
          ) : (
            transactions.map((trx) => (
              <div
                key={trx.id}
                className="w-full flex justify-between py-3 border-b border-stone-800 items-center"
              >
                <div>
                  <div className="text-lg font-semibold">
                    {balance.currency}
                  </div>
                  <div className="text-sm text-zinc-500">
                    {formatDate(trx.created_at)}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="text-right">
                    <div
                      className={`text-lg font-semibold ${
                        trx.type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {trx.type === "credit" ? "+" : "-"}
                      {formatAmount(trx.amount, balance.currency)}
                    </div>
                    <div className="text-sm text-zinc-500">
                      {getDisplayType(trx.action, trx.type)}
                    </div>
                    {trx.status === "failed" && (
                      <div className="text-xs text-red-500 mt-1">Failed</div>
                    )}
                  </div>
                  <EllipsisVertical size={18} className="text-zinc-400" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
