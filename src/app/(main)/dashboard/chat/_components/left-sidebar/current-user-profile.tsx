"use client";

import { useState } from "react";

import { Mic, MicOff, Headphones, HeadphoneOff, Settings, ChevronDown, CircleDot } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { User } from "@/types/chat";

interface CurrentUserProfileProps {
  user: User;
  onOpenSettings?: () => void;
}

export function CurrentUserProfile({ user, onOpenSettings }: CurrentUserProfileProps) {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [userStatus, setUserStatus] = useState<User["status"]>(user.status);

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
        return "Invisible";
    }
  };

  return (
    <div className="bg-card flex items-center gap-2 px-4 py-2">
      {/* User Info with Status Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="hover:bg-accent flex flex-1 items-center gap-2 rounded-lg p-1 transition-colors">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "border-card absolute right-0 bottom-0 h-3 w-3 rounded-full border-2",
                  getStatusColor(userStatus),
                )}
              />
            </div>
            <div className="flex-1 overflow-hidden text-left">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="text-muted-foreground truncate text-xs">{getStatusText(userStatus)}</p>
            </div>
            <ChevronDown className="text-muted-foreground h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Set Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setUserStatus("online")} className="gap-2">
            <CircleDot className="h-4 w-4 text-green-500" />
            <span>Online</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUserStatus("idle")} className="gap-2">
            <CircleDot className="h-4 w-4 text-yellow-500" />
            <span>Idle</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUserStatus("dnd")} className="gap-2">
            <CircleDot className="h-4 w-4 text-red-500" />
            <span>Do Not Disturb</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUserStatus("offline")} className="gap-2">
            <CircleDot className="h-4 w-4 text-gray-400" />
            <span>Invisible</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Set Custom Status</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Voice Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-md",
            isMicMuted && "bg-destructive/10 text-destructive hover:bg-destructive/20",
          )}
          onClick={() => setIsMicMuted(!isMicMuted)}
        >
          {isMicMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-md",
            isDeafened && "bg-destructive/10 text-destructive hover:bg-destructive/20",
          )}
          onClick={() => setIsDeafened(!isDeafened)}
        >
          {isDeafened ? <HeadphoneOff className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={onOpenSettings}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
