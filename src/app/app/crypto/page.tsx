"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
    ArrowLeft,
    SendHorizontal,
    Download,
    RefreshCw,
} from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { CRYPTO_ASSETS } from "@/utils/assets";
import { SupportedCoin } from "@/types";
import { ReceiveCrypto } from "./partials/Receive";
import { SwapCrypto } from "./partials/Swap";
import { SendCrypto } from "./partials/Send";
import { SelectCoin } from "./partials/SelectCoin";
import { AssetChain, UserCryptoWallet, WalletAsset } from "@/types/api";
import { SelectChain } from "./partials/SelectChain";


export default function CryptoPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [selectedCoin, setSelectedCoin] = useState<SupportedCoin | null>(null);
    const [selectedChain, setSelectedChain] = useState<AssetChain | null>(null);
    const [showChainModal, setShowChainModal] = useState(false);
    const [walletAsset, setWalletAsset] = useState<WalletAsset | null>(null);

    const [showSendModal, setShowSendModal] = useState(false);
    const [showReceiveModal, setShowReceiveModal] = useState(false);
    const [showSwapModal, setShowSwapModal] = useState(false);

    // data states
    const [wallets, setWallets] = useState<UserCryptoWallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<UserCryptoWallet | null>(null);

    // loading states
    const [isCreatingWallet, setIsCreatingWallet] = useState<boolean>(false);
    const [isLoadingWalletAsset, setIsLoadingWalletAsset] = useState<boolean>(false);

    const getWalletAsset = useCallback(async () => {
        if (!selectedWallet) {
            toast.error("Please select a wallet")
            return;
        }
        setIsLoadingWalletAsset(true)
        try {
            const res = await api.get(`/crypto/wallet-balance/${selectedWallet?.reference}`);
            if (!res.data.error && res.data.data) {
                setWalletAsset(res.data.data);
            } else {
                toast.error("Failed to load wallet balance");
            }
        } catch {
        } finally {
            setIsLoadingWalletAsset(false)
        }
    }, [selectedWallet]);
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
        if (selectedWallet)
            getWalletAsset();
    }, [selectedWallet])

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


    const handleSelectedChain = async (chain: AssetChain) => {
        setSelectedChain(chain);
        setShowChainModal(false);

        const existing = wallets.find(
            (w) => w.coin === selectedCoin && w.chain === chain.chain
        );

        if (existing) {
            setSelectedWallet(existing);
            return;
        }

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

            await loadWallets();

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

    const handleSelectCoin = async (coin: SupportedCoin) => {
        if (!coin) return null;
        setSelectedCoin(coin);
        setShowChainModal(true);
    }

    useEffect(() => {
        if (!selectedCoin || !selectedChain) return;
        const w = wallets.find(
            (w) => w.coin === selectedCoin && w.chain === selectedChain.chain
        );
        setSelectedWallet(w || null);
    }, [wallets, selectedChain, selectedCoin]);

    return (
        <div className="w-full h-full p-4 space-y-6">

            {(!selectedCoin || !selectedChain) && (<SelectCoin coin={selectedCoin} onSelect={handleSelectCoin} />)}

            {selectedCoin && selectedChain && (
                <div className="space-y-6 animate-fadeIn">

                    {/* Back button */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                // setSelectedCoin(null);
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
                        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-purple-600/20 to-purple-600/20 blur-3xl" />

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
                            <div className="relative mt-2 space-y-1">
                                {!isLoadingWalletAsset ?
                                    walletAsset ? <p className="text-2xl font-bold tracking-tight">
                                        {walletAsset.balance}
                                        <span className="pl-2 text-stone-400">
                                            {walletAsset.coin}
                                        </span>
                                    </p> : <p className="text-2xl font-bold tracking-tight">---</p>
                                    :
                                    <p className="text-2xl animate-pulse">...</p>}

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

            {/* SELECT CHAIN */}
            {showChainModal && (
                <SelectChain coin={selectedCoin as unknown as SupportedCoin} onClose={() => setShowChainModal(false)} onSelect={handleSelectedChain} />
            )}

            {/* RECEIVE MODAL */}
            {showReceiveModal && selectedWallet && (
                <ReceiveCrypto coin={selectedWallet.coin as unknown as SupportedCoin} address={selectedWallet.address} tag={selectedWallet.tag} onClose={() => setShowReceiveModal(false)} />
            )}

            {/* SEND MODAL */}
            {showSendModal && selectedWallet && (
                <SendCrypto coin={selectedWallet.coin as unknown as SupportedCoin} onClose={() => setShowSendModal(false)} />
            )}

            {/* SWAP MODAL */}
            {showSwapModal && selectedWallet && walletAsset && (
                <SwapCrypto reference={selectedWallet.reference} coin={selectedWallet.coin as unknown as SupportedCoin} balance={walletAsset?.balance} onClose={() => setShowSwapModal(false)} />
            )}

            {/* CREATING WALLET LOADER */}
            {isCreatingWallet && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
                    <p className="animate-pulse text-sm">Creating wallet, please wait...</p>
                </div>
            )}

        </div>
    );
}

const ActionButton = ({ icon, label, onClick }: any) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-2 bg-stone-900/40 p-4 rounded-xl hover:bg-stone-800 transition shadow-sm hover:shadow-md"
    >
        {icon}
        <span className="text-md font-medium">{label}</span>
    </button>
);

