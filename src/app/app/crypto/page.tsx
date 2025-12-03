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
import { SelectCoin } from "./partials/SelectCoin";
import { AssetChain, CryptoWallet, UserCryptoWallet, WalletAsset } from "@/types/api";
import { SelectChain } from "./partials/SelectChain";
import ReceiveCryptoModal from "@/components/ReceiveCrypto";
import { receiveCryptoModal } from "@/controllers/receive-crypto-modal";
import { swapCryptoModal } from "@/controllers/swap-crypto-modal";
import { sendCryptoModal } from "@/controllers/send-crypto-modal";
import SendCryptoModal from "@/components/SendCrypto";
import SwapCryptoModal from "@/components/SwapCrypto";


export default function CryptoPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [selectedCoin, setSelectedCoin] = useState<SupportedCoin | null>(null);
    const [selectedChain, setSelectedChain] = useState<AssetChain | null>(null);
    const [showChainModal, setShowChainModal] = useState(false);
    const [walletAsset, setWalletAsset] = useState<WalletAsset | null>(null);

    // data states
    const [wallets, setWallets] = useState<UserCryptoWallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<UserCryptoWallet | null>(null);

    // loading states
    const [isCreatingWallet, setIsCreatingWallet] = useState<boolean>(false);
    const [isLoadingWalletAsset, setIsLoadingWalletAsset] = useState<boolean>(false);

    const [cryptoWallet, setCryptoWallet] = useState<CryptoWallet | null>(null);

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


    const openSendCryptoModal = (wallet: UserCryptoWallet | null) => {
        if (!wallet) return;
        setCryptoWallet({
            reference: wallet.reference,
            coin: wallet.coin,
            chain: wallet.chain,
            address: wallet.address,
            network: wallet.network,
            tag: wallet.tag,
            balance: walletAsset?.balance ?? 0,
        })
        receiveCryptoModal.close()
        swapCryptoModal.close()
        sendCryptoModal.open()
    };

    const openReceiveCryptoModal = (wallet: UserCryptoWallet | null) => {
        if (!wallet) return;
        setCryptoWallet({
            reference: wallet.reference,
            coin: wallet.coin,
            chain: wallet.chain,
            address: wallet.address,
            network: wallet.network,
            tag: wallet.tag,
            balance: walletAsset?.balance ?? 0,
        })
        sendCryptoModal.close()
        swapCryptoModal.close()
        receiveCryptoModal.open()
    };

    const openSwapCryptoModal = (wallet: UserCryptoWallet | null) => {
        if (!wallet) return;
        setCryptoWallet({
            reference: wallet.reference,
            coin: wallet.coin,
            chain: wallet.chain,
            address: wallet.address,
            network: wallet.network,
            tag: wallet.tag,
            balance: walletAsset?.balance ?? 0,
        })
        sendCryptoModal.close()
        swapCryptoModal.open()
        receiveCryptoModal.close()
    };

    return (
        <div className="w-full h-full p-5 space-y-6">

            {/* COIN SELECTION */}
            {(!selectedCoin || !selectedChain) && (
                <SelectCoin coin={selectedCoin} onSelect={handleSelectCoin} />
            )}

            {/* MAIN WALLET PAGE */}
            {selectedCoin && selectedChain && (
                <div className="space-y-6 animate-fadeIn">

                    {/* TOP BAR */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setSelectedChain(null);
                                setSelectedWallet(null);
                            }}
                            className="p-2 rounded-full hover:bg-white/5 transition"
                        >
                            <ArrowLeft className="w-6 h-6 text-stone-300" />
                        </button>

                        <h1 className="text-xl font-semibold tracking-tight">
                            {CRYPTO_ASSETS[selectedCoin].name} Wallet
                        </h1>
                    </div>

                    {/* WALLET CARD */}
                    <div className="
                    relative rounded-3xl p-6
                    bg-gradient-to-br from-[#111113] via-[#0f0f12] to-[#101014]
                    backdrop-blur-xl border border-white/10 shadow-2xl
                    overflow-hidden
                ">
                        {/* glowing accent */}
                        <div className="absolute inset-0 bg-purple-600/10 blur-3xl opacity-30" />

                        {/* header */}
                        <div className="relative flex items-center gap-4">
                            <Image
                                src={CRYPTO_ASSETS[selectedCoin].logo}
                                width={52}
                                height={52}
                                alt={CRYPTO_ASSETS[selectedCoin].name}
                                className="rounded-full"
                            />

                            <div>
                                <h2 className="text-lg font-semibold">
                                    {CRYPTO_ASSETS[selectedCoin].name}
                                </h2>
                                <p className="text-stone-400 text-sm">
                                    {CRYPTO_ASSETS[selectedCoin].symbol}
                                </p>
                                <p className="text-xs text-purple-300 mt-1">
                                    Network → {selectedChain.chain}
                                </p>
                            </div>
                        </div>

                        {/* BALANCE */}
                        {selectedWallet && (
                            <div className="relative mt-6 space-y-2">
                                {!isLoadingWalletAsset ? (
                                    walletAsset ? (
                                        <p className="text-3xl font-bold tracking-tight">
                                            {walletAsset.balance}
                                            <span className="pl-2 text-stone-500 text-lg">
                                                {walletAsset.coin}
                                            </span>
                                        </p>
                                    ) : (
                                        <p className="text-3xl font-bold tracking-tight opacity-50">
                                            ---
                                        </p>
                                    )
                                ) : (
                                    <p className="text-xl animate-pulse">Loading...</p>
                                )}

                                <p className="text-xs text-stone-500">Available Balance</p>
                            </div>
                        )}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="grid grid-cols-3 gap-4">

                        <ActionButton
                            icon={<SendHorizontal className="w-6 h-6" />}
                            label="Send"
                            onClick={() => openSendCryptoModal(selectedWallet)}
                        />

                        <ActionButton
                            icon={<Download className="w-6 h-6" />}
                            label="Receive"
                            onClick={() => openReceiveCryptoModal(selectedWallet)}
                        />

                        <ActionButton
                            icon={<RefreshCw className="w-6 h-6" />}
                            label="Swap"
                            onClick={() => openSwapCryptoModal(selectedWallet)}
                        />
                    </div>
                </div>
            )}

            {/* SELECT CHAIN */}
            {showChainModal && (
                <SelectChain
                    coin={selectedCoin as SupportedCoin}
                    onClose={() => setShowChainModal(false)}
                    onSelect={handleSelectedChain}
                />
            )}

            {/* MODALS */}
            {selectedWallet && <ReceiveCryptoModal wallet={selectedWallet} />}
            {selectedWallet && <SendCryptoModal wallet={selectedWallet} />}
            {selectedWallet && walletAsset && <SwapCryptoModal wallet={selectedWallet} />}

            {/* WALLET CREATION LOADING */}
            {isCreatingWallet && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <p className="animate-pulse text-sm">Creating wallet, please wait...</p>
                </div>
            )}
        </div>
    );
}
const ActionButton = ({ icon, label, onClick }: any) => (
    <button
        onClick={onClick}
        className="
            flex flex-col items-center gap-2 p-4 rounded-xl
            bg-white/5 hover:bg-white/10
            transition-all backdrop-blur-md
            border border-white/10
            hover:shadow-lg hover:-translate-y-0.5
        "
    >
        <div className="text-stone-300">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
    </button>
);
