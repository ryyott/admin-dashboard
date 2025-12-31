"use client";

import { MoreVertical, Crown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { User } from "@/types/chat";

import { UserProfilePopover } from "../user-profile-popover";

interface MembersListProps {
  members: User[];
  showMore?: boolean;
}

export function MembersList({ members, showMore = false }: MembersListProps) {
  const displayMembers = showMore ? members : members.slice(0, 8);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Member <span className="text-muted-foreground ml-1">+{members.length}</span>
        </h3>
        {members.length > 8 && (
          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
            {showMore ? "Show less" : "Show all"}
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {displayMembers.map((member, index) => (
          <div
            key={member.id}
            className="group hover:bg-accent flex items-center gap-3 rounded-lg p-2 transition-colors"
          >
            <UserProfilePopover user={member}>
              <button className="relative cursor-pointer transition-opacity hover:opacity-80">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-xs">{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "border-background absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2",
                    member.status === "online" && "bg-green-500",
                    member.status === "idle" && "bg-yellow-500",
                    member.status === "dnd" && "bg-red-500",
                    member.status === "offline" && "bg-gray-400",
                  )}
                />
              </button>
            </UserProfilePopover>

            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-medium">{member.name}</p>
                {index === 0 && <Crown className="h-3 w-3 text-yellow-500" fill="currentColor" />}
              </div>
              <p className="text-muted-foreground truncate text-xs">
                {member.role || member.statusMessage || "Member"}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View profile</DropdownMenuItem>
                <DropdownMenuItem>Send message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Make admin</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Remove from group</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {members.length > displayMembers.length && (
        <Button variant="outline" className="w-full rounded-xl" size="sm">
          +{members.length - displayMembers.length} more members
        </Button>
      )}
    </div>
  );
}
