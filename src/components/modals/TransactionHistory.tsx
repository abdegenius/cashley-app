"use client";
import React, { useState } from "react";
import { BanknoteArrowDown, BanknoteArrowUp, GiftIcon, RefreshCcwDot, SquareArrowDown, SquareArrowUp } from "lucide-react";
import { Transaction } from "@/types/api";
import { statusLabel } from "@/utils/string";
import ViewTransactionDetails from "./ViewTransactionModal";
import { getTransactionAmount, getTransactionDescription, getTransactionType } from "@/utils/transaction";

interface TransactionHistoryProps {
  transactions: Transaction[];
  compact: boolean;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, compact }) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options).replace(",", " -");
  };

  const handleCloseSingleTransaction = () => setTransaction(null);

  // Group transactions by date
  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    });

    return groups;
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  return (
    <div className="w-full space-y-6 overflow-y-scroll">
      {compact ? (
        <div className="space-y-3">
          {transactions.map((transaction, i) => (
            <RowTransaction
              key={i}
              transaction={transaction}
              onSelect={() => setTransaction(transaction)}
            />
          ))}
        </div>
      ) : (
        Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
          <div key={date} className="space-y-4">
            {/* Date header */}
            <div className="flex items-center space-x-3">
              <div className="text-sm placeholder-text">
                {formatDate(dayTransactions[0].created_at)}
              </div>
            </div>

            {/* Transactions for this date */}
            <div className="space-y-3">
              {dayTransactions.map((transaction, i) => (
                <RowTransaction
                  key={i}
                  transaction={transaction}
                  onSelect={() => setTransaction(transaction)}
                />
              ))}
            </div>
          </div>
        ))
      )}
      {transaction && (
        <ViewTransactionDetails type={transaction.action} transaction={transaction} onClose={handleCloseSingleTransaction} />
      )}
    </div>
  );
};

interface RowTransactionProps {
  transaction: Transaction;
  onSelect: (transaction: Transaction) => void;
}

function RowTransaction({ transaction, onSelect }: RowTransactionProps) {
  const getTransactionIcon = (type: string, action: string) => {
    if (type === "credit") {
      switch (action) {
        case "swap":
          return <RefreshCcwDot size={20} className="text-green-500" />;
        case "crypto":
          return <BanknoteArrowDown size={20} className="text-green-500" />;
        case "giftcard":
          return <GiftIcon size={20} className="text-green-500" />;
        default:
          return <SquareArrowDown size={20} className="text-green-500" />;
      }
    }
    if (type == "debit") {
      switch (action) {
        case "transfer":
          return <SquareArrowUp size={20} className="text-red-500" />;
        case "crypto":
          return <BanknoteArrowUp size={20} className="text-red-500" />;
        case "deposit":
          return <SquareArrowDown size={20} className="text-green-500" />;
        default:
          return <SquareArrowUp size={20} className="text-red-500" />;
      }
    }
  };

  return (
    <div
      onClick={() => onSelect(transaction)}
      key={transaction.id}
      className="flex items-center justify-between py-2 px-4 bg-card rounded-2xl transition-colors"
    >
      <div className="flex items-center w-full space-x-3">
        {/* Transaction Icon */}
        <div className="flex-shrink-0">
          {getTransactionIcon(transaction.type, transaction.action)}
        </div>

        {/* Transaction Details */}
        <div className="flex flex-col w-full min-w-0">
          <div className="flex items-center justify-between w-full space-x-2">
            <p className="text-sm">{getTransactionType(transaction)}</p>
            {transaction.status && (
              <div
                dangerouslySetInnerHTML={{
                  __html: statusLabel(transaction.status),
                }}
              />
            )}
          </div>
          <p
            className={`text-md font-semibold ${transaction.type == "credit" ? "text-lime-600" : "text-rose-600"
              }`}
          >
            {getTransactionAmount(transaction)}
          </p>
          <p className="text-xs text-zinc-400 truncate">
            {getTransactionDescription(transaction)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;
