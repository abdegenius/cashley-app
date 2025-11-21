"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import TransactionHistory from "@/components/modals/TransactionHistory";
import api from "@/lib/axios";
import { ApiResponse, Transaction } from "@/types/api";
import { formatToNGN, formatToUSD } from "@/utils/amount";
import { services } from "@/utils/string";
import { useAuthContext } from "@/context/AuthContext";
import { topupModal } from "@/controllers/topup-modal";
import ServicesSlider from "@/components/ServiceSlider";


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
              balance.id === "ngn" ? formatToNGN(balance.value) : formatToUSD(balance.value);

            return (
              <div
                key={balance.id}
                className="min-w-[200px] snap-center shrink-0 p-5 rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-slate-900 text-white flex flex-col justify-between transition-all duration-300 shadow-md hover:scale-[1.03]"
              >
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Image src={`/img/${balance.id}.png`} alt={balance.id} width={24} height={24} />
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

        {/* Slider Section */}
        <ServicesSlider />
      </div>

      {/* Quick Links */}
      <div className="flex flex-col gap-6 mt-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
            Quick Links
          </h1>
          <Link
            href="/app/services"
            className="text-sm text-purple-400 hover:text-purple-300 transition hover:underline"
          >
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {services
            .filter((service) => service.featured)
            .map((service) => (
              <Link
                key={service.id}
                href={service.link}
                className="flex flex-row items-center justify-start gap-3 px-2.5 py-2 rounded-2xl
                     bg-card border border-transparent hover:border-purple-500/60 hover:bg-purple-500/10
                     transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-purple-500/20"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-500/10 shrink-0">
                  <service.icon size={22} className="text-purple-400" />
                </div>
                <span className="text-base font-medium text-gray-100 truncate">{service.name}</span>
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
