"use client";

import React from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import {
  CalendarRange,
  ChartSpline,
  ChevronDown,
  Clock3,
  DoorClosed,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import TextInput from "@/components/ui/TextInput";

export default function Investment() {
  const whyCashley = [
    {
      title: "Secure",
      description: "Bank-level security",
      icon: <ShieldCheck size={30} className="placeholder-text" />,
    },
    {
      title: "Flexible",
      description: "Multiple durations",
      icon: <Clock3 size={30} className="placeholder-text" />,
    },
    {
      title: "High Returns",
      description: "Up to 18% annually",
      icon: <ChartSpline size={30} className="placeholder-text" />,
    },
    {
      title: "Easy Access",
      description: "Manage anywhere",
      icon: <DoorClosed size={30} className="placeholder-text" />,
    },
  ];
  return (
    <div className="w-full h-full space-y-10 pb-10">
      <h1 className="text-3xl font-black">Investment</h1>

      <div className="w-full bg-card rounded-xl flex-col flex items-center justify-center p-4 gap-2">
        <Image src={"/svg/piggybank.svg"} alt="piggy bank " width={100} height={100} />
        <h1 className="text-lg font-semibold">Grow Your Money</h1>
        <div className="text-center max-w-md">
          Start investing today and watch your savings grow with competitive returns
        </div>
      </div>

      <div className="w-full bg-card rounded-xl flex-col flex items-center justify-center p-4 gap-2">
        <h1 className="text-lg font-semibold">Total Savings</h1>
        <h1 className="text-3xl font-semibold">₦12,450.00</h1>
        <div className="text-center max-w-md"> +₦15,420 (6.7%)</div>
        <div className="w-full flex max-w-sm justify-between items-center">
          <div>
            <div> Active Plans </div>
            <div>2</div>
          </div>
          <div>
            <div>Total Return</div>
            <div className="text-lg font-black">₦23,500</div>
          </div>
        </div>
      </div>

      <div className="w-full space-y-6">
        <div className="space-y-4 ">
          <h1 className="text-2xl font-black">Investment Plans</h1>
          <div className="rounded-2xl border-border p-5 ">
            <div className="flex text-lg font-black items-center justify-between mx-w-lg">
              <div>3 Months Plan</div>
              <div>8.5%</div>
            </div>
            <div className="flex items-center justify-between mx-w-lg">
              <div>Short-term savings</div>
              <div>Annual return</div>
            </div>
            <div className="flex items-center justify-between my-4 mx-w-lg">
              <div>
                <div>Min. Amount</div>
                <div className="font-black">₦10,000</div>
              </div>
              <div>
                <div>Duration</div>
                <div className="font-black">90 days</div>
              </div>
              <div>
                <div>Risk level</div>
                <div className="font-black">Low</div>
              </div>
            </div>
            <Button text="Start Investing" type="primary" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h1 className="text-xl font-black">Active Investments</h1>

        <Link
          href={"/app/investment/active-investment"}
          className=" flex justify-between items-center"
        >
          <div className="flex gap-2 items-center">
            <CalendarRange size={30} className="placeholder-text" />
            <div className="">
              <div className="font-black">6 Months Plan</div>
              <div className="">Started Jan 15, 2025</div>
            </div>
          </div>
          <div className="">
            <div className="font-black">₦100,000</div>
            <div className="">65 days left</div>
          </div>
        </Link>

        <Link
          href={"/app/investment/active-investment"}
          className=" flex justify-between items-center"
        >
          <div className="flex gap-2 items-center">
            <CalendarRange size={30} className="placeholder-text" />
            <div className="">
              <div className="font-black">1 Year Plan</div>
              <div className="">Started Dec 1, 2025</div>
            </div>
          </div>
          <div className="">
            <div className="font-black">₦150,000</div>
            <div className="">310 days left</div>
          </div>
        </Link>
      </div>

      <div className="w-full  border-border rounded-2xl p-6 space-y-4 flex flex-col  justify-center">
        <h1 className="text-xl font-black">Investments Calculator</h1>

        <div className="spacy-y-2">
          <div className="flex justify-between items-center w-full gap-6">
            <button className="bg-card rounded-full w-14 h-14 flex flex-none items-center justify-center text-2xl">
              ₦
            </button>
            <TextInput value="" onChange={() => {}} placeholder="Enter savings amount" />
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

      <div className="space-y-6">
        <h1 className="text-xl font-black">Why Invest with Cashley? </h1>

        <div className="p-8 grid grid-cols-2 gap-10 w-full">
          {whyCashley?.map((why, id) => (
            <div key={id} className="w-full flex flex-col gap-1 items-center justify-center">
              {why.icon}
              <div className="font-black">{why.title}</div>
              <div className="text-sm">{why.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
