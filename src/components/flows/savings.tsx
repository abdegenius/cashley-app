"use client";

import Button from "@/components/ui/Button";
import {
  CalendarDays,
  Plus,
  CircleQuestionMark,
  PiggyBank,
  Home,
  Wallet,
} from "lucide-react";
import React, { useState } from "react";

type ActionType = "add" | "withdraw" | "new";

interface SavingsActionProps {
  type: ActionType;
  savingsGoal?: {
    name: string;
    type: string;
    targetAmount: number;
    savedAmount: number;
    dueDate: string;
  };
  onConfirm?: (
    amount: number,
    frequency: string,
    paymentMethod: string
  ) => void;
  onCancel?: () => void;
}

export default function SavingsAction({
  type,
  savingsGoal,
  onConfirm,
  onCancel,
}: SavingsActionProps) {
  const [amount, setAmount] = useState<string>("");
  const [frequency, setFrequency] = useState<"once" | "weekly" | "monthly" | string>(
    "once"
  );
  const [paymentMethod, setPaymentMethod] = useState<string>("cashley");

  const numbers = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000];

  const paymentMethods = [
    {
      accountName: "cashley",
      accountNumber: "8101842464",
      bankName: "Cashley Account Balance",
    },
  ];

  const withdrawMethods = [
    {
      accountName: "cashley",
      accountNumber: "8101842464",
      bankName: "Cashley Account Balance",
    },
    {
      accountName: "bank",
      accountNumber: "",
      bankName: "Add Bank",
    },
  ];

  const getConfig = () => {
    const config = {
      add: {
        title: "Add Funds",
        amountTitle: "How much would you like to add?",
        buttonText: "Add Funds",
        showSavingsGoal: true,
        showFrequency: true,
        showPaymentMethods: true,
        icon: Plus,
      },
      withdraw: {
        title: "Withdrawal",
        amountTitle: "How much would you like to withdraw?",
        buttonText: "Withdraw",
        showSavingsGoal: true,
        showFrequency: false,
        showPaymentMethods: true,
        paymentMethods: withdrawMethods,
        icon: Wallet,
      },
      new: {
        title: "",
        amountTitle: "How much would you like to add?",
        buttonText: "Create Goal",
        showSavingsGoal: false,
        showFrequency: true,
        showPaymentMethods: true,
        icon: PiggyBank,
      },
    };

    return config[type] || config.add;
  };

  const config = getConfig();

  const handleNumberClick = (num: number) => {
    setAmount(num.toString());
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(Number(amount), frequency, paymentMethod);
    }
  };

  const renderSavingsGoal = () => {
    if (!savingsGoal || !config.showSavingsGoal) return null;

    const progress = (savingsGoal.savedAmount / savingsGoal.targetAmount) * 100;

    return (
      <div className="w-full border border-border rounded-2xl p-6 space-y-4">
        <div className="w-full flex justify-between items-center">
          <div className="">
            <h4 className="font-black">{savingsGoal.name}</h4>
            <h4 className="">{savingsGoal.type}</h4>
          </div>
          <div className="">
            <h4 className="">Amount</h4>
            <h4 className="font-black">
              ₦{savingsGoal.targetAmount.toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="space-y-1">
          <div className="w-full flex text-sm items-center justify-between">
            <div>₦{savingsGoal.savedAmount.toLocaleString()} saved</div>
            <div>{Math.round(progress)}%</div>
          </div>
          <div className="w-full bg-card rounded-2xl overflow-hidden h-2">
            <div
              className="primary-purple-to-blue h-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="w-full flex text-sm items-center justify-between">
            <div>Due: {savingsGoal.dueDate}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderAmountSection = () => (
    <div className="w-full space-y-4">
      <h1 className="text-xl font-black">{config.amountTitle}</h1>

      <div className="w-full rounded-2xl border border-border p-6 flex items-center flex-col justify-center">
        <span className="text-3xl font-black w-full text-center placeholder-text">
          ₦
        </span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="text-3xl text-center font-black placeholder:placeholder-text outline-none border-none bg-transparent w-full"
        />
      </div>

      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
        {numbers?.map((num) => (
          <div
            key={num}
            className={`rounded-4xl ${
              amount === num.toString()
                ? "primary-purple-to-blue p-0.5"
                : "bg-card"
            }`}
          >
            <button
              onClick={() => handleNumberClick(num)}
              className={`hover:bg-hover bg-card transition-all duration-300 w-full rounded-full p-4 `}
            >
              ₦{num.toLocaleString()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFrequency = () => {
    if (!config.showFrequency) return null;

    return (
      <div className="w-full space-y-4">
        <h1 className="text-xl font-black">Frequency</h1>

        <div className="space-y-3">
          {[
            { id: "once", label: "One-time" },
            { id: "weekly", label: "Weekly" },
            { id: "monthly", label: "Monthly" },
          ].map((freq) => (
           <div key={freq.id} className={`${frequency === freq.id ? "primary-purple-to-blue" : ""} p-0.5 rounded-full`}>

            <div
              onClick={() => setFrequency(freq.id)}
              
              className="w-full cursor-pointer bg-card rounded-full py-4 px-6 flex items-center justify-between"
            >
              <div className="flex gap-3 items-center">
                <CalendarDays size={20} className="placeholder-text" />
                <p className="font-medium">{freq.label}</p>
              </div>
              <div className="rounded-full border-border p-1">
                <Button
                  type={frequency === freq.id ? "secondary" : "card"}
                  width="w-5 h-5 flex flex-none"
                />
              </div>
            </div>
           </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPaymentMethods = () => {
    if (!config.showPaymentMethods) return null;

    const methods = type === "withdraw" ? withdrawMethods : paymentMethods;

    return (
      <div className="w-full space-y-4">
        <h1 className="text-xl font-black">
          {type === "withdraw" ? "Withdraw to" : "Payment Method"}
        </h1>

        <div className="space-y-3">
          {methods?.map((method) => (
            <div
              onClick={() => setPaymentMethod(method.accountName)}
              key={method.accountName}
              className="w-full bg-card rounded-full py-4 px-6 flex items-center justify-between"
            >
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">{method.bankName}</p>
                  {method.accountNumber && (
                    <p className="text-xs text-zinc-500">
                      {method.accountNumber}
                    </p>
                  )}
                </div>
              </div>
              <div className="rounded-full border border-border p-1">
                <Button
                  type={
                    paymentMethod === method.accountName ? "secondary" : "card"
                  }
                  width="w-5 h-5 flex flex-none"
                />
              </div>
            </div>
          ))}

          {type !== "withdraw" && (
            <button className="w-full rounded-full flex items-center gap-2 py-4 justify-center bg-card cursor-pointer hover:bg-hover transition-colors">
              <Plus size={20} className="stroke-1" />
              <span>Add Payment Method</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderInfoText = () => {
    const texts = {
      add: [
        "Funds will be transferred immediately from your selected account.",
        "You can set up automatic transfers to reach your goal faster.",
      ],
      withdraw: [
        "Funds will be withdrawn immediately to your selected account.",
      ],
      new: [
        "Funds will be transferred immediately from your selected account.",
        "You can set up automatic transfers to reach your goal faster.",
      ],
    };

    const currentTexts = texts[type] || texts.add;

    return (
      <div className="flex items-start gap-3">
        <CircleQuestionMark size={20} className="placeholder-text mt-1" />
        <div className="w-full space-y-2 max-w-sm text-sm">
          {currentTexts.map((text, index) => (
            <div key={index}>{text}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full space-y-8 pb-6">
      <h1 className="text-3xl font-black">{config.title}</h1>

      {renderSavingsGoal()}
      {renderAmountSection()}
      {renderFrequency()}
      {renderPaymentMethods()}
      {renderInfoText()}

      <div className="flex gap-4 pt-4">
        {onCancel && (
          <Button
            onclick={onCancel}
            type="primary"
            text="Cancel"
            width="flex-1"
          />
        )}
        <Button
          onclick={handleConfirm}
          type="secondary"
          text={config.buttonText}
          width="flex-1"
        />
      </div>
    </div>
  );
}
