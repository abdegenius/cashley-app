import React from "react";

export default function ActiveInvestment() {
  return (
    <div className="w-full h-full space-y-6">
      <h1 className="text-3xl font-black">Active Investments</h1>
      <div className="w-full bg-card rounded-xl flex-col flex items-center justify-center px-4 py-8 gap-2">
        <h1 className="text-lg font-semibold">6 Months Plan</h1>
        <h1 className="text-3xl font-semibold">₦12,450.00</h1>
        <div className="text-center max-w-md">65 days left</div>
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

        <div>Total Returns</div>
        <div className="text-lg font-black">₦23,500</div>
        <div className=" p-0.5 w-full mt-3 rounded-full relative primary-purple-to-blue ">
          <button className="cursor-pointer w-full rounded-full py-4 text-center bg-card font-black">
            Break
          </button>
        </div>
      </div>
      <div className="w-full bg-card rounded-xl flex-col flex items-center justify-center px-4 py-8 gap-2">
        <h1 className="text-lg font-semibold">6 Months Plan</h1>
        <h1 className="text-3xl font-semibold">₦12,450.00</h1>
        <div className="text-center max-w-md">65 days left</div>
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

        <div>Total Returns</div>
        <div className="text-lg font-black">₦23,500</div>
        <div className=" p-0.5 w-full mt-3 rounded-full relative primary-purple-to-blue ">
          <button className="cursor-pointer w-full rounded-full py-4 text-center bg-card font-black">
            Break
          </button>
        </div>
      </div>
    </div>
  );
}
