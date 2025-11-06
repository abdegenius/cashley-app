import React from "react";

export default function Card() {
  return (
    <div className="space-y-8 h-full w-full">
      <div>
        <h1 className="text-3xl font-black">Card</h1>
        <h2>Experience seamless and secure transactions with cashley card</h2>
      </div>

      <div className="w-full transform-3d border-border overflow-hidden flex relative rounded-3xl min-h-60">
        <div className="-translate-z-0 -ml-30 sm:-ml-40 rounded-2xl rotate-z-50 sm:rotate-z-40 w-50 sm:w-80 h-70 z-50 bg-[#0EB6CF] absolute " />
        <div className="-translate-z-0 -ml-25 sm:-ml-30 rounded-2xl rotate-z-50 sm:rotate-z-40 w-50 sm:w-80 h-70 z-50 bg-[#0EB6CF]/40 absolute " />
        <div className="-translate-z-0 -ml-20 sm:-ml-20 rounded-2xl rotate-z-50 sm:rotate-z-40 w-50 sm:w-80 h-70 z-40 bg-[#0EB6CF]/30 absolute " />
        <div className="-translate-z-0 -ml-15 sm:-ml-10 rounded-2xl rotate-z-50 sm:rotate-z-40 w-50 sm:w-80 h-70 z-30 bg-[#0EB6CF]/20 absolute " />
        <div className="-translate-z-0 -ml-10 sm:-ml-0 rounded-2xl rotate-z-50 sm:rotate-z-40 w-50 sm:w-80 h-70 z-20 bg-[#0EB6CF]/10 absolute " />
        <div className="w-full min-h-60 flex flex-col z-99">
          <div className="w-full h-1/2" />

          <div className="w-full h-1/2 flex justify-between flex-col">
            <h1 className="w-full text-center text-2xl sm:text-4xl font-black">
              6219 8610 0287 0287
            </h1>

            <div className=" sm:w-full gap-5 pb-3 flex font-semibold text-lg justify-between items-center max-w-sm mx-auto">
              <div>Ejembi Benedict O.</div>

              <div>08/29</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full rounded-2xl border-border p-6 space-y-6">
        <h2 className="text-2xl font-black">Get your virtual cards for online purchases</h2>

        <ul className="list-disc text-lg pl-5 space-y-1">
          <li>No monthly fees or minimum balance.</li>
          <li>Pay bills early with delay</li>
          <li>Top up card with various means</li>
        </ul>
      </div>
    </div>
  );
}
