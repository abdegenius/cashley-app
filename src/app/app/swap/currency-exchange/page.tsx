import { Minus } from "lucide-react";
import React from "react";

export default function CurrencyExchange() {
  return (
    <div className="space-y-8 h-full w-full">
      <h1 className="text-3xl font-black">Current Exchange Rates</h1>

      <div className="w-full space-y-4">
        <div className=" flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Minus size={30} className="placeholder-text" />
            <div className="">
              <div className="font-black text-lg">Bitcoin (BTC)</div>
              <div className="">1 BTC = $96,750</div>
            </div>
          </div>
          <div className="py-2 px-5 rounded-full bg-card">0.5% Fee</div>
        </div>
        <div className=" flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Minus size={30} className="placeholder-text" />
            <div className="">
              Avoid
              <div className="font-black text-lg">Bitcoin (BTC)</div>
              <div className="">1 BTC = $96,750</div>
            </div>
          </div>
          <div className="py-2 px-5 rounded-full bg-card">0.5% Fee</div>
        </div>
      </div>
    </div>
  );
}
