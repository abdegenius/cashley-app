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
    // const [swapFee, setSwapFee] = useState<EstimateFee | null>(null);
    const [rate, setRate] = useState<Rate | null>(null);

    // const [loadingFee, setLoadingFee] = useState(false);
    const [loadingRate, setLoadingRate] = useState(false);
    const [isSwapping, setIsSwapping] = useState(false);

    const amountValid = swapAmount > 0 && !isNaN(swapAmount);

    // ======================
    // Debounce helper
    // ======================
    const debounce = (fn: Function, delay = 400) => {
        let timer: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    // ======================
    // API CALLS
    // ======================
    // const fetchEstimateFee = useCallback(
    //     debounce(async (amount: number) => {
    //         if (amount <= 0) return;

    //         setLoadingFee(true);
    //         try {
    //             const res = await api.post("/crypto/estimate-fee", {
    //                 reference,
    //                 amount
    //             });

    //             if (!res.data.error) setSwapFee(res.data.data);
    //         } catch {
    //             toast.error("Unable to fetch network fee");
    //         } finally {
    //             setLoadingFee(false);
    //         }
    //     }),
    //     [reference]
    // );

    const fetchRate = useCallback(
        debounce(async (amount: number) => {
            if (amount <= 0) return;

            setLoadingRate(true);
            try {
                const res = await api.post("/crypto/rate", {
                    coin,
                    amount
                });

                if (!res.data.error) setRate(res.data.data);
            } catch {
                toast.error("Unable to fetch exchange rate");
            } finally {
                setLoadingRate(false);
            }
        }),
        [coin]
    );

    useEffect(() => {
        if (!amountValid) {
            // setSwapFee(null);
            setRate(null);
            return;
        }

        // fetchEstimateFee(swapAmount);
        fetchRate(swapAmount);
    }, [swapAmount, amountValid, fetchRate]);

    // ======================
    // VALIDATION
    // ======================
    const insufficientBalance = swapAmount > numericBalance;
    // swapFee &&
    // swapAmount + Number(swapFee.withdrawFee) > numericBalance;

    // const belowMinimum = 
    // swapFee &&
    // swapAmount > 0 &&
    // swapAmount < Number(swapFee.minWithdrawAmount);

    const zeroAmount = swapAmount === 0;

    // ======================
    // FINAL VALUES (network fee deduction)
    // ======================

    const finalNgnValue = useMemo(() => {
        // if (!rate || !swapFee) return 0;
        if (!rate) return 0;

        const ngnValue = rate.ngn_value || 0;
        // const withdrawFee = Number(swapFee.withdrawFee) || 0;
        const usdRate = rate.usd_rate || 0;

        // Convert withdrawFee → USD → NGN
        // const feeInUsd = withdrawFee * usdRate;
        // const feeInNgn = feeInUsd * (rate.ngn_rate ?? 0);

        // return Math.max(ngnValue - feeInNgn, 0);
        return Math.max(ngnValue, 0);
    }, [rate]);
    //  [rate, swapFee]

    // ======================
    // BUTTON LABEL
    // ======================
    const buttonLabel = useMemo(() => {
        if (zeroAmount) return "Enter an amount";
        // if (belowMinimum) return `Minimum is ${swapFee?.minWithdrawAmount} ${coin}`;
        if (insufficientBalance) return "Insufficient balance";
        return "Confirm Swap";
    }, [zeroAmount, insufficientBalance]);
    // [zeroAmount, belowMinimum, insufficientBalance, swapFee, coin]

    const buttonDisabled = zeroAmount || insufficientBalance;
    //  zeroAmount || belowMinimum || insufficientBalance || !swapFee;

    const handleSwap = async () => {

        setIsSwapping(true);
        try {
            const res = await api.post("/crypto/swap", {
                coin,
                amount: swapAmount,
                reference
            });

            if (!res.data.error) {
                toast.success("Token swap successfully processed...");
            } else {
                toast.error(res.data.message)
            }
        } catch {
            toast.error("Unable to fetch exchange rate");
        } finally {
            setIsSwapping(false);
        }
    }
    // ======================
    // UI
    // ======================
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-card w-11/12 max-w-md p-6 rounded-2xl border border-stone-800 shadow-xl space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Swap {coin}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-700/40 rounded-full"
                    >
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
                            <span>
                                Balance: <b>{balance} {coin}</b>
                            </span>

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

                                {/* <p>
                                    Min. Amount:{" "}
                                    {loadingFee ? (
                                        <span className="animate-pulse">...</span>
                                    ) : (
                                        `${swapFee?.minWithdrawAmount} ${coin}`
                                    )}
                                </p>

                                <p>
                                    Network Fee:{" "}
                                    {loadingFee ? (
                                        <span className="animate-pulse">...</span>
                                    ) : (
                                        `${swapFee?.withdrawFee} ${coin}`
                                    )}
                                </p> */}

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
                        onClick={() => handleSwap}
                        disabled={buttonDisabled}
                        className={`w-full py-3 rounded-xl font-medium transition 
                                ${buttonDisabled
                                ? "bg-stone-900/50 text-stone-600 cursor-not-allowed"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                            }`}
                    >
                        {buttonLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
