"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, CheckCircle2, LockKeyhole, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { formatToNGN } from "@/utils/amount";

interface Limits {
  level: number;
  per_single_transfer: number;
  daily_transaction_limit: number;
  wallet_balance: string;
  requires: string[];
}

export default function KYCVerification() {
  const [limits, setLimits] = useState<Limits[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchLimits = async () => {
    try {
      const res = await api.get<ApiResponse>("/limits");
      if (!res.data.error) setLimits(res.data.data);
    } catch {
      console.log("Failed to fetch limits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  const step1 = user?.bvn;
  const step2 = step1 && user?.nin;
  const step3 =
    step2 &&
    user?.city &&
    user?.country &&
    user?.house_number &&
    user?.street &&
    user?.state;

  const isStepIncomplete = (count: number) => {
    switch (count) {
      case 1:
        return !step1;
      case 2:
        return step1 && !step2;
      case 3:
        return step2 && !step3;
      default:
        return false;
    }
  };

  const links = (id: number) => {
    switch (id) {
      case 1:
        return "bvn";
      case 2:
        return "nin";
      case 3:
        return "address";
      case 4:
        return "cac";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col gap-10 h-full max-w-2xl mx-auto overflow-y-auto w-full px-4 py-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-orange-400">
          KYC Verification
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Verify your identity to unlock higher transaction limits.
        </p>
      </div>

      {/* Current Level */}
      <div className="rounded-2xl bg-card py-6 flex flex-col items-center justify-center text-center shadow-md relative border border-border/40">
        <Image
          src="/svg/vector1.svg"
          alt="vector"
          width={90}
          height={50}
          className="mb-3 opacity-80"
        />
        <h2 className="text-lg font-semibold">
          Current Level:{" "}
          <span className="text-primary">{user?.level ?? "--"}</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Keep your account up to date on Cashley
        </p>

        <div className="relative mt-4 w-full max-w-sm h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-orange-500 transition-all duration-700"
            style={{
              width: `${((Number(user?.level ?? 0) / 4) * 100).toFixed(0)}%`,
            }}
          />
        </div>

        <p className="text-xs text-gray-500 mt-2">
          {user?.level ?? 0} of 4 tiers completed
        </p>
      </div>

      {/* Levels */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-60 text-gray-400">
          <Loader2 className="animate-spin mb-2 w-6 h-6" />
          Loading verification tiers...
        </div>
      ) : (
        <Section title="Verification Tiers" description="" delay={0.12}>
          <div className="flex flex-col gap-6">
            {limits.map((limit) => {
              const isComplete =
                limit.level <= Number(user?.level ?? 0) && !isStepIncomplete(limit.level);
              const inProgress = !isComplete && !isStepIncomplete(limit.level);
              const locked = isStepIncomplete(limit.level);

              return (
                <div
                  key={limit.level}
                  className={`relative border rounded-2xl p-5 flex flex-col gap-4 transition hover:shadow-md ${
                    isComplete
                      ? "bg-gradient-to-r from-green-50 to-green-100 border-green-300"
                      : locked
                      ? "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300"
                      : "bg-gradient-to-r from-orange-50 to-yellow-100 border-yellow-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {isComplete ? (
                        <CheckCircle2 className="text-green-600 w-6 h-6" />
                      ) : locked ? (
                        <LockKeyhole className="text-gray-500 w-6 h-6" />
                      ) : (
                        <ArrowRight className="text-yellow-600 w-6 h-6" />
                      )}
                      <div>
                        <h1 className="font-semibold text-stone-600">
                          Level {limit.level}
                        </h1>
                        <p className="text-xs text-stone-400">
                          {isComplete
                            ? "Completed"
                            : locked
                            ? "Pending Requirements"
                            : "Not Started"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Requires</p>
                      <div className="flex gap-1 flex-wrap justify-end mt-1">
                        {limit.requires.map((r, i) => (
                          <span
                            key={i}
                            className="bg-background border text-[10px] rounded-full px-2 py-0.5 font-medium"
                          >
                            {r.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm bg-card px-5 py-3 rounded-xl shadow-inner">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Daily Limit</p>
                      <p className="font-semibold">
                        {formatToNGN(limit.daily_transaction_limit)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Single Transfer</p>
                      <p className="font-semibold">
                        {formatToNGN(limit.per_single_transfer)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Wallet Balance</p>
                      <p className="font-semibold">{limit.wallet_balance}</p>
                    </div>
                  </div>

                  {!isComplete && locked && (
                    <Button
                      type="primary"
                      width="w-full py-4"
                      text="Verify Now"
                      href={`/app/profile/kyc-verification/${links(limit.level)}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Support Button */}
      <div className="w-full mt-4">
        <button className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white font-bold py-3 rounded-full shadow-md hover:opacity-90 transition">
          Contact Support
        </button>
      </div>
    </div>
  );
}
