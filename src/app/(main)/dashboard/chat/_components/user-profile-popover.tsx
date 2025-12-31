"use client";

import { useState } from "react";

import { MessageSquare, Phone, Video, UserPlus, MoreHorizontal, Mail, Calendar } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { User } from "@/types/chat";

interface UserProfilePopoverProps {
  user: User;
  children: React.ReactNode;
  currentUserId?: string;
}

export function UserProfilePopover({ user, children, currentUserId }: UserProfilePopoverProps) {
  const [open, setOpen] = useState(false);
  const isCurrentUser = currentUserId === user.id;

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

  const getStatusText = (status: User["status"]) => {
    switch (status) {
      case "online":
        return "Online";
      case "idle":
        return "Idle";
      case "dnd":
        return "Do Not Disturb";
      default:
        return "Offline";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[340px] overflow-hidden p-0" align="start" side="right" sideOffset={8}>
        {/* Banner/Header with gradient */}
        <div className="from-primary/80 to-primary relative h-16 bg-gradient-to-br" />

        {/* Content */}
        <div className="relative px-4 pb-4">
          {/* Avatar with status indicator */}
          <div className="relative -mt-10 mb-3 w-fit">
            <div className="border-background bg-background rounded-full border-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <div
              className={cn(
                "border-background absolute right-1 bottom-1 h-5 w-5 rounded-full border-4",
                getStatusColor(user.status),
              )}
            />
          </div>

          {/* User Info */}
          <div className="mb-3 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              {isCurrentUser && (
                <Badge variant="secondary" className="text-xs">
                  You
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">{user.statusMessage || getStatusText(user.status)}</p>
          </div>

          <Separator className="my-3" />

          {/* Roles/Badges */}
          {user.role && (
            <>
              <div className="mb-3 space-y-2">
                <h4 className="text-muted-foreground text-xs font-semibold uppercase">Roles</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-1.5">
                    <div className="bg-primary h-2 w-2 rounded-full" />
                    {user.role}
                  </Badge>
                </div>
              </div>
              <Separator className="my-3" />
            </>
          )}

          {/* Additional Info */}
          {user.email && (
            <div className="mb-3 space-y-2">
              <h4 className="text-muted-foreground text-xs font-semibold uppercase">Contact</h4>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">{user.email}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          {!isCurrentUser && (
            <>
              <Separator className="my-3" />
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-auto flex-col gap-1 py-2"
                  onClick={() => {
                    console.log("Send message to:", user.id);
                    setOpen(false);
                  }}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-xs">Message</span>
                </Button>
                <Button variant="secondary" size="sm" className="h-auto flex-col gap-1 py-2">
                  <Phone className="h-5 w-5" />
                  <span className="text-xs">Call</span>
                </Button>
                <Button variant="secondary" size="sm" className="h-auto flex-col gap-1 py-2">
                  <Video className="h-5 w-5" />
                  <span className="text-xs">Video</span>
                </Button>
                <Button variant="secondary" size="sm" className="h-auto flex-col gap-1 py-2">
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="text-xs">More</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
