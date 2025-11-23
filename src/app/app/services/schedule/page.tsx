"use client";
import Button from "@/components/ui/Button";
import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";

export default function Schedule() {
  const [toggle, setToggle] = useState(true);

  return (
    <div className="w-full min-h-screen p-4">
      <div className=" flex justify-between w-full items-center">
        <h1 className="text-center gradient-text-purple-to-blue text-3xl">Schedules</h1>
        <button className="cursor-pointer">
          <Plus size={30} color="skyblue" />
        </button>
      </div>

      <div className="w-full space-y-4 mt-4">
        <div className="w-full rounded-2xl bg-card px-3 py-5">
          <div className="">
            <div className="flex w-full items-end justify-between">
              <div className="flex gap-1 items-center">
                <h1 className="text-5xl gradient-text-orange-to-purple">30</h1>
                <div className="text-sm pt-4">Days</div>
                <div className="text-xs pl-3 pt-4 text-stone-400">Student subscription</div>
              </div>

              <div
                className={`w-full p-1 rounded-full max-w-13 flex ${toggle ? "justify-end bg-white/20" : "justify-start bg-background"} items-center  `}
              >
                <button
                  onClick={() => setToggle(!toggle)}
                  className={` rounded-full h-5 w-5 ${toggle ? "primary-purple-to-blue" : "bg-card"}  `}
                ></button>
              </div>
            </div>
            <div className="text-xs text-stone-400">Once</div>
          </div>
        </div>
      </div>

      <AddSchedule />
    </div>
  );
}

export function AddSchedule() {
  const [type, setType] = useState("Days");
  const [toggle, setToggle] = useState(false);
  const [duration, setduration] = useState({
    duration: null as number | null,
    type: "",
  });

  const handleSetDuration = (duration: number, type: string) => {
    setduration((prev) => ({
      ...prev,
      duration,
      type,
    }));
  };
  return (
    <div className="space-y-4">
      <div className="w-full max-w-xs mx-auto bg-card flex items-center rounded-full ">
        {["Days", "Months"].map((text) => (
          <Button
            type={type === text ? "primary" : "card"}
            onclick={() => {
              (setType(text),
                setduration({
                  duration: null,
                  type: "",
                }));
            }}
            key={text}
          >
            {text}
          </Button>
        ))}
      </div>

      {type === "Days" ? (
        <div>
          <div className="flex w-fit relative">
            <button
              onClick={() => setToggle(!toggle)}
              className="bg-card w-full p-2 flex  gap-5 rounded-sm"
            >
              <span className="text-sm">
                {duration.duration
                  ? `${duration.duration} ${duration.type.toUpperCase()}`
                  : "Select Duration"}{" "}
              </span>
              <ChevronDown color="blue" size={20} />
            </button>
          </div>
          {toggle && (
            <div className="grid w-full max-w-25 max-h-70 bg-card p-3 rounded-2xl overflow-auto">
              {[
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                24, 25, 26, 27, 28, 29, 30,
              ].map((day) => (
                <button
                  onClick={() => {
                    (setToggle(!toggle), handleSetDuration(day, "day"));
                  }}
                  key={day}
                  className="flex w-full gap-3  justify-between space-y-4 hover:text-stone-200 hover:bg-background"
                >
                  <span>{day}</span>
                  <span className="w-full text-start">{day > 1 ? "Days" : "Day"}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex w-fit relative">
            <button
              onClick={() => setToggle(!toggle)}
              className="bg-card w-full p-2 flex  gap-5 rounded-sm"
            >
              <span className="text-sm">
                {duration.duration
                  ? `${duration.duration} ${duration.type.toUpperCase()}`
                  : "Select Duration"}{" "}
              </span>
              <ChevronDown color="blue" size={20} />
            </button>
          </div>

          {toggle && (
            <div className="grid w-full max-w-32 max-h-70 bg-card  rounded-md overflow-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                <button
                  onClick={() => {
                    (setToggle(!toggle), handleSetDuration(month, "months"));
                  }}
                  key={month}
                  className="flex w-full gap-3 justify-between space-y-4 hover:bg-hover px-3 py-2 hover:text-stone-200 hover:bg-background"
                >
                  <span>{month}</span>
                  <span className="w-full text-start">{month > 1 ? "Months" : "Month"}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
