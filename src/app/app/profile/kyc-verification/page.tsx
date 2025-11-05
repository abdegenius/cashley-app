"use client";

import Button from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Check } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
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
  const [limits, setlimits] = useState<Limits[]>([]);
  const { user } = useAuth();

  const fetchLimits = async () => {
    try {
      const res = await api.get<ApiResponse>("/limits");
      if (!res.data.error) setlimits(res.data.data);
    } catch {
      console.log("failed to fetch");
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  const step1 = user?.bvn;
  const step2 = step1 && user.nin;
  const step3 =
    step2 &&
    user.city &&
    user.country &&
    user.house_number &&
    user.street &&
    user.state;

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
    }
  };

  return (
    <div className="flex flex-col gap-10 h-full max-w-lg mx-auto overflow-y-scroll w-full px-4">
      <div>
        <h1 className="text-3xl font-bold">KYC Verification</h1>
        <h2 className="text-lg">
          Verify your identity to enjoy better transaction limit.
        </h2>
      </div>

      <div className="rounded-lg bg-card flex-col py-5 flex items-center justify-center">
        <Image
          src={"/svg/vector1.svg"}
          alt="vector-down"
          width={100}
          height={50}
        />
        <div className="text-lg font-semibold">
          Current Status: Not verified
        </div>
        <div className="py-2">Verify to use Cashley</div>
        <div className="w-full h-1 bg-white rounded-full" />
        <div className="flex  py-2 gap-3 text-sm items-center">
          <span></span>
          {user?.level ?? 0} out of 4 tiers completed
        </div>
      </div>

      <Section title="Verification Tiers" description="" delay={0.12}>
        {limits?.map((limit) => (
          <div key={limit.level} className=" flex w-full flex-col gap-3 pb-5">
            <div className="flex w-full justify-between items-center  p-2">
              <div className="flex gap-3 items-center">
                <Image
                  src={"/svg/vector1.svg"}
                  alt="vector1"
                  width={25}
                  height={25}
                />
                <div>
                  <h1 className="font-bold">Level {limit.level} </h1>
                  <h1 className="text-sm">
                    {limit.level <= Number(user?.level)
                      ? "Completed"
                      : "In progress"}
                  </h1>
                </div>
              </div>
              <div className="flex flex-col placeholder-text gap-2 items-center">
                <span className="flex">
                  {" "}
                  <Check size={20} /> Requires
                </span>
                <div className="w-full max-w-40 justify-end flex flex-wrap gap-2">
                  {limit.requires.map((rec, idx) => (
                    <span key={idx}>{rec.toUpperCase()}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center  text-center justify-between rounded-full px-8 py-2 bg-card gap-4 ">
              <div className=" text-sm   ">
                <div className="placeholder-text ">Daily limit</div>
                {formatToNGN(limit.daily_transaction_limit)}
              </div>
              <div className=" text-sm  ">
                <div className="placeholder-text ">Single Transfer</div>
                {formatToNGN(limit.per_single_transfer)}
              </div>
              <div className=" text-sm  ">
                <div className="placeholder-text ">Balance</div>
                {limit.wallet_balance}
              </div>
            </div>

            {isStepIncomplete(limit.level) && (
              <Button
                type="primary"
                width="w-full max-w-2xl py-4"
                text={`Start level ${limit.level} verification`}
                href={`/app/profile/kyc-verification/${links(limit.level)} `}
              />
            )}
          </div>
        ))}
      </Section>

      <Section title="Tier 3 Benefits" description="" delay={0.12}>
        <div className=" flex w-full flex-col gap-3 pb-5    ">
          <div className="flex w-full justify-between items-center  p-2">
            <div className="flex gap-3 items-center">
              <Image
                src={"/svg/vector1.svg"}
                alt="vector1"
                width={25}
                height={25}
              />
              <div>
                <h1 className="font-bold">Higher transaction limits</h1>
                <h1 className="">Up to ₦2,000,000 monthly</h1>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex w-full flex-col gap-3 pb-5   py-5 ">
          <div className="flex w-full justify-between items-center  p-2">
            <div className="flex gap-3 items-center">
              <Image
                src={"/svg/vector1.svg"}
                alt="vector1"
                width={25}
                height={25}
              />
              <div>
                <h1 className="font-bold">Crypto transaction access</h1>
                <h1 className="">Receive cryptocurrencies</h1>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex w-full flex-col gap-3 pb-5   py-5">
          <div className="flex w-full justify-between items-center  p-2">
            <div className="flex gap-3 items-center">
              <Image
                src={"/svg/vector1.svg"}
                alt="vector1"
                width={25}
                height={25}
              />
              <div>
                <h1 className="font-bold">Priority customer support</h1>
                <h1 className="">Faster response times</h1>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex w-full flex-col gap-3 pb-5  border-b  border-border py-5">
          <div className="flex w-full justify-between items-center  p-2">
            <div className="flex gap-3 items-center">
              <Image
                src={"/svg/vector1.svg"}
                alt="vector1"
                width={25}
                height={25}
              />
              <div>
                <h1 className="font-bold"> Need Help?</h1>
                <h1 className="">
                  Having trouble with verification? Our support team is here to
                  help.
                </h1>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <div className="w-full p-0.5 rounded-full  primary-orange-to-purple">
        <button className="text-lg  font-black w-full bg-card gradient-border  py-2 rounded-full">
          Contact Support
        </button>
      </div>
    </div>
  );
}
