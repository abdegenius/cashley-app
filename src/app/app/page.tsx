"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Eye, EyeOff, Gift } from "lucide-react";
import Button from "@/components/ui/Button";
import TransactionHistory from "@/components/modals/TransactionHistory";
import api from "@/lib/axios";
import { ApiResponse, Transaction } from "@/types/api";
import { formatToNGN, formatToUSD } from "@/utils/amount";
import { services } from "@/utils/string";
import { useAuthContext } from "@/context/AuthContext";
import { topupModal } from "@/controllers/topup-modal";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [visibleBalances, setVisibleBalances] = useState<Record<string, boolean>>({
    ngn: false,
    usdt: false,
    eth: false,
    btc: false,
  });

  const handleToggleBalance = useCallback((id: string) => {
    setVisibleBalances((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const balances = useMemo(
    () => [
      { id: "ngn", currency: "NGN", value: Number(user?.ngn_balance ?? 0), symbol: "₦" },
      { id: "usdt", currency: "USDT", value: Number(user?.usdt_balance ?? 0), symbol: "$" },
      { id: "eth", currency: "ETH", value: Number(user?.eth_balance ?? 0), symbol: "Ξ" },
      { id: "btc", currency: "BTC", value: Number(user?.btc_balance ?? 0), symbol: "₿" },
    ],
    [user]
  );

  useEffect(() => {
    let mounted = true;

    const fetchTransactions = async () => {
      try {
        const res = await api.get<ApiResponse>("/transactions/recent");
        if (mounted && res.data.error === false) {
          setTransactions(res.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTransactions();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-full h-full space-y-4 overflow-y-scroll px-4">
      {/* Header */}
      <div className="w-full flex justify-between items-center mt-2">
        <div className="flex items-center gap-2">
          <Image
            src="/globe.svg"
            alt="user image"
            width={28}
            height={28}
            className="rounded-full object-cover"
          />
          <h1 className="text-sm sm:text-md">Welcome back,</h1>
          <span className="text-sm sm:text-lg font-semibold">{user?.username}</span>
        </div>
        <Link
          href="/app/notifications"
          className="cursor-pointer hover:bg-card p-2 rounded-full placeholder-text"
        >
          <Bell size={24} />
        </Link>
      </div>

      {/* Wallet Balances - Scrollable */}
      <div className="relative w-full mt-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
          {balances.map((balance) => {
            const isVisible = visibleBalances[balance.id];
            const amount =
              balance.id === "ngn"
                ? formatToNGN(balance.value)
                : formatToUSD(balance.value);

            return (
              <div
                key={balance.id}
                className="min-w-[200px] snap-center shrink-0 p-5 rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-slate-900 text-white flex flex-col justify-between transition-all duration-300 shadow-md hover:scale-[1.03]"
              >
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={`/img/${balance.id}.png`}
                      alt={balance.id}
                      width={24}
                      height={24}
                    />
                    <span className="font-normal uppercase">{balance.currency}</span>
                  </div>
                  <button
                    onClick={() => handleToggleBalance(balance.id)}
                    className="text-gray-400 hover:text-gray-100 transition-colors"
                  >
                    {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="text-2xl font-black mt-3">
                  {isVisible ? amount : `${balance.symbol}***.**`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col gap-6 mt-4">
        <div className="flex justify-between items-center gap-4">
          <Button
            onclick={() => topupModal.open()}
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
        <div className="w-full rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-purple-700 via-fuchsia-700 to-indigo-700 text-white shadow-lg flex items-center justify-between">
          <div className="space-y-2 max-w-[70%]">
            <h1 className="text-xl font-bold">Refer & Earn</h1>
            <p className="text-sm text-gray-100">
              Earn ₦500 when your friends join and complete their first transaction.
            </p>
            <Link
              href="/app/refer"
              className="inline-block mt-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-full transition"
            >
              Refer Now
            </Link>
          </div>
          <div className="absolute right-0 bottom-0">
            <Image
              src="/img/refer-gift.png"
              alt="refer and earn"
              width={200}
              height={200}
              className="object-contain opacity-80"
            />
          </div>
          <div className="absolute top-0 left-0 opacity-5">
            <Gift size={160} />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex flex-col gap-6 mt-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-black">Quick links</h1>
          <Link href="/app/services" className="hover:underline">
            See all
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {services
            .filter((service) => service.featured)
            .map((service) => (
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
      <div className="flex flex-col gap-6 mt-6 mb-8">
        <h1 className="text-xl font-black">Recent transactions</h1>
        <div className="flex flex-col gap-4">
          {loading ? (
            <p className="text-gray-400 text-center">Loading transactions...</p>
          ) : (
            <TransactionHistory transactions={transactions} compact={true} />
          )}
        </div>
      </div>
    </div>
  );
}
