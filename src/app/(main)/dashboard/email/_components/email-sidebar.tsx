"use client";

import { Mail, Star, Send, FileText, Trash, AlertOctagon, Settings } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useEmailStore } from "@/stores/email-store";
import type { EmailView } from "@/types/email";

interface SidebarItem {
  id: EmailView;
  label: string;
  icon: React.ElementType;
  count?: number;
}

const sidebarItems: SidebarItem[] = [
  { id: "inbox", label: "Inbox", icon: Mail, count: 235 },
  { id: "starred", label: "Starred", icon: Star },
  { id: "sent", label: "Sent", icon: Send },
  { id: "drafts", label: "Drafts", icon: FileText },
  { id: "deleted", label: "Deleted", icon: Trash },
  { id: "spam", label: "Spam", icon: AlertOctagon, count: 53 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function EmailSidebar() {
  const { filters, setView } = useEmailStore();

  return (
    <aside className="border-border bg-card hidden w-[76px] shrink-0 flex-col border-r md:flex">
      <TooltipProvider delayDuration={0}>
        <div className="flex flex-1 flex-col items-center space-y-2 p-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = filters.view === item.id;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setView(item.id)}
                    className={cn(
                      "relative flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-150",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.count && (
                      <span className="bg-primary text-primary-foreground absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold">
                        {item.count > 99 ? "99+" : item.count}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        <div className="border-border border-t p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="relative flex h-12 w-12 items-center justify-center">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-600 text-sm font-semibold text-white">
                    LK
                  </AvatarFallback>
                </Avatar>
                <span className="border-card absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 bg-green-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Lara Kathleen</p>
              <p className="text-muted-foreground text-xs">lara@kathleen.io</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </aside>
  );
}
