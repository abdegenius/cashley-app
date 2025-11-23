import { Plus } from "lucide-react";
import React from "react";

export default function Schedule() {
  return (
    <div className="w-full min-h-screen ">
      <div className=" flex justify-between w-full items-center">
        <h1 className="text-center gradient-text-purple-to-blue text-3xl">Schedules</h1>
        <button className="cursor-pointer">
            <Plus  size={30} color="skyblue"/>
        </button>
      </div>

        <div className="w-full space-y-4">
            <div className="w-full rounded-2xl bg-card px-3 py-5">
                <div className="">
                    <div className="flex w-full items-end justify-between">
                        <h1>30 days</h1>

                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
