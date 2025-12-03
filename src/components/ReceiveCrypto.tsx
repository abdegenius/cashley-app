"use client";

import { useEffect, useState } from "react";
import Modal from "./ui/Modal";
import { receiveCryptoModal } from "@/controllers/receive-crypto-modal";
import { X, Copy } from "lucide-react";
import QRCode from "react-qr-code";
import Image from "next/image";
import { copyToClipboard } from "@/utils/copy";
import { CryptoWallet } from "@/types/api";

interface ReceiveCryptoModalProps {
    wallet: CryptoWallet;
}

const ReceiveCryptoModal = ({ wallet }: ReceiveCryptoModalProps) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        receiveCryptoModal.register(setShow);
    }, []);

    if (!wallet) return null;

    return (
        <Modal show={show} onClose={() => setShow(false)}>

            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 animate-fadeIn">

                <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/70 to-slate-900/80
            border border-white/10 rounded-2xl w-11/12 max-w-md p-6 shadow-2xl space-y-6 animate-slideUp">


                    {/* Header */}
                    <div className="relative flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-3">
                            <Image
                                src={`/img/${wallet.coin.toLowerCase()}.png`}
                                alt={wallet.coin}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <div>
                                <h2 className="text-lg font-semibold">Receive {wallet.coin}</h2>
                                <p className="text-xs text-gray-400">{wallet.chain} Network</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShow(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center space-y-6 mt-4">
                        <div className="p-5 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 
              border border-zinc-700 shadow-inner">
                            <QRCode value={wallet.address} size={180} />
                        </div>

                        {/* Address */}
                        <div className="w-full text-center space-y-2">
                            <p className="text-sm text-gray-300 font-mono break-all">
                                {wallet.address}
                            </p>

                            {wallet.tag && (
                                <div className="px-3 py-2 rounded-xl bg-amber-500/20 
                  border border-amber-400/40 text-amber-300 text-xs font-medium">
                                    ⚠ Tag / Memo Required: {wallet.tag}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <button
                            onClick={() => copyToClipboard(wallet.address)}
                            className="w-full flex items-center justify-center space-x-2 py-3 
              rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600
              hover:from-purple-500 hover:to-indigo-500
              text-white font-semibold shadow-lg shadow-purple-600/40
              active:scale-[0.97] transition-all"
                        >
                            <Copy size={18} />
                            <span>Copy Address</span>
                        </button>
                    </div>

                </div>
            </div>
        </Modal>
    );
};

export default ReceiveCryptoModal;
