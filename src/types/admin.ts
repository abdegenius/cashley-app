import { ReactNode } from "react";

export interface FileItem {
  id: number;
  name: string;
  type: "file" | "folder";
  icon: IconName;
  children?: FileItem[];
}

export type IconName =
  | "Folder"
  | "FileCode"
  | "FileText"
  | "FileJson"
  | "ChevronRight"
  | "ChevronDown";

export interface StatsCard {
  title: string;
  value: string;
  change: string;
  color: "blue" | "green" | "purple" | "orange";
}

export interface ActivityItem {
  action: string;
  user: string;
  time: string;
}

export interface QuickAction {
  name: string;
  icon: string;
  color: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone?: string;
  role: string;
  status: "active" | "inactive";
  type?: "user" | "admin";
  walletBalance?: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  reference: string;
  type: "credit" | "debit";
  action: string;
  amount: number;
  fee: number;
  balanceBefore: number;
  balanceAfter: number;
  status: "pending" | "completed" | "failed" | "reversed";
  wallet: string;
  description: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  locked: number;
  totalBalance: number;
  user?: User;
  createdAt: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  bankCode: string;
  accountName: string;
  accountNumber: string;
  createdAt: string;
}

export type CRUDAction = "create" | "read" | "update" | "delete";
export type EntityType =
  | "dashboard"
  | "users"
  | "transactions"
  | "wallets"
  | "airtime"
  | "data"
  | "tv-subscription"
  | "electricity";

export interface SidebarItem {
  id: EntityType;
  label: string;
}



