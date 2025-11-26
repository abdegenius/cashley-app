"use client";

import { useState } from "react";
import {
    X,
} from "lucide-react";
import { networks, SupportedCoin } from "@/types";
import { AssetChain } from "@/types/api";


interface SelectChainProps {
    coin: SupportedCoin;
    onClose: () => void;
    onSelect: (chain: AssetChain) => void;
}

export function SelectChain({ coin, onSelect, onClose }: SelectChainProps) {
    const chains = networks[coin];

    return (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-card w-11/12 h-auto max-w-md p-6 rounded-2xl border border-stone-800 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Select Chain</h2>
                    <button onClick={onClose} className="p-2 hover:bg-stone-700/40 rounded-full">
                        <X size={22} />
                    </button>
                </div>
                {chains.length > 0 ?
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {chains.map((chain) => (
                            <button
                                key={chain.chain}
                                onClick={() => onSelect(chain)}
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
                                <span className="hover:border-purple-400 border border-transparent bg-black/25 px-4 py-2 rounded-full text-purple-400 font-medium">Select</span>
                            </button>
                        ))}
                    </div>
                    :
                    <p className="text-center flex min-h-[80vh] items-center justify-center animate-pulse">
                        No chain available for selected coin
                    </p>
                }
            </div>
        </div>
    );
}
