'use client';

import { EntityType} from "@/types/admin"
import { sidebarItems } from '@/lib/data';
import { Button } from '@/components/ui/buttonshed';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction } from "react";

interface SidebarProps {
  activeEntity: EntityType;
  onEntityChange: (entity: EntityType) => void;
  setToggle: Dispatch<SetStateAction<boolean>>
}

export default function Sidebar({ activeEntity, onEntityChange, setToggle }: SidebarProps) {
  return (
    <div className="fixed z-[99] top-0 left-0 w-[300px] bg-admin text-background border-r border-stone-300 h-screen">
      <div className="px-6 py-4 border-b border-stone-300">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-1.5">Management Dashboard</p>
      </div>
      <nav className="px-4 py-12">
        <div className="space-y-6 h-full overflow-y-auto">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={activeEntity === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 text-xl font-medium text-background",
                activeEntity === item.id && "bg-muted"
              )}
              onClick={() => {onEntityChange(item.id); setToggle(false)}}
            >
              {/* <span className="text-lg">{item.icon}</span> */}
              {item.label}
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
}