"use client";

import { Copy, Eye, EyeOff, EllipsisVertical, ArrowLeft } from "lucide-react";
import React, { MouseEventHandler, useState } from "react";
import Button from "../ui/Button";

export default function Balances({
  type = "usd",
  close,
}: {
  type: string;
  close: MouseEventHandler<HTMLButtonElement>;
}) {
  const [showbal, setShobal] = useState<string | null>(null);

  const handleShowbal = (id: string) => {
    if (showbal === id) setShobal(id);
  };

  const balances = [
    { currency: "NGN", value: "₦125,000.00", symbol: "₦" },
    { currency: "USD", value: "25000.00", symbol: "$" },
  ];

  const balance = balances?.find(
    (bal) => bal.currency.toLowerCase() === type.toLowerCase()
  );

  const recentTransactions = [
    {
      currency: "NGN",
      amount: 10000,
      type: "Transfer",
      date: "Tuesday, July 1, 2025 - 8:00AM",
    },
    {
      currency: "NGN",
      amount: 10000,
      type: "Deposit",
      date: "Tuesday, July 1, 2025 - 8:00AM",
    },
    {
      currency: "USD",
      amount: 1000,
      type: "Transfer",
      date: "Tuesday, July 1, 2025 - 8:00AM",
    },
    {
      currency: "USD",
      amount: 1000,
      type: "Deposit",
      date: "Tuesday, July 1, 2025 - 8:00AM",
    },
    {
      currency: "NGN",
      amount: 10000,
      type: "Transfer",
      date: "Tuesday, July 1, 2025 - 8:00AM",
    },
    {
      currency: "NGN",
      amount: 10000,
      type: "Deposit",
      date: "Tuesday, July 1, 2025 - 8:00AM",
    },
    {
      currency: "USD",
      amount: 1000,
      type: "Transfer",
      date: "Tuesday, July 1, 2025 - 8:00AM",
    },
    {
      currency: "USD",
      amount: 1000,
      type: "Deposit",
      date: "Tuesday, July 1, 2025 - 8:00AM",
    },
    {
      currency: "NGN",
      amount: 10000,
      type: "Deposit",
      date: "Tuesday, July 1, 2025 - 8:00AM",
    },
    {
      currency: "NGN",
      amount: 10000,
      type: "Transfer",
      date: "Tuesday, July 1, 2025 - 8:00AM",
    },
    {
      currency: "USD",
      amount: 1000,
      type: "Transfer",
      date: "Tuesday, July 1, 2025 - 8:00AM",
    },
    {
      currency: "USD",
      amount: 1000,
      type: "Deposit",
      date: "Tuesday, July 1, 2025 - 8:00AM",
    },
  ];

  const transaction = recentTransactions?.filter(
    (trx) => trx.currency.toLowerCase() === type.toLowerCase()
  );

  if (!balance) return;
  if (!transaction) return;
  return (
    <div className="w-full h-full space-y-8">
      <div className="w-full gap-4">
        <div
          key={balance.symbol}
          className="w-full p-4 rounded-xl bg-card flex flex-col justify-between min-h-30"
        >
          <div className=" flex justify-between items-start w-full">
            <div className="w-full flex gap-3 items-center">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-stone-300"></span>
                <span className="font-semibold">{balance.currency}</span>
              </div>

              <button onClick={() => handleShowbal(balance.currency)}>
                {showbal === balance.symbol ? (
                  <Eye size={16} />
                ) : (
                  <EyeOff size={16} />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div>8101842464</div>
              <button className="cursor-pointer">
                <Copy size={18} className="placeholder-text" />
              </button>
            </div>
          </div>
          <div className="w-full flex items-center justify-between">
            <div className="w-full truncate text-lg font-black">
              {balance.value}
            </div>
            <Button type="primary" text="Convert" width="text-sm py-1 px-4" />
          </div>
        </div>
      </div>

      <div className="flex gap-6 w-full ">
        <Button type="secondary" text="Send Money" />
        <Button type="primary" text="Receive Money" />
      </div>

      <button
        onClick={close}
        className="p-2 rounded-full hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={16} />
      </button>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Recent transactions</h1>

        <div className="w-full">
          {transaction?.map((trx, id) => (
            <div
              key={id}
              className="w-full flex justify-between py-3 border-b border-stone-800 items-center"
            >
              <div>
                <div className="text-lg font-semibold">{trx.currency}</div>
                <div className="text-sm">{trx.date}</div>
              </div>

              <div className="flex items-start gap-2">
                <div>
                  <div className="text-lg font-semibold">{trx.amount}</div>
                  <div className="text-sm">{trx.type}</div>
                </div>
                <EllipsisVertical size={18} className="placeholder-text " />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
