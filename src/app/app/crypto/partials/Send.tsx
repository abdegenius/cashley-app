"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { SupportedCoin } from "@/types";
import { EstimateFee } from "@/types/api";


interface SendCryptoProps {
    coin: SupportedCoin;
    onClose: () => void;
}

export function SendCrypto({ coin, onClose }: SendCryptoProps) {
    // const [withdrawalAmount, setWithdrawalAmount] = useState<number | "">("");
    // const [withdrawalAddress, setWithdrawalAddress] = useState<string | "">("");
    // const [withdrawalMemo, setWithdrawalMemo] = useState<string | "">("");
    // const [withdrawalFee, setWithdrawalFee] = useState<EstimateFee | null>(null);

    // const [isLoadingWithdrawalFee, setIsLoadingWithdrawalFee] = useState<boolean>(false);
    // const [isSending, setIsSending] = useState<boolean>(false);

    // const getWithdrawalFee = useCallback(async () => {
    //     if (!selectedWallet) toast.error("Please select a wallet")
    //     setIsLoadingWithdrawalFee(true)
    //     try {
    //         const res = await api.post("/crypto/estimate-fee", { reference: selectedWallet?.reference, amount: withdrawalAmount });
    //         if (!res.data.error) {
    //             setWithdrawalFee(res.data.data);
    //         }
    //     } catch {
    //         toast.error("Failed to load withdrawal fee");
    //     } finally {
    //         setIsLoadingWithdrawalFee(false)
    //     }
    // }, [selectedWallet, withdrawalAmount]);

    // const handleTransfer = async () => {
    //     if (!withdrawalFee) toast.error("Estimated fee not calculated")
    //     setIsSending(true)
    //     try {
    //         const res = await api.post("/crypto/transfer", { reference: selectedWallet?.reference, fee: withdrawalFee?.withdrawFee, amount: withdrawalAmount });
    //         if (!res.data.error) {
    //             toast.success("Withdrawal request is processing..")
    //         }
    //         toast.error(res.data.message || "Failed to process withdrawal");

    //     } catch {
    //         toast.error("Failed to process withdrawal");
    //     } finally {
    //         setIsSending(false)
    //     }
    // }

    // useEffect(() => {
    //     if (!withdrawalAmount || withdrawalAmount <= 0) return;
    //     getWithdrawalFee();
    // }, [withdrawalAmount])


    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-card w-11/12 max-w-md p-6 rounded-2xl border border-stone-800 shadow-xl space-y-6">

                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Send {coin}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-stone-700/40 rounded-full">
                        <X size={22} />
                    </button>
                </div>

                <p className="text-center py-12">
                    Feature not currently available
                </p>

                {/* <div className="space-y-4">
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
                        </div> */}
            </div>
        </div>
    );
}
