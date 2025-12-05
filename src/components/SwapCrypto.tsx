"use client";

import Modal from "./ui/Modal";
import { swapCryptoModal } from "@/controllers/swap-crypto-modal";
import { useEffect, useState, useCallback, useMemo } from "react";
import { X, ArrowDownUp } from "lucide-react";
import api from "@/lib/axios";
import { CryptoWallet, Rate } from "@/types/api";
import toast from "react-hot-toast";
import { formatToNGN } from "@/utils/amount";

const coinLogo = (coin: string) => `/img/${coin.toLowerCase()}.png`;

interface SwapCryptoProps {
    wallet: CryptoWallet;
}

const SwapCryptoModal = ({ wallet }: SwapCryptoProps) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        swapCryptoModal.register(setShow);
    }, []);

    const numericBalance = Number(wallet.balance) || 0;

    const [swapAmount, setSwapAmount] = useState<number>(0);
    const [rate, setRate] = useState<Rate | null>(null);

    const [loadingRate, setLoadingRate] = useState(false);
    const [isSwapping, setIsSwapping] = useState(false);

    const amountValid = swapAmount > 0 && !isNaN(swapAmount);

    /* -------------------- Debounce Function -------------------- */
    const debounce = <T extends any[]>(fn: (...args: T) => void, delay = 400) => {
        let timer: NodeJS.Timeout;
        return (...args: T) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    /* -------------------- Fetch Rate -------------------- */
    const fetchRateFn = async (amount: number) => {
        if (amount <= 0) return;

        setLoadingRate(true);
        try {
            const res = await api.post("/crypto/rate", {
                coin: wallet.coin,
                amount,
            });
            if (!res.data.error) setRate(res.data.data);
        } catch {
            toast.error("Unable to fetch exchange rate");
        } finally {
            setLoadingRate(false);
        }
    };

    const fetchRate = useCallback(debounce(fetchRateFn, 400), [wallet.coin]);

    useEffect(() => {
        if (!amountValid) return setRate(null);
        fetchRate(swapAmount);
    }, [swapAmount, amountValid, fetchRate]);

    const insufficientBalance = swapAmount > numericBalance;
    const zeroAmount = swapAmount === 0;

    const finalNgnValue = useMemo(() => {
        if (!rate) return 0;
        return Math.max(rate.ngn_value || 0, 0);
    }, [rate]);

    const buttonLabel = useMemo(() => {
        if (zeroAmount) return "Enter an amount";
        if (insufficientBalance) return "Insufficient balance";
        return "Confirm Swap";
    }, [zeroAmount, insufficientBalance]);

    const buttonDisabled = zeroAmount || insufficientBalance;

    /* -------------------- HANDLE SWAP -------------------- */
    const handleSwap = async () => {
        setIsSwapping(true);
        try {
            const res = await api.post("/crypto/swap", {
                coin: wallet.coin,
                amount: swapAmount,
                reference: wallet.reference,
            });

            if (!res.data.error) toast.success("Token swap successfully processed");
            else toast.error(res.data.message);
        } catch {
            toast.error("Unable to process swap");
        } finally {
            setIsSwapping(false);
        }
    };


    return (
        <Modal show={show} onClose={() => setShow(false)}>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 animate-fadeIn">

                <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/70 to-slate-900/80
            border border-white/10 rounded-2xl w-11/12 max-w-md p-6 shadow-2xl space-y-6 animate-slideUp">

                    {/* HEADER */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                                <img
                                    src={coinLogo(wallet.coin)}
                                    alt={wallet.coin}
                                    className="w-7 h-7 object-contain"
                                />
                            </div>

                            <h2 className="text-lg font-semibold text-white tracking-tight">
                                Swap {wallet.coin}
                            </h2>
                        </div>

                        <button
                            onClick={() => setShow(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition"
                        >
                            <X size={22} />
                        </button>
                    </div>

                    {/* INPUT GROUP */}
                    <div className="space-y-5">

                        {/* AMOUNT INPUT */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Amount to Swap</label>

                            <div className="bg-black/20 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                                <input
                                    type="number"
                                    value={swapAmount}
                                    min={0}
                                    onChange={(e) => setSwapAmount(Number(e.target.value) || 0)}
                                    placeholder="0.00"
                                    className="bg-transparent focus:outline-none w-full text-white text-lg font-medium"
                                />

                                <img
                                    src={coinLogo(wallet.coin)}
                                    className="w-6 h-6 opacity-80"
                                />
                            </div>

                            {/* Balance Row */}
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Balance: <b>{wallet.balance} {wallet.coin}</b></span>
                                <button
                                    onClick={() => setSwapAmount(numericBalance)}
                                    className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-gray-300 hover:text-white transition"
                                >
                                    Max
                                </button>
                            </div>
                        </div>

                        {/* RECEIVE PREVIEW */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">You Will Receive</label>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                {loadingRate ? (
                                    <p className="text-gray-400 animate-pulse text-lg">Calculating...</p>
                                ) : (
                                    <p className="text-2xl font-bold text-white tracking-tight">
                                        ₦{finalNgnValue.toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* DETAILS */}
                        <div className="text-xs text-gray-400 space-y-1">
                            {amountValid && (rate || loadingRate) ? (
                                <>
                                    {loadingRate ? (
                                        <p className="animate-pulse">Fetching exchange rate...</p>
                                    ) : (
                                        <div>
                                            <p>${rate?.usd_rate?.toLocaleString()} / {wallet.coin}</p>
                                            <p>Rate: {formatToNGN(rate?.ngn_rate)} </p>
                                        </div>
                                    )}

                                    {!loadingRate && (
                                        <p className="text-gray-200 font-medium">
                                            NGN Value: <b>₦{finalNgnValue.toLocaleString()}</b>
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p>Enter an amount to view swap details.</p>
                            )}
                        </div>

                        {/* ACTION BUTTON */}
                        <button
                            onClick={handleSwap}
                            disabled={buttonDisabled || isSwapping}
                            className={`w-full py-3 rounded-xl font-semibold transition-all
                ${buttonDisabled || isSwapping
                                    ? "bg-white/5 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                                }`}
                        >
                            {isSwapping ? "Processing..." : buttonLabel}
                        </button>

                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SwapCryptoModal;
