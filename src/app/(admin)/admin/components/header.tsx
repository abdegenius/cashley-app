"use client";

import { EntityType } from "@/types/admin";
import { Input } from "@/components/ui/input";
import { Menu, Search } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import SideNav from "@/admin/components/sideNav";
import Sidebar from "./side-bar";

interface HeaderProps {
  activeEntity: EntityType;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEntityChange: (entity: EntityType) => void;

}

const entityLabels: Record<EntityType, string> = {
  dashboard: "Dashboard",
  users: "Users",
  wallets: "Wallets",
  transactions: "Transactions",
  airtime: "Airtime Purchases",
  data: "Data Subscriptions",
  electricity: "Electricity Bills",
  "tv-subscription": "Cable/TV subscription",
};

export default function Header({ activeEntity, searchQuery, onSearchChange,  onEntityChange }: HeaderProps) {
  const [toggle, setToggle] = useState(false)
  return (
    <header className="w-full z-[98] sticky bg-foreground text-background border-b border-stone-300 px-6 py-4">
      <div className="flex  w-full flex-row items-center justify-between">
        <div className="text-start w-full">
          <h1 className="text-2xl font-bold">{entityLabels[activeEntity]}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your {activeEntity.toLowerCase()} efficiently
          </p>
        </div>

        {/* Search Bar */}
        <div className=" flex w-full justify-end items-center gap-4 relative">
          <div className="relative hidden lg:flex w-full">
            <Input
              type="text"
              placeholder={`Search ${activeEntity}...`}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <button onClick={() => setToggle(!toggle)} className="lg:hidden">
            <Menu />
          </button>
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">A</span>
            </div>
            <div className="text-sm hidden lg:block">
              <p className="font-medium">Admin User</p>
              <p className="text-muted-foreground">Administrator</p>
            </div>
          </div>
        </div>
      </div>
      {toggle && <Sidebar setToggle={setToggle}  onEntityChange={onEntityChange} activeEntity={activeEntity}  />}
      
    </header>
  );
}
