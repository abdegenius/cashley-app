"use client";
import { useEffect, useState } from "react";
import { BankAccount } from "@/types/api";
import api from "@/lib/axios";

export const useBankAccount = () => {
  const [loading, setLoading] = useState(true);
  const [hasBankAccount, setHasBankAccount] = useState(false);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);

  const getBankAccount = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/bank-account");

      if (!res.data.error && res.data.data) {
        const bankAccountData = res.data.data;
        setBankAccount(bankAccountData);
        setHasBankAccount(bankAccountData.account_number);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (loading) getBankAccount();
  }, [loading]);

  return { loading, bankAccount, hasBankAccount };
};
