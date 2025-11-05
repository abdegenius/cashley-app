"use client";
import { useEffect, useState } from "react";
import { Wallet } from "@/types/api";
import api from "@/lib/axios";

export const useWallet = () => {
  const [loading, setLoading] = useState(true);
  const [hasBalance, setHasBalance] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    const getWallet = async () => {
      try {
        setLoading(true);
        const res = await api.get("/user/wallet");

        if (!res.data.error && res.data.data) {
          const walletData = res.data.data;
          setWallet(walletData);
          setHasBalance(Number(walletData.ngn_balance) > 0);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    getWallet();
  }, []);

  return { loading, wallet, hasBalance };
};
