"use client";

import React from "react";
import Image from "next/image";
import { Copy } from "lucide-react";

export default function ReferralProgram() {
  const referralCode = "ELEMENTS/SCS";

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      alert("Referral code copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="space-y-6  overflow-scroll">
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

        <div className="w-full max-w-md grid grid-cols-2 gap-6 mt-4">
          <div className="p-0.5 w-full rounded-3xl relative primary-orange-to-purple">
            <button className="cursor-pointer w-full rounded-3xl py-3 text-center bg-card font-black flex-col flex items-center justify-center gap-2">
              <span className="text-2xl font-black">₦500</span>
              <span>Total Earned</span>
            </button>
          </div>
          <div className="p-0.5 w-full rounded-3xl relative primary-purple-to-blue">
            <button className="cursor-pointer w-full rounded-3xl py-3 text-center bg-card font-black flex-col flex items-center justify-center gap-2">
              <span className="text-2xl font-black">2</span>
              <span>Friends Referred</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-border rounded-2xl bg-card p-8">
        <div className="">
          <h1 className="text-xl font-black">Refer & Earn</h1>
          <div>Error (NGO for user) found your refer</div>
        </div>
        <div className="text-sm w-full flex justify-between items-center pt-4 mx-auto">
          <div className="w-full items-center">
            <div>Your Return Online</div>
            <div className="text-lg font-semibold">{referralCode}</div>
          </div>
          <button 
            onClick={handleCopyCode}
            className="cursor-pointer hover:bg-hover p-2 rounded-full "
          >
            <Copy size={24} />
          </button>
        </div>
        <div className="w-full mt-4">
          <div className="p-0.5 w-full rounded-full relative primary-purple-to-blue">
            <button className="cursor-pointer w-full rounded-full py-3 text-center  font-black flex items-center justify-center gap-2">
              Share Referral Code
            </button>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="space-y-4 rounded-2xl p-6">
        <h1 className="text-xl font-black">How it Works</h1>
        <div className="text-sm w-full space-y-6 pt-4 mx-auto">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center flex-shrink-0 mt-1">
              <span className="font-bold">1</span>
            </div>
            <div>
              <div className="font-black text-lg">Share your code</div>
              <div className="text-muted-foreground">
                Send your referral code to friends via SMS, WhatsApp, or social
                Media
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-bold">2</span>
            </div>
            <div>
              <div className="font-black text-lg">Friend signs up</div>
              <div className="text-muted-foreground">
                They create an account using your referral code
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-bold">3</span>
            </div>
            <div>
              <div className="font-black text-lg"> </div>
              <div className="text-muted-foreground">
                Get ₦1,500 when they make their first transaction worth ₦5,000+
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="space-y-4 w-full rounded-2xl p-6">
        <h1 className="text-xl w-full font-black">Recent Referrals</h1>
        <div className="text-sm w-full space-y-6  pt-4 mx-auto">
          <div className="flex justify-between w-full py-3  items-center">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 relative overflow-hidden rounded-full bg-card flex items-center justify-center flex-shrink-0 mt-1">
                <Image src={"/globe.svg"} alt="users" fill className="object-cover" />
              </div>
              <div className="">
                <div className="font-black text-lg">Mike Chen</div>
                <div className="text-muted-foreground">Joined 5 days ago</div>
              </div>
            </div>
            <div className="">
              <div className="font-black text-lg">₦1,500</div>
              <div className="text-muted-foreground">Earned</div>
            </div>
          </div>

          <div className="flex justify-between w-full items-center">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 relative overflow-hidden rounded-full bg-card flex items-center justify-center flex-shrink-0 mt-1">
                <Image src={"/globe.svg"} alt="users" fill className="object-cover" />
              </div>
              <div className="">
                <div className="font-black text-lg">Search Software</div>
                <div className="text-muted-foreground">Joined 2 days ago</div>
              </div>
            </div>
            <div className="">
              <div className="font-black text-lg">Pending</div>
              <div className="text-muted-foreground">No transaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-4 border-border rounded-2xl p-6">
        <h1 className="text-xl font-black">Terms & Conditions</h1>
        <div className="text-sm w-full space-y-4 pt-4 mx-auto">
          <div className="flex gap-4 items-start">
            <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center flex-shrink-0 mt-1">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
            <div>
              Referral bonus paid after friend's first ₦5,000+ transaction
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center flex-shrink-0 mt-1">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
            <div>Friend must be a new user to Qpay</div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center flex-shrink-0 mt-1">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
            <div>Bonus credited within 24 hours of qualifying transaction</div>
          </div>
        </div>
      </div>
    </div>
  );
}