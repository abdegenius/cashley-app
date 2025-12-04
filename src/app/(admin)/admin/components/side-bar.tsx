'use client';

import { EntityType} from "@/types/admin"
import { sidebarItems } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeEntity: EntityType;
  onEntityChange: (entity: EntityType) => void;
}

export default function Sidebar({ activeEntity, onEntityChange }: SidebarProps) {
  return (
    <div className="w-64 bg-card border-r h-screen">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">Management Dashboard</p>
      </div>
      <nav className="p-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={activeEntity === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                activeEntity === item.id && "bg-muted"
              )}
              onClick={() => onEntityChange(item.id)}
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