"use client";

import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { ChevronDown, PiggyBankIcon, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Savings() {
  return (
    <div className="w-full h-full space-y-10">
      <h1 className="text-3xl font-black">Savings</h1>

      <div className="w-full bg-card rounded-xl flex-col flex items-center justify-center p-4 gap-2">
        <Image
          src={"/svg/piggybank.svg"}
          alt="piggy bank "
          width={100}
          height={100}
        />
        <h1 className="text-lg font-semibold">Grow Your Money</h1>
        <div className="text-center max-w-md">
          Start investing today and watch your savings grow with competitive
          returns
        </div>
      </div>

      <div className="w-full bg-card rounded-xl flex-col flex items-center justify-center p-4 gap-2">
        <h1 className="text-lg font-semibold">Total Savings</h1>
        <h1 className="text-3xl font-semibold">₦12,450.00</h1>
        <div className="text-center max-w-md">+₦250.00 this month</div>
      </div>

      {/* active savings */}
      <div className="w-full space-y-4">
        <h1 className="text-xl font-black"> Active Savings</h1>
        <div className="w-full  border-border rounded-2xl p-6 space-y-4">
          <div className="w-full flex justify-between items-center">
            <div className="">
              <h4 className="font-black">House Down Payment</h4>
              <h4 className="">Short-term savings</h4>
            </div>

            <div className="">
              <h4 className="">Amount</h4>
              <h4 className="font-black">₦5,000</h4>
            </div>
          </div>

          <div className="space-y-1">
            <div className="w-full flex text-sm items-center justify-between">
              <div>₦3,200 saved</div>
              <div>64%</div>
            </div>
            <div className="w-full bg-card rounded-2xl overflow-hidden h-2">
              <div className="w-2/3 primary-purple-to-blue h-full" />
            </div>
            <div className="w-full flex text-sm items-center justify-between">
              <div>JuDue: Jun 2025n</div>
            </div>
          </div>

          <div className="w-full gap-6 flex items-center">
            <Button type="secondary" text="Add Funds" href="/app/savings/add-funds"/>
            <Button type="primary" text="Withdrawal" href="/app/savings/withdraw"/>
          </div>
        </div>
        <div className="w-full  border-border rounded-2xl p-6 space-y-4">
          <div className="w-full flex justify-between items-center">
            <div className="">
              <h4 className="font-black">House Down Payment</h4>
              <h4 className="">Short-term savings</h4>
            </div>

            <div className="">
              <h4 className="">Amount</h4>
              <h4 className="font-black">₦5,000</h4>
            </div>
          </div>

          <div className="space-y-1">
            <div className="w-full flex text-sm items-center justify-between">
              <div>₦3,200 saved</div>
              <div>64%</div>
            </div>
            <div className="w-full bg-card rounded-2xl overflow-hidden h-2">
              <div className="w-2/3 primary-purple-to-blue h-full" />
            </div>
            <div className="w-full flex text-sm items-center justify-between">
              <div>JuDue: Jun 2025n</div>
            </div>
          </div>

          <div className="w-full gap-6 flex items-center">
            <Button type="secondary" text="Add Funds" href="/app/savings/add-funds"/>
            <Button type="primary" text="Withdrawal" href="/app/savings/withdrawal" />
          </div>
        </div>

        {/* new Savings */}
        <div className="space-y-4">
          <h1 className="text-xl font-black"> New Savings</h1>
          <Link href={"/app/savings/new-savings"} className="w-full cursor-pointer border-border rounded-2xl p-6 space-y-4 flex flex-col items-center justify-center">
            <Plus size={40} className="placeholder-text" />

            <span className="text-lg font-bold">New Goal</span>
            <span className="">Start a new savings</span>
          </Link>
        </div>

        {/* savings calculator */}
        <div className="w-full  border-border rounded-2xl p-6 space-y-4 flex flex-col  justify-center">
          <h1 className="text-xl font-black">Savings Calculator</h1>

          <div className="spacy-y-2">
            <div className="flex justify-between items-center w-full gap-6">
              <button className="bg-card rounded-full w-14 h-14 flex flex-none items-center justify-center text-2xl">
                ₦
              </button>
              <TextInput
                value=""
                onChange={() => {}}
                placeholder="Enter savings amount"
              />
            </div>
          </div>
          <div className="w-full rounded-full bg-card ">
            <button className=" cursor-pointer flex justify-between py-4 px-6 items-center w-full">
              <span>3 Months</span>
              <ChevronDown size={24} />
            </button>
          </div>

          <div className=" flex justify-between bg-card rounded-full  py-4 px-6 items-center w-full">
            <span>Total</span>
            <span>₦9,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
