"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/types/chat";

interface UserItemProps {
  user: User;
  isActive?: boolean;
}

export function UserItem({ user, isActive }: UserItemProps) {
  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "dnd":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <button
      className={cn("hover:bg-accent block w-full rounded-lg p-3 text-left transition-all", isActive && "bg-accent")}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-sm">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div
            className={cn(
              "border-card absolute right-0 bottom-0 h-3 w-3 rounded-full border-2",
              getStatusColor(user.status),
            )}
          />
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="truncate text-sm font-semibold">{user.name}</p>
          </div>
          <p className="text-muted-foreground truncate text-xs">{user.statusMessage || "No messages yet"}</p>
        </div>
      </div>
    </button>
  );
}
