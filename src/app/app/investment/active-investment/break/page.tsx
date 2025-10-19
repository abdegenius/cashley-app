"use client";

import React from "react";
import Image from "next/image";
import { CalendarRange, CircleAlert, Minus } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Break() {
  return (
    <div className="space-y-6 w-full h-full">
      <h1 className="text-3xl font-black">Break Investment</h1>

      <div className="w-full bg-card rounded-xl flex-col flex items-center justify-center p-4 gap-2">
        <Image
          src={"/svg/warning.svg"}
          alt="piggy bank "
          width={100}
          height={100}
        />
        <h1 className="text-lg font-semibold">Break Investment Early?</h1>
        <div className="text-center max-w-md">
          Breaking your investment before maturity will incur penalty charges
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-xl font-black">Investment Details</h1>
        <div className="text-sm w-full space-y-3  pt-8 mx-auto">
          <div className="flex justify-between w-full items-center">
            <div>Plan:</div>
            <div>6 Months Fixed</div>
          </div>
          <div className="flex justify-between w-full items-center">
            <div>Amount Invested:</div>
            <div>₦100,000</div>
          </div>
          <div className="flex justify-between w-full items-center">
            <div>PInterest Rate:</div>
            <div>12% p.a.</div>
          </div>
          <div className="flex justify-between w-full items-center">
            <div>StaStart Datetus:</div>
            <div>Oct 15, 2024</div>
          </div>
          <div className="flex justify-between w-full items-center">
            <div>Maturity Date:</div>
            <div>Apr 15, 2025</div>
          </div>
          <div className="flex justify-between w-full items-center">
            <div>Date Remaining:</div>
            <div>65 days</div>
          </div>
        </div>
      </div>

      <div className="space-y-4 bg-card rounded-2xl p-6">
        <h1 className="text-xl font-black">Penalty Breakdown</h1>
        <div className="text-sm w-full space-y-3  pt-8 mx-auto">
          <div className="flex justify-between w-full items-center">
            <div>Current Balance:</div>
            <div>₦530,450</div>
          </div>
          <div className="flex justify-between w-full items-center">
            <div>Early Exit Fee (2%):</div>
            <div>-₦10,609</div>
          </div>
          <div className="flex justify-between w-full items-center">
            <div>Interest Forfeiture:</div>
            <div>-₦15,225</div>
          </div>
          <div className="flex font-black text-lg justify-between w-full items-center">
            <div>You’ll Receive:</div>
            <div>₦504,616</div>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-border rounded-2xl p-6 ">
        <h1 className="text-xl font-black">Impact Summary</h1>
        <div className="text-sm w-full space-y-6  pt-8 mx-auto">
          <div className=" flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Minus size={30} className="placeholder-text" />
              <div className="">
                <div className="font-black text-lg">Loss of ₦25,834</div>
                <div className="">Total penalties and forfeited interest</div>
              </div>
            </div>
          </div>
          <div className=" flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <CalendarRange size={30} className="placeholder-text" />
              <div className="">
                <div className="font-black text-lg">68 days early</div>
                <div className="">Missing out on remaining growth period</div>
              </div>
            </div>
          </div>
          <div className=" flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <CircleAlert size={30} className="placeholder-text" />
              <div className="">
                <div className="font-black text-lg">5.17% total loss</div>
                <div className="">5.17% total loss</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-border rounded-2xl p-6 ">
        <h1 className="text-xl font-black">Impact Summary</h1>
        <div className="text-sm w-full space-y-6  pt-8 mx-auto">
          <div className=" flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="p-0.5 rounded-full border-border">
                <Button width="w-8 h-8 rounded-full " />
              </div>
              <div className="">
                I understand that breaking this investment will result in a
                loss.
              </div>
            </div>
          </div>
          <div className=" flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="p-0.5 rounded-full border-border">
                <Button width="w-8 h-8 rounded-full " />
              </div>
              <div className="">
                I confirm that I want to proceed with breaking this investment
                despite the financial implications.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex gap-6 items-center">
        <div className=" p-0.5 w-full mt-3 rounded-full relative primary-purple-to-blue ">
          <button className="cursor-pointer w-full rounded-full py-4 text-center bg-card font-black">
            Break Investment
          </button>
        </div>

        <Button
          type="primary"
          text="Keep Investment"
          width="w-full py-4 rounded-full"
        />
      </div>
    </div>
  );
}
