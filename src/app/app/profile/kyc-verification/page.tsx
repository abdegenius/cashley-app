import Image from "next/image";
import React from "react";

export default function KYCVerification() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold">KYC Verification</h1>
        <h2 className="text-lg">
          Verify your identity to enjoy better transaction limit.
        </h2>
      </div>

      <div className="rounded-lg  bg-card flex-col  py-5  flex items-center justify-center">
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
    </div>
  );
}
