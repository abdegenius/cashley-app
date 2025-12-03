"use client";
import {
    X,
} from "lucide-react";
import { SupportedCoin } from "@/types";
import { AssetChain, Networks } from "@/types/api";
import { useEffect, useState } from "react";
import api from "@/lib/axios";


interface SelectChainProps {
    coin: SupportedCoin;
    onClose: () => void;
    onSelect: (chain: AssetChain) => void;
}

export function SelectChain({ coin, onSelect, onClose }: SelectChainProps) {
    const [networks, setNetworks] = useState<Record<SupportedCoin, AssetChain[]> | null>(null)
    const [network, setNetwork] = useState<AssetChain[] | null>(null)
    useEffect(() => {
        if (networks === null) {
            const getNetworks = async () => {
                const res = await api.get("/crypto/networks");
                if (!res.data.error && res.data.data) {
                    const _networks = res.data.data
                    const _network = res.data.data[coin]
                    setNetwork(_network)
                    setNetworks(_networks)
                }
            }
            getNetworks();
        }
        return;
    }, [networks])

    return (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-card w-11/12 h-auto max-w-md p-6 rounded-2xl border border-stone-800 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Select Chain</h2>
                    <button onClick={onClose} className="p-2 hover:bg-stone-700/40 rounded-full">
                        <X size={22} />
                    </button>
                </div>
                <div className="h-auto overflow-y-auto max-h-80">
                    {!network && <p className="w-full py-8 text-center px-4 text-sm font-normal text-stone-400">Loading available chains...</p>}
                    {network && network.length > 0 ?
                        <div className="space-y-3">
                            {network.map((_network) => (
                                <button
                                    key={_network.chain}
                                    onClick={() => onSelect(_network)}
                                    className="w-full bg-card border border-stone-700 hover:border-purple-400 hover:bg-stone-800 transition rounded-xl p-4 text-left flex justify-between items-center"
                                >
                                    <div>
                                        <p className="text-base font-semibold">{_network.chain}</p>
                                        <p className="text-xs text-stone-400 mt-1">Min Deposit: {_network.minDepositAmount}</p>
                                        <p className="text-xs text-stone-400">Confirms: {_network.depositConfirm}</p>
                                        {_network.needTag === "true" && (
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
        </div>
    );
}
