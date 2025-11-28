"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { X } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { SupportedCoin } from "@/types";
import { Rate } from "@/types/api";

interface SwapCryptoProps {
    reference?: string;
    coin: SupportedCoin;
    balance: string;
    onClose: () => void;
}

export function SwapCrypto({ reference, coin, balance, onClose }: SwapCryptoProps) {
    const numericBalance = Number(balance) || 0;

    const [swapAmount, setSwapAmount] = useState<number>(0);
    const [rate, setRate] = useState<Rate | null>(null);

    const [loadingRate, setLoadingRate] = useState(false);
    const [isSwapping, setIsSwapping] = useState(false);

    const amountValid = swapAmount > 0 && !isNaN(swapAmount);

    // Properly typed debounce
    const debounce = <T extends any[]>(fn: (...args: T) => void, delay = 400) => {
        let timer: NodeJS.Timeout;
        return (...args: T) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    // Fetch rate function
    const fetchRateFn = async (amount: number) => {
        if (amount <= 0) return;
        setLoadingRate(true);
        try {
            const res = await api.post("/crypto/rate", { coin, amount });
            if (!res.data.error) setRate(res.data.data);
        } catch {
            toast.error("Unable to fetch exchange rate");
        } finally {
            setLoadingRate(false);
        }
    };

    // Debounced version wrapped with useCallback
    const fetchRate = useCallback(debounce(fetchRateFn, 400), [coin]);

    useEffect(() => {
        if (!amountValid) {
            setRate(null);
            return;
        }
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

    const handleSwap = async () => {
        setIsSwapping(true);
        try {
            const res = await api.post("/crypto/swap", {
                coin,
                amount: swapAmount,
                reference,
            });

            if (!res.data.error) toast.success("Token swap successfully processed...");
            else toast.error(res.data.message);
        } catch {
            toast.error("Unable to process swap");
        } finally {
            setIsSwapping(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-card w-11/12 max-w-md p-6 rounded-2xl border border-stone-800 shadow-xl space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Swap {coin}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-stone-700/40 rounded-full">
                        <X size={22} />
                    </button>
                </div>

                <div className="space-y-4">

                    {/* AMOUNT INPUT */}
                    <div>
                        <label className="text-sm text-stone-300">Swap Amount ({coin})</label>
                        <input
                            type="number"
                            min={0}
                            value={swapAmount}
                            onChange={(e) => setSwapAmount(Number(e.target.value) || 0)}
                            className="w-full mt-1 bg-stone-900 border border-stone-700 rounded-xl p-3"
                            placeholder="Enter amount"
                        />

                        <div className="flex justify-between pt-2 text-xs text-stone-400">
                            <span>Balance: <b>{balance} {coin}</b></span>
                            <button
                                onClick={() => setSwapAmount(numericBalance)}
                                className="text-xs py-1 px-2 rounded-full bg-black/25"
                                type="button"
                            >
                                Max
                            </button>
                        </div>
                    </div>

                    {/* NGN VALUE */}
                    <div>
                        <label className="text-sm text-stone-300">You Will Receive</label>
                        {loadingRate ? (
                            <p className="text-stone-500 animate-pulse text-lg">Loading...</p>
                        ) : (
                            <p className="text-stone-100 font-bold text-2xl">
                                ₦{finalNgnValue.toLocaleString()}
                            </p>
                        )}
                    </div>

                    {/* DETAILS */}
                    <div className="text-xs text-stone-400 space-y-1">
                        {amountValid && (rate || loadingRate) ? (
                            <>
                                {loadingRate ? (
                                    <p className="animate-pulse">Fetching exchange rate...</p>
                                ) : (
                                    <p>${rate?.usd_rate?.toLocaleString()} / {coin}</p>
                                )}
                                {!loadingRate && (
                                    <p className="text-stone-300 font-medium">
                                        NGN: <b>₦{finalNgnValue.toLocaleString()}</b>
                                    </p>
                                )}
                            </>
                        ) : (
                            <p>Enter amount to see full quote.</p>
                        )}
                    </div>

                    {/* SUBMIT */}
                    <button
                        onClick={handleSwap} // Fixed: execute function
                        disabled={buttonDisabled || isSwapping}
                        className={`w-full py-3 rounded-xl font-medium transition 
                            ${buttonDisabled || isSwapping
                                ? "bg-stone-900/50 text-stone-600 cursor-not-allowed"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                            }`}
                    >
                        {isSwapping ? "Swapping..." : buttonLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
