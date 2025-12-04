"use client";

import { EntityType } from "@/types/admin";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HeaderProps {
  activeEntity: EntityType;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const entityLabels: Record<EntityType, string> = {
  dashboard: "Dashboard",
  users: "Users",
  transactions: "Transactions",
  wallets: "Wallets",
  electricity: "Electricity",
  data: "Data",
  airtime: "Airtime",
  "tv-subscription": "tv-subscription",
};

export default function Header({ activeEntity, searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{entityLabels[activeEntity]}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your {activeEntity.toLowerCase()} efficiently
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative w-80">
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

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">A</span>
            </div>
            <div className="text-sm">
              <p className="font-medium">Admin User</p>
              <p className="text-muted-foreground">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
