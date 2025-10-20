"use client";

import Balances from "@/components/flows/balances";
import Button from "@/components/ui/Button";
import {
  Bell,
  Bitcoin,
  Eye,
  EyeOff,
  Phone,
  PiggyBank,
  Tv,
  Wifi,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function Home() {
  const [showbal, setShobal] = useState<string | null>(null);
  const [balanceProp, setBalanceProp] = useState<string | null>(null);

  const handleShowbal = (id: string) => {
    if (showbal === id) setShobal(id);
  };
  const balance = [
    { currency: "NGN", value: "₦125,000.00", symbol: "₦" },
    { currency: "USD", value: "25000.00", symbol: "$" },
  ];

  const showbalance = (type: string) => {
    setBalanceProp(type);
  };
  const services = [
    {
      name: "Airtime",
      icon: <Phone size={24} className="purple-text" />,
      link: "/app/airtime",
    },
    {
      name: "Data",
      icon: <Wifi size={24} className="purple-text" />,
      link: "/app/data",
    },
    {
      name: "TV",
      icon: <Tv size={24} className="purple-text" />,
      link: "/app/tv",
    },
    {
      name: "Crypto",
      icon: <Bitcoin size={24} className="purple-text" />,
      link: "/app/deposite",
    },
    {
      name: "Savings",
      icon: <PiggyBank size={24} className="purple-text" />,
      link: "/app/savings",
    },
  ];
  return (
    <div className="w-full h-full py-8 px-4 space-y-6 overflow-y-scroll">
      <div className="w-full flex justify-between items-center ">
        <div className="flex items-center gap-3">
          <Image
            src={"/globe.svg"}
            alt="user image"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <h1 className="text-sm sm:text-md hidden sm:flex">Welcome back!</h1>
          <div className="text-sm sm:text-lg font-semibold">
            Tali Nanzing Moses
          </div>
        </div>

        <button className="cursor-pointer hover:bg-card p-2 rounded-full placeholder-text">
          <Bell size={24} />
        </button>
      </div>

      <div className="space-y-6 relative">
        <div className="grid grid-cols-2 gap-4">
          {balance?.map((bal) => (
            <div
              onClick={() => showbalance(bal.currency)}
              key={bal.symbol}
              className="w-full p-4 rounded-xl bg-card flex flex-col justify-between min-h-30"
            >
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-stone-300"></span>
                  <span className="font-semibold">{bal.currency}</span>
                </div>

                <button onClick={() => handleShowbal(bal.currency)}>
                  {showbal === bal.symbol ? (
                    <Eye size={16} />
                  ) : (
                    <EyeOff size={16} />
                  )}
                </button>
              </div>
              <div className="w-full truncate text-lg font-black">
                {bal.value}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex flex-col gap-6">
          <div className="flex justify-between items-center gap-4">
            <Button
              type="secondary"
              text="Send Money"
              width="text-sm sm:text-lg w-full"
              href="/app/send"
            />
            <Button
              type="primary"
              text="Receive Money"
              width="text-sm sm:text-lg w-full"
             
            />
          </div>

          <div className="w-full rounded-xl p-8 bg-card ">
            <div>
              <h1 className="text-lg font-bold">Refer & Earn</h1>
              <h1 className="">Earn ₦500 for each friend you refer</h1>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-card"></span>
            <span className="w-4 h-4 rounded-full bg-card"></span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-black">Quick links</h1>
            <Link href={"/app/services"} className="">
              See more {">"}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {services?.map((service) => (
              <Link
                key={service.link}
                href={service.link}
                className="w-full rounded-full py-4 bg-card hover:bg-hover flex items-center justify-center gap-2"
              >
                <span className="placeholder-text">{service.icon}</span>
                <span className="text-lg font-semibold">{service.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="text-xl font-black">Recent transactions</h1>
          <div className="flex flex-col gap-4"></div>
        </div>
        <div
          className={`${
            balanceProp !== null ? "flex" : "hidden"
          } absolute top-0 left-0 z-20 w-full bg-background`}
        >
          {balanceProp && <Balances type={balanceProp} close={() => setBalanceProp(null)} />}
        </div>
      </div>
    </div>
  );
}
