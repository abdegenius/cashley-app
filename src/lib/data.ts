import { BankAccount, SidebarItem } from "@/types/admin";
import { Banknote, Users, Wallet as WalletIcon } from "lucide-react";
import {
  User,
  Wallet,
  Transaction,
  ElectricityService,
  TvService,
  DataService,
  AirtimeService,
} from "@/types/api";
import { useEffect, useState } from "react";
import api from "./axios";


export const sidebarItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "users", label: "Users" },
  { id: "wallets", label: "Wallets" },
  { id: "airtime", label: "Airtime Purchases" },
  { id: "data", label: "Data Subscriptions" },
  { id: "electricity", label: "Electricity Bills" },
  {
    id: "tv-subscription",
    label: "Cable/TV Subscriptions",
  },
  { id: "transactions", label: "Transactions" },
];

