"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Eye, EyeOff, SendHorizonal, Download, Repeat } from "lucide-react";
import TransactionHistory from "@/components/modals/TransactionHistory";
import api from "@/lib/axios";
import { ApiResponse, CryptoWallet, Transaction } from "@/types/api";
import { formatToNGN } from "@/utils/amount";
import { services } from "@/utils/string";
import { useAuthContext } from "@/context/AuthContext";
import { topupModal } from "@/controllers/topup-modal";
import ServicesSlider from "@/components/ServiceSlider";
import { sendCryptoModal } from "@/controllers/send-crypto-modal";
import SendCryptoModal from "@/components/SendCrypto";
import { receiveCryptoModal } from "@/controllers/receive-crypto-modal";
import ReceiveCryptoModal from "@/components/ReceiveCrypto";
import SwapCryptoModal from "@/components/SwapCrypto";
import { swapCryptoModal } from "@/controllers/swap-crypto-modal";


export default function DashboardPage() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cryptoWallets, setCryptoWallets] = useState<any[] | null>(null);
  const [cryptoWallet, setCryptoWallet] = useState<CryptoWallet | null>(null);
  const [ngn_balance, setNGNBalance] = useState<number>(Number(user?.ngn_balance || 0));
  const [unreadNotification, setUnreadNotification] = useState<number>(0);
  const [selectedCryptoWallets, setSelectedChains] = useState<Record<string, any>>({});

  useEffect(() => {
    let mounted = true;


    const fetchUnreadNotifications = async () => {
      try {
        const res = await api.get<ApiResponse>("/notifications/unread-count");
        if (!res.data.error) {
          setUnreadNotification(res.data.data || 0);
        }
      } catch (error) {
        console.error("Failed to fetch notification count:", error);
      }
    };

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

    const fetchCryptoWallets = async () => {
      try {
        const res = await api.get<ApiResponse>("/crypto-wallet/home");
        if (!res.data.error) {
          setCryptoWallets(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch crypto wallets:", error);
      }
    };

    fetchCryptoWallets();
    fetchUnreadNotifications();
    fetchTransactions();
    return () => {
      mounted = false;
    };
  }, []);

  const openSendCryptoModal = (wallet: CryptoWallet) => {
    setCryptoWallet(wallet)
    receiveCryptoModal.close()
    swapCryptoModal.close()
    sendCryptoModal.open()
  };

  const openReceiveCryptoModal = (wallet: CryptoWallet) => {
    setCryptoWallet(wallet)
    sendCryptoModal.close()
    swapCryptoModal.close()
    receiveCryptoModal.open()
  };

  const openSwapCryptoModal = (wallet: CryptoWallet) => {
    setCryptoWallet(wallet)
    sendCryptoModal.close()
    swapCryptoModal.open()
    receiveCryptoModal.close()
  };

  const handleSelectChain = (coin: string, chainName: string, chains: any[]) => {
    const chain = chains.find((c) => c.chain === chainName);
    if (!chain) return;

    setSelectedChains((prev) => ({
      ...prev,
      [coin]: chain,
    }));
  };

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
          className="relative bg-purple-50/25 inset-0 items-center flex flex-col cursor-pointer hover:bg-card p-2 rounded-full placeholder-text"
        >
          <Bell size={24} className="text-purple-600" />
          <div className="w-4 h-4 absolute -top-1 right-1 bg-red-600 text-white text-[12px] rounded-full items-center flex justify-center text-center">
            {unreadNotification}
          </div>
        </Link>
      </div>

      <div className="w-full space-y-6 mt-4">

        {/* BALANCE CARD */}
        <div
          className="w-full p-5 rounded-2xl bg-gradient-to-br from-zinc-900/90 via-zinc-800/70 to-slate-900/80
    backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
        >
          {/* Top Row */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Image
                src="/img/ngn.png"
                alt="NGN"
                width={26}
                height={26}
                className="rounded-full"
              />
              <span className="text-sm text-gray-300">Available Balance</span>
            </div>

            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-stone-400 hover:text-white transition-colors"
            >
              {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Balance */}
          <div className="text-3xl font-extrabold tracking-tight text-white">
            {showBalance ? formatToNGN(ngn_balance) : "₦***.**"}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4">

          {/* Receive */}
          <button
            onClick={() => topupModal.open()}
            className="w-full py-3 rounded-xl font-medium text-white
      bg-gradient-to-r from-indigo-600 to-purple-600
      hover:from-indigo-500 hover:to-purple-500 transition-all
      shadow-md hover:shadow-lg active:scale-[0.97]"
          >
            Receive
          </button>

          {/* Send */}
          <a
            href="/app/send"
            className="w-full py-3 rounded-xl font-medium text-white/90
      primary-purple-to-blue backdrop-blur-sm
      hover:bg-white/20 hover:text-white transition-all
      shadow-md hover:shadow-lg active:scale-[0.97] text-center"
          >
            Send
          </a>

        </div>
      </div>




      {/* Crypto Wallets Section */}
      {cryptoWallets && cryptoWallets.length > 0 && (
        <div className="w-full">

          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">

            {cryptoWallets.map((wallet) => {
              const selectedCryptoWallet = selectedCryptoWallets[wallet.coin] || wallet.chains[0];
              return (
                <div
                  key={wallet.coin}
                  className="w-72 snap-center shrink-0 p-5 rounded-2xl  bg-gradient-to-br from-zinc-800 via-zinc-900 to-slate-900  text-white flex flex-col justify-between transition-all duration-300  shadow-md hover:scale-[1.03] space-y-4 border-2 border-stone-800"
                >
                  {/* Coin Header + Chain Dropdown */}
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={`/img/${wallet.coin.toLowerCase()}.png`}
                        alt={wallet.coin}
                        width={30}
                        height={30}
                      />
                      <span className="font-semibold text-lg">{wallet.coin}</span>
                    </div>

                    {/* Chain Dropdown */}
                    <select
                      value={selectedCryptoWallets[wallet.coin]?.chain || wallet.chains[0].chain}
                      onChange={(e) => handleSelectChain(wallet.coin, e.target.value, wallet.chains)}
                      className="bg-zinc-800 border border-zinc-800 text-stone-400 outline-none text-sm rounded-lg px-2 py-1 focus:ring-purple-500"
                    >
                      {wallet.chains.map((c: any) => (
                        <option key={c.chain} value={c.chain}>
                          {c.chain}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Balance */}
                  <div className="flex flex-col">
                    <span className="text-2xl font-black">
                      {selectedCryptoWallet?.balance || 0}
                      <span className="text-sm ml-1">{wallet.coin}</span>
                    </span>
                    <span className="text-[12px] text-stone-400">Balance</span>
                  </div>

                  {/* Address */}
                  {/* <div className="mt-1">
                    <span className="text-xs text-stone-400">Address</span>
                    <p className="text-sm font-mono text-stone-300 truncate">
                      {selectedCryptoWallet.address}
                    </p>
                  </div> */}

                  {/* Icon Action Buttons */}
                  <div className="flex items-center justify-end gap-4">
                    <button
                      onClick={() => openSendCryptoModal(selectedCryptoWallet)}
                      className="p-2 flex items-center justify-center bg-purple-600/20 border border-purple-600/30 rounded-xl hover:bg-purple-600/30"
                    >
                      <SendHorizonal size={18} className="text-purple-400" />
                    </button>

                    <button
                      onClick={() => openReceiveCryptoModal(selectedCryptoWallet)}
                      className="p-2 flex items-center justify-center bg-green-600/20 border border-green-600/30 rounded-xl hover:bg-green-600/30"
                    >
                      <Download size={18} className="text-green-400" />
                    </button>

                    <button
                      onClick={() => openSwapCryptoModal(selectedCryptoWallet)}
                      className="p-2 flex items-center justify-center bg-blue-600/20 border border-blue-600/30 rounded-xl hover:bg-blue-600/30"
                    >
                      <Repeat size={18} className="text-blue-400" />
                    </button>
                  </div>
                </div>

              );
            })}
          </div>
        </div>
      )}

      {cryptoWallet && <ReceiveCryptoModal wallet={cryptoWallet} />}
      {cryptoWallet && <SendCryptoModal wallet={cryptoWallet} />}
      {cryptoWallet && <SwapCryptoModal wallet={cryptoWallet} />}

      {/* Slider Section */}
      <ServicesSlider />

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
                <span className="text-base font-medium text-stone-100 truncate">{service.name}</span>
              </Link>
            ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="flex flex-col gap-6 mt-6 mb-8">
        <h1 className="text-xl font-black">Recent transactions</h1>
        <div className="flex flex-col gap-4">
          {loading ? (
            <p className="text-stone-400 text-center">Loading transactions...</p>
          ) : (
            <TransactionHistory transactions={transactions} compact={true} />
          )}
        </div>
      </div>
    </div>
  );
}
