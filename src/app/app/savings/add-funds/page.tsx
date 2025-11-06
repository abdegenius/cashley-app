"use client";
import SavingsAction from "@/components/flows/savings";

export default function AddFundsPage() {
  const savingsGoal = {
    name: "House Down Payment",
    type: "Short-term savings",
    targetAmount: 15000,
    savedAmount: 3200,
    dueDate: "Jun 2025",
  };

  const handleAddFunds = (amount: number, frequency: string, paymentMethod: string) => {
    console.warn("Adding funds:", { amount, frequency, paymentMethod });
  };

  return (
    <SavingsAction
      type="add"
      savingsGoal={savingsGoal}
      onConfirm={handleAddFunds}
      onCancel={() => window.history.back()}
    />
  );
}
