"use client";
import SavingsAction from "@/components/flows/savings";
import TextInput from "@/components/ui/TextInput";
import { useState } from "react";

export default function NewSavingsPage() {
  // const [goalName, setGoalName] = useState("");
  // const [targetAmount, setTargetAmount] = useState("");

  const handleCreateGoal = (amount: number, frequency: string, paymentMethod: string) => {
    // console.log("Creating goal:", {
    //   goalName,
    //   targetAmount: amount,
    //   frequency,
    //   paymentMethod,
    // });
  };

  return (
    <div className="space-y-8">
      {/* Goal Details Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-black">New Savings Goal</h1>

        <div className="space-y-4">
          <div className="w-full  border-border rounded-2xl p-6 space-y-4 flex flex-col  justify-center">
            <h1 className="text-xl font-black">Goad details</h1>
            <TextInput value="" onChange={() => {}} placeholder="Goal name" />
            <div className="spacy-y-2">
              <div className="flex justify-between items-center w-full gap-6">
                <button className="bg-card rounded-full w-14 h-14 flex flex-none items-center justify-center text-2xl">
                  ₦
                </button>
                <TextInput value="" onChange={() => {}} placeholder="Target amount" />
              </div>
            </div>

            <TextInput value="" type="date" onChange={() => {}} placeholder="Target amount" />
          </div>
        </div>
      </div>

      {/* Savings Action Component */}
      <SavingsAction
        type="new"
        onConfirm={handleCreateGoal}
        onCancel={() => window.history.back()}
      />
    </div>
  );
}
