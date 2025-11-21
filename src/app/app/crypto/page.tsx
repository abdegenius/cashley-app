"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Repeat } from "lucide-react";
import api from "@/lib/axios";
import { ApiResponse, Network, SUPPORTED_TOKENS, Token, TokenData } from "@/types/api";

export default function CryptoPage() {
    const [selected, setSelected] = useState<Token>(SUPPORTED_TOKENS[0]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [token, setToken] = useState<TokenData | null>(null);
    const [networks, setNetworks] = useState<Network[] | null>(null);
    const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
    const [isLoadingNetwork, setIsLoadingNetwork] = useState(false);

    const [amount, setAmount] = useState("");

    const dropdownRef = useRef<any>(null);

    // ============================
    //  FETCH TOKEN DATA (CHAINS)
    // ============================
    const getTokenData = async () => {
        setIsLoadingNetwork(true)
        try {
            const res = await api.get<ApiResponse>(
                `/crypto/token/${selected?.symbol}`
            );

            if (!res.data.error && res.data.data) {
                const data = res.data.data;
                const networks = data.length > 0 ? data[data.length - 1] : []
                setToken(data);
                setNetworks(networks);
                setSelectedNetwork(networks.length > 0 ? networks[0] : null);
            }
        } catch {

        } finally {
            setIsLoadingNetwork(false)
        }
    };

    useEffect(() => {
        getTokenData();
    }, [selected]);


    // ============================
    // DROPDOWN TOGGLE HANDLER
    // ============================
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    // close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    // ============================
    // HISTORY FETCHER
    // ============================
    const [history, setHistory] = useState([]);

    // const fetchHistory = async () => {
    //     const res = await api.get<ApiResponse>(`/crypto/transactions`);
    //     if (!res.data.error) setHistory(res.data.data || []);
    // };

    // useEffect(() => {
    //     fetchHistory();
    // }, []);

    // ============================
    // SWAP (UI ONLY)
    // ============================
    const [swapFrom, setSwapFrom] = useState("USDT");
    const [swapTo, setSwapTo] = useState("ETH");
    const [swapAmount, setSwapAmount] = useState("");

    return (
        <div className="w-full h-full p-4 space-y-8">
            {/* ================ */}
            {/* CRYPTO SELECTOR */}
            {/* ================ */}
            <div className="w-full bg-zinc-900 rounded-2xl p-5 space-y-4 border border-zinc-800">
                <span className="text-sm text-zinc-400">Select Coin</span>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={toggleDropdown}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition"
                    >
                        <div className="flex items-center gap-3">
                            <Image src={selected.icon} alt={selected.name} width={28} height={28} />
                            <span className="font-medium">{selected.name}</span>
                        </div>
                        <ChevronDown size={20} className="text-zinc-400" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-30">
                            {SUPPORTED_TOKENS.map((coin) => (
                                <button
                                    key={coin.id}
                                    onClick={() => {
                                        setSelected(coin);
                                        setDropdownOpen(false);
                                        setSelectedNetwork(null)
                                        setNetworks(null)
                                    }}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-zinc-800 transition text-left"
                                >
                                    <Image
                                        src={coin.icon}
                                        alt={coin.name}
                                        width={26}
                                        height={26}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <p className="text-sm font-medium">{coin.name}</p>
                                        <p className="text-xs text-zinc-500">{coin.symbol}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ===================== */}
            {/* NETWORK SELECTION TAB */}
            {/* ===================== */}
            {token && (
                <div className="w-full space-y-3">
                    <h2 className="text-sm text-zinc-400 font-medium">Select Network</h2>
                    {isLoadingNetwork &&
                        <p className="text-center w-full p-4 text-white">
                            Loading available network in selected coin...
                        </p>}
                    {networks?.length === 0 ? (
                        <p className="text-center w-full p-4 text-white">
                            No network available for selected token
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {networks?.map((chain: any) => (
                                <button
                                    key={chain.chain}
                                    onClick={() => setSelectedNetwork(chain)}
                                    className={`p-3 rounded-xl border text-left transition ${selectedNetwork?.chain === chain.chain
                                        ? "border-purple-500 bg-purple-500/10"
                                        : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
                                        }`}
                                >
                                    <p className="font-medium">{chain.chain}</p>
                                    <p className="text-xs text-zinc-400">
                                        Min Deposit: {chain.minDepositAmount}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}

                    {selectedNetwork && (
                        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm">
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Deposit Confirmations</span>
                                <span>{selectedNetwork.depositConfirm}</span>
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-zinc-400">Withdraw Confirmations</span>
                                <span>{selectedNetwork.withdrawConfirm}</span>
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-zinc-400">Min Withdraw</span>
                                <span>{selectedNetwork.minWithdrawAmount}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ================== */}
            {/* BUY / SELL CARD */}
            {/* ================== */}
            <div className="bg-gradient-to-br from-zinc-800 via-zinc-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg space-y-6">
                <div className="flex items-center gap-3">
                    <Image src={selected.icon} alt={selected.name} width={36} height={36} />
                    <div>
                        <h2 className="text-lg font-bold">{selected.name}</h2>
                        <p className="text-zinc-400 text-sm">{selected.symbol}</p>
                    </div>
                </div>

                <div>
                    <span className="text-xs text-zinc-400">Amount</span>
                    <input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="mt-1 w-full bg-transparent border-b border-zinc-600 focus:border-purple-400 outline-none py-2 text-xl font-semibold"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3">
                    <button className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition font-medium">
                        Buy {selected.symbol}
                    </button>
                    <button className="p-3 rounded-xl bg-red-600 hover:bg-red-500 transition font-medium">
                        Sell {selected.symbol}
                    </button>
                </div>
            </div>

            {/* ================== */}
            {/* SWAP SECTION */}
            {/* ================== */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 space-y-4">
                <h2 className="text-lg font-semibold">Swap Crypto</h2>

                <div className="flex items-center justify-between gap-3">
                    <input
                        className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-purple-500 outline-none"
                        placeholder="Amount"
                        value={swapAmount}
                        onChange={(e) => setSwapAmount(e.target.value)}
                    />

                    <Repeat size={20} className="text-zinc-400" />
                </div>

                <div className="flex gap-3">
                    <select
                        value={swapFrom}
                        onChange={(e) => setSwapFrom(e.target.value)}
                        className="w-full bg-zinc-800 p-3 rounded-xl border border-zinc-700"
                    >
                        {SUPPORTED_TOKENS.map((c) => (
                            <option key={c.symbol}>{c.symbol}</option>
                        ))}
                    </select>
                    <select
                        value={swapTo}
                        onChange={(e) => setSwapTo(e.target.value)}
                        className="w-full bg-zinc-800 p-3 rounded-xl border border-zinc-700"
                    >
                        {SUPPORTED_TOKENS.map((c) => (
                            <option key={c.symbol}>{c.symbol}</option>
                        ))}
                    </select>
                </div>

                <button className="w-full p-3 bg-purple-600 hover:bg-purple-500 transition rounded-xl font-medium">
                    Swap
                </button>
            </div>

            {/* ================== */}
            {/* TRANSACTION HISTORY */}
            {/* ================== */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Crypto History</h2>

                <div className="space-y-3">
                    {history.length === 0 ? (
                        <p className="text-zinc-500 text-sm">No crypto transactions yet.</p>
                    ) : (
                        history.map((tx: any, idx: number) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl"
                            >
                                <div>
                                    <p className="font-medium">{tx.type}</p>
                                    <p className="text-xs text-zinc-500">{tx.date}</p>
                                </div>
                                <p className="font-semibold">{tx.amount}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
