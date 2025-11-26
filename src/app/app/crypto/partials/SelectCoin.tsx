"use client";

import Image from "next/image";
import { CRYPTO_ASSETS } from "@/utils/assets";
import { SupportedCoin } from "@/types";

interface SelectCoinProps {
    coin: SupportedCoin | null;
    onSelect: (symbol: SupportedCoin) => void;
}

export function SelectCoin({ coin, onSelect }: SelectCoinProps) {
    const activeAssets = Object.entries(CRYPTO_ASSETS).filter(([_, a]) => a.active);

    return (
        <>
            <h1 className="text-xl font-semibold">Available Crypto Assets</h1>

            <div className="space-y-4">
                {activeAssets.map(([symbol, asset]) => (
                    <div
                        key={symbol}
                        onClick={() => onSelect(symbol as SupportedCoin)}
                        className={`flex items-center justify-between bg-card px-4 py-3 rounded-xl ${coin === symbol ? 'border-2 border-purple-600' : 'border border-stone-800'} shadow-sm hover:shadow-md transition cursor-pointer`}
                    >
                        <div className="flex items-center gap-3">
                            <Image
                                src={asset.logo}
                                width={40}
                                height={40}
                                alt={asset.name}
                                className="rounded-full"
                            />

                            <div>
                                <p className="font-semibold">{asset.name}</p>
                                <p className="text-stone-400 text-sm">{asset.symbol}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
