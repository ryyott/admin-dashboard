"use client";

import { LayoutGrid, RefreshCw, Mail, CreditCard, PieChart, Settings, HelpCircle, Bell } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InvoiceSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const navigationItems = [
  { id: "overview", icon: LayoutGrid, label: "Overview" },
  { id: "refresh", icon: RefreshCw, label: "Refresh" },
  { id: "email", icon: Mail, label: "Email" },
  { id: "payment", icon: CreditCard, label: "Payment" },
  { id: "analytics", icon: PieChart, label: "Analytics" },
];

const bottomItems = [
  { id: "settings", icon: Settings, label: "Settings" },
  { id: "help", icon: HelpCircle, label: "Help" },
  { id: "notifications", icon: Bell, label: "Notifications" },
];

export function InvoiceSidebar({ activeSection = "overview", onSectionChange }: InvoiceSidebarProps) {
  return (
    <div className="bg-background flex h-full flex-col border-r">
      {/* Navigation Items */}
      <div className="flex-1 space-y-2 py-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              className={cn("h-12 w-full", activeSection === item.id && "bg-accent")}
              onClick={() => onSectionChange?.(item.id)}
              title={item.label}
            >
              <Icon className="size-5" />
            </Button>
          );
        })}
      </div>

      {/* Bottom Items */}
      <div className="space-y-2 border-t py-4">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              className="h-12 w-full"
              onClick={() => onSectionChange?.(item.id)}
              title={item.label}
            >
              <Icon className="size-5" />
            </Button>
          );
        })}

        {/* User Avatar */}
        <div className="px-2 pt-2">
          <Avatar className="mx-auto size-10 cursor-pointer">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
