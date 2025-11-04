"use client";

import { ArrowRight, Copy, Check } from "lucide-react";
import React, { useState } from "react";
import QRCode from "react-qr-code";

type DepositMethod = "ngn" | "usdt" | "btc" | "eth";

export default function Deposit() {
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<DepositMethod>("ngn");
  const [copied, setCopied] = useState(false);

  const depositMethods = [
    {
      title: "Receive Naira",
      description: "Choose how you want to receive NGN",
      value: "ngn" as DepositMethod,
      icon: "₦",
    },
    {
      title: "Receive USDT",
      description: "Select network and proceed",
      value: "usdt" as DepositMethod,
      icon: "USDT",
    },
    {
      title: "Receive BTC",
      description: "Receive Bitcoin with ease",
      value: "btc" as DepositMethod,
      icon: "₿",
    },
    {
      title: "Receive ETH",
      description: "Receive Ethereum with selected network",
      value: "eth" as DepositMethod,
      icon: "Ξ",
    },
  ];

  const nairaAccounts = [
    { type: "Account Number", address: "8101842464", bank: "Cashley Bank" },
    { type: "Email Address", address: "talinanzing111@gmail.com" },
    { type: "Nickname", address: "@lawless" },
  ];

  const cryptoNetworks = {
    usdt: [
      { name: "Binance Smart Chain (BEP-20)", fee: "$0.5 - 2" },
      { name: "Tron (TRC-20)", fee: "$0.5 - 1" },
      { name: "Ethereum (ERC-20)", fee: "$10 - 30" },
      { name: "Polygon", fee: "$0.1 - 0.5" },
      { name: "Solana", fee: "$0.01 - 0.1" },
    ],
    btc: [{ name: "Bitcoin Network", fee: "$1 - 3" }],
    eth: [
      { name: "Ethereum (ERC-20)", fee: "$10 - 30" },
      { name: "Polygon", fee: "$0.1 - 0.5" },
      { name: "Arbitrum", fee: "$0.5 - 2" },
    ],
  };

  const walletAddresses: Record<Exclude<DepositMethod, "ngn">, string> = {
    usdt: "TQ4thapp10Vx3TDsEm8HwafffK9vSUSDT123",
    btc: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    eth: "0x4thapp10Vx3TDsEm8HwafffK9vSETH456",
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getNoteText = (method: DepositMethod) => {
    const notes = {
      ngn: "",
      usdt: "Please make sure to send only USDT to this address via the selected network. Otherwise, your funds may be lost and cannot be refunded.",
      btc: "Please make sure to send only BTC to this address. Otherwise, your funds may be lost and cannot be refunded.",
      eth: "Please make sure to send only ETH to this address via the selected network. Otherwise, your funds may be lost and cannot be refunded.",
    };
    return notes[method];
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="w-full space-y-4">
            <h3 className="text-3xl font-black">Choose Method</h3>
            <div className="space-y-2">
              {depositMethods.map((method, id) => (
                <div
                  key={id}
                  onClick={() => {
                    setSelectedMethod(method.value);
                    setStep(2);
                  }}
                  className="flex justify-between p-4 items-center rounded-lg border border-border hover:bg-card transition-all duration-300 cursor-pointer"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-card text-lg flex items-center justify-center font-bold">
                      {method.icon}
                    </div>
                    <div>
                      <div className="font-black text-lg">{method.title}</div>
                      <div className="text-sm text-zinc-500">
                        {method.description}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-zinc-400" />
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        if (selectedMethod === "ngn") {
          return (
            <div className="w-full space-y-6">
              <h3 className="text-3xl font-black">Receive Naira</h3>

              <div className="space-y-4">
                {nairaAccounts.map((account, id) => (
                  <div
                    key={id}
                    className="flex justify-between p-4 items-center rounded-lg border border-border bg-card"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-full bg-background text-lg flex items-center justify-center font-bold">
                        {account.type.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-lg">{account.type}</div>
                        <div className="text-sm text-zinc-500">
                          {account.address}
                        </div>
                        {account.bank && (
                          <div className="text-xs text-zinc-400">
                            {account.bank}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(account.address)}
                      className="p-2 rounded-lg hover:bg-background transition-colors"
                    >
                      {copied ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <div className=" rounded-lg p-4">
                <p className="text-sm">{getNoteText("ngn")}</p>
              </div>
            </div>
          );
        } else {
          return (
            <div className="w-full space-y-6">
              <h3 className="text-3xl font-black">
                Receive {selectedMethod.toUpperCase()}
              </h3>
              <h4 className="text-lg font-semibold">Select network</h4>

              <div className="space-y-3">
                {cryptoNetworks[selectedMethod]?.map((network, id) => (
                  <div
                    key={id}
                    onClick={() => setStep(3)}
                    className="flex justify-between p-4 items-center rounded-lg border border-border hover:bg-card transition-all duration-300 cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold">{network.name}</div>
                      <div className="text-sm text-zinc-500">
                        Fee: {network.fee}
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-zinc-400" />
                  </div>
                ))}
              </div>
            </div>
          );
        }

      case 3:
        return (
          <div className="w-full space-y-6">
            <h3 className="text-3xl font-black">
              Receive {selectedMethod.toUpperCase()}
            </h3>

            <div className="flex justify-between items-center">

              <div>
                <h4 className="font-semibold">
                  {selectedMethod === "usdt"
                    ? "Binance Smart Chain (BEP-20)"
                    : selectedMethod === "btc"
                    ? "Bitcoin Network"
                    : "Ethereum (ERC-20)"}
                </h4>
                <p className="text-sm text-zinc-500">
                  Fee:{" "}
                  {selectedMethod === "usdt"
                    ? "~$0.5 - 2"
                    : selectedMethod === "btc"
                    ? "~$1 - 3"
                    : "~$10 - 30"}
                </p>
              </div>
            </div>

            <div className="w-full space-y-2">
              <label className="text-sm font-medium">Wallet Address</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-background p-3 rounded-lg  font-mono text-sm break-all">
                  {
                    walletAddresses[
                      selectedMethod as Exclude<DepositMethod, "ngn">
                    ]
                  }
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      walletAddresses[
                        selectedMethod as Exclude<DepositMethod, "ngn">
                      ]
                    )
                  }
                  className="p-3 rounded-lg border border-border hover:bg-background transition-colors"
                >
                  {copied ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-6 space-y-4 w-fit mx-auto">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <QRCode
                    value={
                      walletAddresses[
                        selectedMethod as Exclude<DepositMethod, "ngn">
                      ]
                    }
                    size={300}
                  />
                </div>
              </div>
            </div>

            <div className=" rounded-lg p-4">
              <div className="text-xl">Note</div>
              <p className="text-sm 0">{getNoteText(selectedMethod)}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-6 pb-6">
      {renderStep()}

      {/* Navigation buttons */}
      {step > 1 && (
        <div className="flex gap-4 pt-4">
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 py-3 rounded-3xl border border-border bg-card font-bold text-lg hover:bg-background transition-colors"
          >
            Back
          </button>
          {step === 2 && selectedMethod !== "ngn" && (
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 rounded-3xl primary-purple-to-blue text-white font-bold text-lg"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}
