import React from "react";
import Image from "next/image";
import { Check, Dot, Minus, ShieldQuestion } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Swap() {
  return (
    <div className="space-y-8 h-full w-full">
      <h1 className="text-3xl font-black">Crypto Swap</h1>

      <div className="w-full bg-card rounded-xl flex-col flex items-center justify-center p-4 gap-2">
        <Image src={"/svg/swap.svg"} alt="piggy bank " width={100} height={100} />
        <h1 className="text-lg font-semibold">Crypto Swap</h1>
        <div className="text-center max-w-md">
          All cryptocurrencies received with Cashley will be automatically converted to USDT and
          sent to your USDT account
        </div>
      </div>

      <div className="w-full space-y-4">
        <h3 className="text-xl font-black">Current Exchange Rates</h3>

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

        <div className="w-full flex justify-end">
          <Link href="">View more</Link>
        </div>
      </div>

      <div className="w-full space-y-4">
        <h3 className="text-xl font-black">How it Works</h3>

        <div className=" flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <div className="w-15 h-15 rounded-full bg-card text-lg flex items-center justify-center">
              1
            </div>
            <div className="">
              <div className="font-black text-lg">Receive Crypto</div>
              <div className="">Receive cryptocurrency through correct wallet</div>
            </div>
          </div>
        </div>
        <div className=" flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <div className="w-15 h-15 rounded-full bg-card text-lg flex items-center justify-center">
              2
            </div>
            <div className="">
              <div className="font-black text-lg">Crypto Coversion </div>
              <div className="">System automatically coverts to USDT at market rate</div>
            </div>
          </div>
        </div>
        <div className=" flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <div className="w-15 h-15 rounded-full bg-card text-lg flex items-center justify-center">
              3
            </div>
            <div className="">
              <div className="font-black text-lg">USDT Added </div>
              <div className="">Converted USDT is credited to your balance</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full space-y-2 pt-3">
        <h3 className="text-xl font-black pb-2">Benefit of Auto Swap</h3>

        <div className=" flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Check size={30} className="stroke-1" />
            <div className="">
              <div className="">No manual intervention required</div>
            </div>
          </div>
        </div>
        <div className=" flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Check size={30} className="stroke-1" />
            <div className="">
              <div className="">Avoid market volatility</div>
            </div>
          </div>
        </div>
        <div className=" flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Check size={30} className="stroke-1" />
            <div className="">
              <div className="">Instant conversion at best rates</div>
            </div>
          </div>
        </div>
        <div className=" flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Check size={30} className="stroke-1" />
            <div className="">
              <div className="">
                {" "}
                <div className=" flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <div className="">
                      <div className="">Instant conversion at best rates</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button type="primary" text="Receive Crypto" />

      <div className="w-full space-y-2 pt-3">
        <h3 className="text-xl font-black pb-2">Benefit of Auto Swap</h3>

        <div className=" flex justify-between items-center"></div>
        <div className=" flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Dot size={30} className="stroke-1" />
            <div className="">
              <div className=""> Rates updates every 30 seconds</div>
            </div>
          </div>
        </div>
        <div className=" flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Dot size={30} className="stroke-1" />
            <div className="">
              <div className="">Minimum amount: $10 equivalent</div>
            </div>
          </div>
        </div>
        <div className=" flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Dot size={30} className="stroke-1" />
            <div className="">
              <div className="">
                {" "}
                <div className=" flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <div className="">
                      <div className="">Conversion fee: 0.5% per transaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <ShieldQuestion size={30} className="placeholder-text" />
          <div className="">
            <div className="font-black text-lg">Got Futher Questions?</div>
            <div className="">
              Having trouble with understanding crypto swap? Our FAQ will help.
            </div>
          </div>
        </div>
      </div>
      <div className=" p-0.5 w-full mt-3 rounded-full relative primary-purple-to-blue ">
        <button className="cursor-pointer w-full rounded-full py-4 text-center bg-card font-black">
          Go to FAQ
        </button>
      </div>
    </div>
  );
}
