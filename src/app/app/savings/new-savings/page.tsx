"use client";
import SavingsAction from "@/components/flows/savings";
import TextInput from "@/components/ui/TextInput";
import { useState } from "react";

export default function NewSavingsPage() {
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const handleCreateGoal = (amount: number, frequency: string, paymentMethod: string) => {
    console.log("Creating goal:", { goalName, targetAmount: amount, frequency, paymentMethod });
  };

  return (
    <div className="space-y-8">
      {/* Goal Details Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-black">New Savings Goal</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Goal name</label>
            <TextInput
              value={goalName}
              onChange={setGoalName}
              placeholder="Enter goal name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Target amount</label>
            <TextInput
              value={targetAmount}
              onChange={setTargetAmount}
              placeholder="Enter target amount"
              type="number"
            />
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