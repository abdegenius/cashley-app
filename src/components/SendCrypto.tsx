"use client";

import Modal from "./ui/Modal";
import { useEffect, useState } from "react";
import { sendCryptoModal } from "@/controllers/send-crypto-modal";
import { X } from "lucide-react";
import { CryptoWallet } from "@/types/api";

const coinLogo = (coin: string) =>
  `/img/${coin.toLowerCase()}.png`;

interface SendCryptoProps {
  wallet: CryptoWallet;
}

const SendCryptoModal = ({ wallet }: SendCryptoProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    sendCryptoModal.register(setShow);
  }, []);

  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 animate-fadeIn">

        <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/70 to-slate-900/80
            border border-white/10 rounded-2xl w-11/12 max-w-md p-6 shadow-2xl space-y-6 animate-slideUp">

          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                <img
                  src={coinLogo(wallet.coin)}
                  alt={wallet.coin}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <h2 className="text-lg font-semibold">
                Send {wallet.coin}
              </h2>
            </div>

            <button
              onClick={() => setShow(false)}
              className="p-2 hover:bg-stone-700/40 rounded-full transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* BODY */}
          <div className="text-center py-10 space-y-3">
            <p className="text-base text-gray-300">
              Sending on the <span className="text-indigo-400 font-semibold">{wallet.network}</span> network
            </p>

            <p className="text-lg font-semibold text-white mt-3">
              {wallet.balance} {wallet.coin}
            </p>

            <p className="text-sm text-gray-400">
              Feature not currently available
            </p>
          </div>

          {/* FOOTER BUTTON (DISABLED) */}
          <button
            disabled
            className="w-full py-3 rounded-xl font-semibold text-white/40
            bg-gradient-to-r from-purple-700/30 to-indigo-700/30 
            border border-white/10 cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SendCryptoModal;
