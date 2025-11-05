import React from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Transaction } from "@/types/api";
import { formatToNGN } from "@/utils/amount";
import { timeAgo } from "@/utils/date";
import { statusLabel } from "@/utils/string";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
}) => {
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
  // Get transaction type display name
  const getTransactionType = (action: string, type: string) => {
    const actionMap: { [key: string]: string } = {
      airtime: "Airtime",
      data: "Data",
      tv: "TV Subscription",
      transfer: "Transfer",
      deposit: "Deposit",
      withdrawal: "Withdrawal",
    };

    return actionMap[action] || "Transaction";
  };

  // Get icon based on transaction type
  const getTransactionIcon = (type: string, action: string) => {
    if (type === "credit") {
      return <ArrowDownLeft size={20} className="text-green-500" />;
    }
    // For debits, show different icons based on action
    switch (action) {
      case "transfer":
        return <ArrowUpRight size={20} className="text-red-500" />;
      case "deposit":
        return <ArrowDownLeft size={20} className="text-green-500" />;
      default:
        return <ArrowUpRight size={20} className="text-red-500" />;
    }
  };

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
    <div className="w-full space-y-6 max-h-150 overflow-y-scroll">
      {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
        <div key={date} className="space-y-4">
          {/* Date header */}
          <div className="flex items-center space-x-3">
            <div className="text-sm placeholder-text">
              {formatDate(dayTransactions[0].created_at)}
            </div>
          </div>

          {/* Transactions for this date */}
          <div className="space-y-3">
            {dayTransactions.map((transaction) => (
              <div
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
                      <p className="text-sm">
                        {getTransactionType(transaction.action, transaction.type)}
                      </p>
                      {transaction.status && (
                        <div
                          dangerouslySetInnerHTML={{ __html: statusLabel(transaction.status) }}
                        />
                      )}
                    </div>
                    <p className={`text-md font-semibold ${transaction.type == 'credit' ? 'text-lime-600' : 'text-rose-600'}`}>
                      {formatToNGN(Number(transaction.amount))}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {transaction.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory;
