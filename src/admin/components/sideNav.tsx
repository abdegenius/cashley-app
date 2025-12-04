import { Banknote, DollarSign, Grid2X2, Users, Wifi } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import Button from "./ui/Button";

interface SideNavProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export default function SideNav({ activeTab, setActiveTab }: SideNavProps) {
  const tabs = [
    { name: "Dashboard", icon: Grid2X2 },
    { name: "Users", icon: Users },
    { name: "Service", icon: Wifi },
    { name: "Transactions", icon: Banknote },
    { name: "Currencies", icon: DollarSign },
    { name: "Leaderboard", icon: DollarSign },
    { name: "Savings", icon: DollarSign },
    { name: "Swap", icon: DollarSign },
  ];
  return (
    <div className="w-full max-w-50 border-r border-stone-200 h-screen shadow-lg">
      <h1 className="text-blue-700 font-semibold text-xl flex items-center justify-center h-20">
        Admin
      </h1>
      <div className="w-full h-full ">
        {tabs?.map((tab, index) => (
          <Button
            key={index}
            onclick={() => setActiveTab(tab.name)}
            type={activeTab === tab.name ? "primary" : "secondary"}
            text={tab.name}
            width="w-full rounded-none text-start px-3 font-medium"
          />
        ))}
      </div>
    </div>
  );
}
