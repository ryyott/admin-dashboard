"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EmailCategory } from "@/types/email";

interface MailCategoryTabsProps {
  activeCategory: EmailCategory;
  onCategoryChange: (category: EmailCategory) => void;
  categoryCounts: Record<EmailCategory, number>;
}

interface Tab {
  id: EmailCategory;
  label: string;
  icon?: React.ElementType;
}

const tabs: Tab[] = [
  { id: "primary", label: "Primary", icon: Star },
  { id: "company", label: "Company" },
  { id: "promotions", label: "Promotions" },
  { id: "socials", label: "Socials" },
  { id: "updates", label: "Updates" },
];

export function MailCategoryTabs({ activeCategory, onCategoryChange, categoryCounts }: MailCategoryTabsProps) {
  return (
    <div className="border-border bg-background scrollbar-hide flex items-center gap-0.5 overflow-x-auto border-b px-2 py-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const count = categoryCounts[tab.id];
        const isActive = activeCategory === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onCategoryChange(tab.id)}
            className={cn(
              "relative flex min-w-fit shrink-0 items-center justify-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            <span>{tab.label}</span>
            {count > 0 && (
              <Badge
                variant={isActive ? "default" : "secondary"}
                className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-[10px] font-semibold"
              >
                {count}
              </Badge>
            )}
            {isActive && (
              <motion.div
                layoutId="tab-underline"
                className="bg-primary absolute right-0 bottom-0 left-0 h-0.5"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
