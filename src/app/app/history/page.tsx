"use client";
import React, { useEffect, useState } from "react";
import TransactionHistory from "@/components/modals/TransactionHistory";
import api from "@/lib/axios";
import { ApiResponse, BankAccount, Transaction } from "@/types/api";
import { useAuthContext } from "@/context/AuthContext";

export default function TransactionHistoryPage() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchTransactions = async () => {
      try {
        const res = await api.get<ApiResponse>("/transactions/history");
        if (isMounted && res.data.error === false) {
          setTransactions(res.data.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTransactions();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full h-full space-y-4 overflow-y-scroll px-4">
      <div className="space-y-6 relative">


        {/* Transactions */}
        <div className="flex flex-col gap-6">
          <h1 className="text-xl font-black">Transaction history</h1>
          <div className="flex flex-col gap-4 h-full">
            {loading ? (
              <p className="text-gray-400 text-center">Loading transactions...</p>
            ) : (
              <TransactionHistory transactions={transactions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
