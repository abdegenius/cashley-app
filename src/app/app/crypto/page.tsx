"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import {
    ArrowLeft,
    Info,
    SendHorizontal,
    Download,
    RefreshCw,
    X,
} from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { CRYPTO_ASSETS, CryptoSymbol } from "@/utils/assets";

interface AssetChain {
    chain: string;
    needTag: string;
    depositConfirm: string;
    withdrawConfirm: string;
    minDepositAmount: string;
    minWithdrawAmount: string;
    txUrl: string;
}

interface UserCryptoWallet {
    id: string;
    key: string;
    reference: string;
    coin: string;
    chain: string;
    network: string;
    tag: string;
    status: boolean;
    address: string;
    balance: number;
    created_at: string;
    updated_at: string;
}
interface WithdrawFee {
    coin: string;
    chain: string;
    withdrawFee: string;
    minWithdrawAmount: string;
    withdrawable: string;
}
export default function CryptoPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    // UI states
    const [selectedCoin, setSelectedCoin] = useState<CryptoSymbol | null>(null);
    const [selectedChain, setSelectedChain] = useState<AssetChain | null>(null);
    const [showInfo, setShowInfo] = useState<CryptoSymbol | null>(null);
    const [withdrawalAmount, setWithdrawalAmount] = useState<number | "">("");
    const [withdrawalAddress, setWithdrawalAddress] = useState<string | "">("");
    const [withdrawalMemo, setWithdrawalMemo] = useState<string | "">("");
    const [showChainModal, setShowChainModal] = useState(false);
    const [withdrawalFee, setWithdrawalFee] = useState<WithdrawFee | null>(null);

    const [showSendModal, setShowSendModal] = useState(false);
    const [showReceiveModal, setShowReceiveModal] = useState(false);
    const [showSwapModal, setShowSwapModal] = useState(false);

    // data states
    const [wallets, setWallets] = useState<UserCryptoWallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<UserCryptoWallet | null>(null);
    const [chains, setChains] = useState<AssetChain[]>([]);

    // loading states
    const [isLoadingChains, setIsLoadingChains] = useState<boolean>(false);
    const [isCreatingWallet, setIsCreatingWallet] = useState<boolean>(false);
    const [isLoadingWithdrawalFee, setIsLoadingWithdrawalFee] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);

    const getWithdrawalFee = useCallback(async () => {
        if (!selectedWallet) toast.error("Please select a wallet")
        setIsLoadingWithdrawalFee(true)
        try {
            const res = await api.post("/crypto/estimate-fee", { reference: selectedWallet?.reference, amount: withdrawalAmount });
            if (!res.data.error) {
                setWithdrawalFee(res.data.data);
            }
        } catch {
            toast.error("Failed to load withdrawal fee");
        } finally {
            setIsLoadingWithdrawalFee(false)
        }
    }, [selectedWallet, withdrawalAmount]);

    const handleTransfer = async () => {
        if (!withdrawalFee) toast.error("Estimated fee not calculated")
        setIsSending(true)
        try {
            const res = await api.post("/crypto/transfer", { reference: selectedWallet?.reference, fee: withdrawalFee?.withdrawFee, amount: withdrawalAmount });
            if (!res.data.error) {
                toast.success("Withdrawal request is processing..")
            }
            toast.error(res.data.message || "Failed to process withdrawal");

        } catch {
            toast.error("Failed to process withdrawal");
        } finally {
            setIsSending(false)
        }
    }

    /** -----------------------------
     * Load User Wallets
     * ------------------------------ */
    const loadWallets = useCallback(async () => {
        try {
            const res = await api.get("/crypto-wallet/user");
            if (!res.data.error) setWallets(res.data.data || []);
        } catch {
            toast.error("Failed to load wallets");
        }
    }, []);

    useEffect(() => {
        loadWallets();
    }, [loadWallets]);

    useEffect(() => {
        if (!withdrawalAmount || withdrawalAmount <= 0) return;
        getWithdrawalFee();
    }, [withdrawalAmount])

    /** -----------------------------
     * Auto-setup crypto profile
     * ------------------------------ */
    useEffect(() => {
        if (loading) return;
        if (!user?.crypto_id) {
            (async () => {
                try {
                    const r = await api.post("/crypto/setup");
                    if (r.data.error) return toast.error(r.data.message);
                    toast.success("Crypto profile ready!");
                    router.refresh();
                } catch {
                    toast.error("Failed to initialize crypto profile");
                }
            })();
        }
    }, [user, loading]);

    /** -----------------------------
     * Select coin → open chain list
     * ------------------------------ */
    useEffect(() => {
        if (!selectedCoin) return;

        (async () => {
            setIsLoadingChains(true);
            try {
                const res = await api.get(`/crypto/token/${selectedCoin}`);
                if (!res.data.error) {
                    setChains(res.data.data?.[2] || []);
                    setShowChainModal(true);
                }
            } catch {
                toast.error("Failed to load chains");
            } finally {
                setIsLoadingChains(false);
            }
        })();
    }, [selectedCoin]);

    /** -----------------------------
     * When chain selected:
     * 1. Check if wallet exists → select it
     * 2. If not, create wallet → reload wallets → select
     * ------------------------------ */
    const handleChainSelect = async (chain: AssetChain) => {
        setSelectedChain(chain);
        setShowChainModal(false);

        // Step 1: does wallet already exist?
        const existing = wallets.find(
            (w) => w.coin === selectedCoin && w.chain === chain.chain
        );

        if (existing) {
            setSelectedWallet(existing);
            return;
        }

        // Step 2: create new wallet
        try {
            setIsCreatingWallet(true);

            const res = await api.post("/crypto/create-wallet", {
                coin: selectedCoin,
                chain: chain.chain,
            });

            if (res.data.error) {
                toast.error(res.data.message);
                return;
            }

            toast.success("Wallet created successfully");

            // refresh wallet list
            await loadWallets();

            // auto-select new wallet
            const newWallet = wallets.find(
                (w) => w.coin === selectedCoin && w.chain === chain.chain
            );

            setSelectedWallet(newWallet || null);
        } catch {
            toast.error("Failed to create wallet");
        } finally {
            setIsCreatingWallet(false);
        }
    };

    /** -----------------------------
     * Select wallet when chain changes (after refresh)
     * ------------------------------ */
    useEffect(() => {
        if (!selectedCoin || !selectedChain) return;
        const w = wallets.find(
            (w) => w.coin === selectedCoin && w.chain === selectedChain.chain
        );
        setSelectedWallet(w || null);
    }, [wallets, selectedChain, selectedCoin]);

    const activeAssets = Object.entries(CRYPTO_ASSETS).filter(([_, a]) => a.active);

    return (
        <div className="w-full h-full p-4 space-y-6">

            {/* ----------------------------- */}
            {/* COIN LIST */}
            {/* ----------------------------- */}
            {!selectedCoin && (
                <>
                    <h1 className="text-xl font-semibold">Available Crypto Assets</h1>

                    <div className="space-y-4">
                        {activeAssets.map(([symbol, asset]) => (
                            <div
                                key={symbol}
                                onClick={() => setSelectedCoin(symbol as CryptoSymbol)}
                                className="flex items-center justify-between bg-card px-4 py-3 rounded-xl border border-stone-800 shadow-sm hover:shadow-md transition cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <Image src={asset.logo} width={40} height={40} alt={asset.name} className="rounded-full" />
                                    <div>
                                        <p className="font-semibold">{asset.name}</p>
                                        <p className="text-stone-400 text-sm">{asset.symbol}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowInfo(showInfo === symbol ? null : (symbol as CryptoSymbol));
                                    }}
                                    className="p-2 hover:bg-stone-700/40 rounded-full"
                                >
                                    <Info className="w-5 h-5 text-stone-400" />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ----------------------------- */}
            {/* WALLET DISPLAY + ACTIONS */}
            {/* ----------------------------- */}
            {selectedCoin && selectedChain && (
                <div className="space-y-6 animate-fadeIn">

                    {/* Back button */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setSelectedCoin(null);
                                setSelectedChain(null);
                                setSelectedWallet(null);
                            }}
                            className="p-2 rounded-full hover:bg-stone-700/30"
                        >
                            <ArrowLeft className="w-6 h-6 text-stone-300" />
                        </button>
                        <h1 className="text-xl font-semibold">
                            {CRYPTO_ASSETS[selectedCoin].name} Wallet
                        </h1>
                    </div>

                    {/* WALLET CARD */}
                    <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 border border-stone-700 rounded-2xl p-6 shadow-xl space-y-5 relative overflow-hidden">

                        {/* Accent glow */}
                        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-3xl" />

                        <div className="relative flex items-center gap-4">
                            <Image
                                src={CRYPTO_ASSETS[selectedCoin].logo}
                                width={60}
                                height={60}
                                alt={CRYPTO_ASSETS[selectedCoin].name}
                                className="rounded-full"
                            />
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {CRYPTO_ASSETS[selectedCoin].name}
                                </h2>
                                <p className="text-stone-400 text-sm">{CRYPTO_ASSETS[selectedCoin].symbol}</p>
                                <p className="text-xs text-purple-300 mt-1">Network: {selectedChain.chain}</p>
                            </div>
                        </div>

                        {/* Balance */}
                        {selectedWallet && (
                            <div className="relative mt-4 space-y-2">
                                <p className="text-4xl font-bold tracking-tight">
                                    {selectedWallet.balance}
                                    <span className="text-sm ml-2 text-stone-400">
                                        {selectedWallet.coin}
                                    </span>
                                </p>

                                <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
                                    <span>Available Balance</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ACTIONS */}
                    <div className="grid grid-cols-3 gap-4">
                        <ActionButton
                            icon={<SendHorizontal className="w-6 h-6 text-stone-600" />}
                            label="Send"
                            onClick={() => setShowSendModal(true)}
                        />

                        <ActionButton
                            icon={<Download className="w-6 h-6 text-stone-600" />}
                            label="Receive"
                            onClick={() => setShowReceiveModal(true)}
                        />

                        <ActionButton
                            icon={<RefreshCw className="w-6 h-6 text-stone-600" />}
                            label="Swap"
                            onClick={() => setShowSwapModal(true)}
                        />
                    </div>
                </div>
            )}

            {/* ----------------------------- */}
            {/* LOADING CHAINS */}
            {/* ----------------------------- */}
            {selectedCoin && isLoadingChains && (
                <p className="text-center flex min-h-[80vh] items-center justify-center animate-pulse">
                    Loading chains/networks...
                </p>
            )}

            {/* ----------------------------- */}
            {/* NETWORK SELECT MODAL */}
            {/* ----------------------------- */}
            {showChainModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="bg-card w-11/12 max-w-md p-6 rounded-2xl border border-stone-800 shadow-xl space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Select Network</h2>
                            <button onClick={() => setShowChainModal(false)} className="p-2 hover:bg-stone-700/40 rounded-full">
                                <X size={22} />
                            </button>
                        </div>

                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {chains.map((chain) => (
                                <button
                                    key={chain.chain}
                                    onClick={() => handleChainSelect(chain)}
                                    className="w-full bg-card border border-stone-700 hover:border-purple-400 hover:bg-stone-800 transition rounded-xl p-4 text-left flex justify-between items-center"
                                >
                                    <div>
                                        <p className="text-base font-semibold">{chain.chain}</p>
                                        <p className="text-xs text-stone-400 mt-1">Min Deposit: {chain.minDepositAmount}</p>
                                        <p className="text-xs text-stone-400">Confirms: {chain.depositConfirm}</p>
                                        {chain.needTag === "true" && (
                                            <p className="text-xs text-amber-400 mt-1">⚠ Requires Tag/Memo</p>
                                        )}
                                    </div>
                                    <span className="text-purple-400 font-medium">Select</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ----------------------------- */}
            {/* WALLET CREATION OVERLAY */}
            {/* ----------------------------- */}
            {isCreatingWallet && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
                    <p className="animate-pulse text-sm">Creating wallet, please wait...</p>
                </div>
            )}

            {/* RECEIVE MODAL */}
            {showReceiveModal && selectedWallet && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="bg-card w-11/12 max-w-md p-6 rounded-2xl border border-stone-800 shadow-xl space-y-6">

                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Receive {selectedWallet.coin}</h2>
                            <button onClick={() => setShowReceiveModal(false)} className="p-2 hover:bg-stone-700/40 rounded-full">
                                <X size={22} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center space-y-4">
                            <QRCode value={selectedWallet.address} size={160} />

                            <div className="text-center">
                                <p className="text-sm text-stone-300 break-all font-mono">{selectedWallet.address}</p>

                                {selectedWallet.tag && (
                                    <p className="text-xs text-amber-400 mt-2">
                                        ⚠ Tag/Memo Required: {selectedWallet.tag}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(selectedWallet.address);
                                    toast.success("Address copied");
                                }}
                                className="w-full py-3 bg-purple-600/80 hover:bg-purple-600 rounded-xl font-medium text-white"
                            >
                                Copy Address
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SEND MODAL */}
            {showSendModal && selectedWallet && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="bg-card w-11/12 max-w-md p-6 rounded-2xl border border-stone-800 shadow-xl space-y-6">

                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Send {selectedWallet.coin}</h2>
                            <button onClick={() => setShowSendModal(false)} className="p-2 hover:bg-stone-700/40 rounded-full">
                                <X size={22} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-stone-300">Recipient Address</label>
                                <input
                                    type="text"
                                    value={withdrawalAddress}
                                    onChange={(e) => setWithdrawalAddress(e.target.value)}
                                    className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl p-3"
                                    placeholder="Enter wallet address"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-stone-300">Amount</label>
                                <input
                                    type="number"
                                    value={withdrawalAmount}
                                    onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                                    className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl p-3"
                                    placeholder="0.00"
                                />
                            </div>
                            {withdrawalFee && <p className="w-full text-right text-xs">
                                Estimate Withdrawal Fee: {withdrawalFee.withdrawFee} {withdrawalFee.coin}
                            </p>}

                            <div className="text-xs text-stone-400">
                                Network Fee applies depending on network congestion.
                            </div>

                            <button onClick={handleTransfer} disabled={isLoadingWithdrawalFee || !withdrawalAmount || !withdrawalAddress || !withdrawalFee} className="w-full py-3 bg-purple-600/80 hover:bg-purple-600 rounded-xl font-medium text-white">
                                {isLoadingWithdrawalFee ? "Please Wait..." : (isSending ? "Sending..." : "Send Now")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SWAP MODAL */}
            {showSwapModal && selectedWallet && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="bg-card w-11/12 max-w-md p-6 rounded-2xl border border-stone-800 shadow-xl space-y-6">

                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Swap {selectedWallet.coin}</h2>
                            <button onClick={() => setShowSwapModal(false)} className="p-2 hover:bg-stone-700/40 rounded-full">
                                <X size={22} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-center py-12">
                                Feature not currently available
                            </p>
                            {/* <div>
                                <label className="text-sm text-stone-300">From</label>
                                <input
                                    type="number"
                                    className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl p-3"
                                    placeholder="Amount"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-stone-300">To</label>
                                <select className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl p-3">
                                    <option>BTC</option>
                                    <option>ETH</option>
                                    <option>USDT</option>
                                </select>
                            </div>

                            <div className="text-xs text-stone-400">
                                Estimated quote preview will appear here.
                            </div>

                            <button className="w-full py-3 bg-blue-600/80 hover:bg-blue-600 rounded-xl font-medium text-white">
                                Get Quote
                            </button> */}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

/** Action Button Component */
const ActionButton = ({ icon, label, onClick }: any) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-2 bg-stone-900/40 p-4 rounded-xl hover:bg-stone-800 transition shadow-sm hover:shadow-md"
    >
        {icon}
        <span className="text-md font-medium">{label}</span>
    </button>
);

