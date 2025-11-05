"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import TransactionHistory from "@/components/modals/transactionHistory";
import api from "@/lib/axios";
import { ApiResponse, Transaction } from "@/types/api";
import { formatToNGN } from "@/utils/amount";
import { services } from "@/utils/string";
import { useAuthContext } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [visibleBalances, setVisibleBalances] = useState<Record<string, boolean>>({
    ngn: false,
    usd: false,
  });

  const handleToggleBalance = useCallback((id: string) => {
    setVisibleBalances(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const balances = useMemo(
    () => [
      { id: "ngn", currency: "NGN", value: Number(user?.ngn_balance ?? 0), symbol: "₦" },
      { id: "usd", currency: "USD", value: Number(user?.usdt_balance ?? 0), symbol: "$" },
    ],
    [user]
  );

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
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/globe.svg"
            alt="user image"
            width={24}
            height={24}
            className="rounded-full object-cover"
          />
          <h1 className="text-sm sm:text-md sm:flex">Welcome back!</h1>
          <span className="text-sm sm:text-lg font-normal">{user?.username}</span>
        </div>

        <Link
          href="/app/notifications"
          className="cursor-pointer hover:bg-card p-2 rounded-full placeholder-text"
        >
          <Bell size={24} />
        </Link>
      </div>

      {/* Wallet Balances */}
      <div className="space-y-6 relative">
        <div className="grid grid-cols-2 gap-4">
          {balances.map(balance => {
            const isVisible = visibleBalances[balance.id];
            const amount = formatToNGN(Number(balance.value));

            return (
              <div
                key={balance.id}
                className="w-full p-4 rounded-xl bg-card flex flex-col justify-between min-h-24 transition-all duration-300"
              >
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={`/img/${balance.id}.png`}
                      alt={balance.id}
                      width={20}
                      height={20}
                    />
                    <span className="font-normal pt-1">{balance.currency}</span>
                  </div>

                  <button
                    onClick={() => handleToggleBalance(balance.id)}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="w-full truncate text-lg font-black">
                  {isVisible ? amount : `${balance.symbol}***.**`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-6">
          <div className="flex justify-between items-center gap-4">
            <Button
              type="primary"
              text="Receive"
              width="text-sm sm:text-lg w-full font-normal"
            />
            <Button
              type="secondary"
              text="Send"
              width="text-sm sm:text-lg w-full font-normal"
              href="/app/send"
            />
          </div>

          {/* Referral Section */}
          <div className="w-full rounded-xl p-8 bg-gradient-to-br from-zinc-800 via-slate-800 to-stone-800 text-white">
            <div>
              <h1 className="text-xl font-bold">Refer & Earn</h1>
              <p className="text-md">Earn ₦500 for each friend you refer</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-black">Quick links</h1>
            <Link href="/app/services" className="hover:underline">
              See all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {services
              .filter(service => service.featured)
              .map(service => (
                <Link
                  key={service.id}
                  href={service.link}
                  className="w-full rounded-full py-4 bg-card border-2 border-transparent hover:border-purple-600 flex items-center justify-center gap-2 transition-all"
                >
                  <span className="w-6 placeholder-text">
                    <service.icon size={24} className="purple-text" />
                  </span>
                  <span className="text-center text-lg font-normal">
                    {service.name}
                  </span>
                </Link>
              ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="flex flex-col gap-6">
          <h1 className="text-xl font-black">Recent transactions</h1>
          <div className="flex flex-col gap-4">
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
