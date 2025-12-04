import { Transaction } from "@/types/api";
import { formatToNGN } from "./amount";

export const getTransactionType = (transaction: Transaction) => {
  const actionMap: { [key: string]: string } = {
    airtime: "Airtime Purchase",
    data: "Data Subscription",
    electricity: "Electricity Bill",
    tv: "TV Subscription",
    transfer: "Transfer",
    giftcard: "Giftcard Sale",
    topup: "Wallet Topup",
    intra: "Wallet Transfer",
    inter: "Bank Transfer",
    crypto: transaction.type == "credit" ? "Incoming Crypto Deposit" : "Outgoing Crypto Transfer",
    swap: `Swapped ${transaction?.extra?.coin} To NGN`,
  };

  return actionMap[transaction?.action] || "Transaction";
};

export const getTransactionAmount = (transaction: Transaction) => {
  if (transaction.action === "crypto") {
    return `${transaction?.extra?.amount} ${transaction?.extra?.coin}`;
  } else if (transaction.action === "swap") {
    return `${formatToNGN(Number(transaction.amount))} (${transaction?.extra?.amount} ${transaction?.extra?.coin})`;
  } else {
    return formatToNGN(Number(transaction.amount));
  }
};

export const getTransactionDescription = (transaction: Transaction) => {
  if (transaction.action === "crypto" && transaction.type === "credit") {
    return `Incoming deposit of ${transaction?.extra?.amount} ${transaction?.extra?.coin} (#${transaction.description})`;
  } else if (transaction.action === "crypto" && transaction.type === "debit") {
    return `Outgoing transfer of ${transaction?.extra?.amount} ${transaction?.extra?.coin} (#${transaction.description})`;
  } else if (transaction.action === "swap") {
    return `Crypto swap of ${transaction?.extra?.amount} ${transaction?.extra?.coin} to NGN successful`;
  } else {
    return transaction.description;
  }
};
