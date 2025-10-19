"use client";
import SavingsAction from "@/components/flows/savings";

export default function WithdrawPage() {
  const savingsGoal = {
    name: "House Down Payment",
    type: "Short-term savings", 
    targetAmount: 16000,
    savedAmount: 16000,
    dueDate: "Jun 2025",
  };

  const handleWithdraw = (amount: number, frequency: string, paymentMethod: string) => {
    console.log("Withdrawing:", { amount, frequency, paymentMethod });
  };

  return (
    <SavingsAction
      type="withdraw"
      savingsGoal={savingsGoal}
      onConfirm={handleWithdraw}
      onCancel={() => window.history.back()}
    />
  );
}