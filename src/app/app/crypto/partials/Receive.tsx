"use client";
import QRCode from "react-qr-code";
import {
    X,
} from "lucide-react";
import toast from "react-hot-toast";
import { SupportedCoin } from "@/types";
import { copyToClipboard } from "@/utils/copy";

interface ReceiveCryptoProps {
    coin: SupportedCoin;
    tag?: string;
    address: string;
    onClose: () => void;
}
export function ReceiveCrypto({ coin, tag, address, onClose }: ReceiveCryptoProps) {

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative bg-[#111111]/90 border border-white/10 rounded-2xl shadow-2xl p-6 w-11/12 max-w-md animate-scaleIn space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                        Receive {coin}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition"
                    >
                        <X size={22} className="text-white/80" />
                    </button>
                </div>

                {/* QR + Address */}
                <div className="flex flex-col items-center space-y-5">

                    {/* QR Box */}
                    <div className="p-4 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-inner">
                        <QRCode value={address} size={170} />
                    </div>

                    <div className="text-center space-y-2">
                        <p className="text-sm text-gray-300 font-mono break-all leading-relaxed">
                            {address}
                        </p>

                        {tag && (
                            <div className="px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-medium">
                                ⚠ Tag / Memo Required: {tag}
                            </div>
                        )}
                    </div>

                    {/* Copy Button */}
                    <button
                        onClick={() => {
                            copyToClipboard(address)
                        }}
                        className="w-full py-3 rounded-xl font-semibold text-white
                    bg-gradient-to-r from-purple-600 to-indigo-600
                    hover:from-purple-500 hover:to-indigo-500
                    shadow-lg shadow-purple-600/30 transition-all active:scale-[0.98]"
                    >
                        Copy Address
                    </button>
                </div>
            </div>
        </div>

    );
}
