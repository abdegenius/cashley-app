"use client";

import Button from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Check } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function KYCVerification() {
  const [step, setStep] = useState(1);
  const { user } = useAuth()
  console.log("user", user)

  // const ren
  return (
    <div className="flex flex-col gap-10 h-full max-w-lg mx-auto overflow-y-scroll w-full">
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
          <span>0</span>
          out of 3 tiers completed
        </div>
      </div>

      <Section title="Verification Tiers" description="" delay={0.12}>
         <div className=" flex w-full flex-col gap-3 pb-5">
          <div className="flex w-full justify-between items-center  p-2">
            <div className="flex gap-3 items-center">
              <Image
                src={"/svg/vector1.svg"}
                alt="vector1"
                width={25}
                height={25}
              />
              <div>
                <h1 className="font-bold">Tier 1 - Standard</h1>
                <h1 className="text-sm">In Progress</h1>
              </div>
            </div>
            <div className="px-8 py-2 rounded-full font-semibold bg-card">
              ₦50k /month
            </div>
          </div>
          <div className="flex placeholder-text gap-2 items-center">
            <Check size={20} />
            <span>BVN verification</span>
          </div>

          {step === 1 && (
            <Button
              type="primary"
              width="w-full max-w-2xl py-4"
              text="Start Tier 3 Verification"
              href="/app/profile/kyc-verification/bvn"
            />
          )}
        </div>
        
        <div className=" flex w-full flex-col gap-3 pb-5 ">
          <div className="flex w-full justify-between items-center  p-2">
            <div className="flex gap-3 items-center">
              <Image
                src={"/svg/vector1.svg"}
                alt="vector1"
                width={25}
                height={25}
              />
              <div>
                <h1 className="font-bold">Tier 2 - Standard</h1>
                <h1 className="text-sm">In Progress</h1>
              </div>
            </div>
            <div className="px-8 py-2 rounded-full font-semibold bg-card">
              ₦50k/month
            </div>
          </div>
          <div className="flex placeholder-text gap-2 items-center">
            <Check size={20} />
            <span>NIN verification</span>
          </div>

          {step === 1 && (
            <Button
              type="primary"
              width="w-full max-w-2xl py-4"
              text="Start Tier 1 Verification"
              href="/app/profile/kyc-verification/nin"
            />
          )}
        </div>
       

       
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
