"use client"

import { Section } from "@/components/ui/Section";
import { Check } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export default function KYCVerification() {
  const [step, setStep] = useState(1)

  // const ren
  return (
    <div className="flex flex-col gap-10 w-full">
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
              <div className=" flex w-full flex-col gap-3">
          <div className="flex w-full justify-between items-center">
            <div className="flex gap-3 items-start">
                <Image src={"/svg/vector1.svg"} alt="vector1" width={20} height={20}/>
                <div>
                    <h1 className="font-bold">Tier 2 - Standard</h1>
                    <h1 className="text-sm">In Progress</h1>
                </div>
            </div>
              <div className="flex placeholder-text gap-2 items-center">
          <Check size={16} />
          <span>BVN verification</span>
              </div>
          </div>
              </div>
            </Section>
      
    </div>
  );
}
