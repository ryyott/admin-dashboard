"use client";

import { Phone, Video, MoreVertical, Search, Pin, VolumeX, Info, Hash, Volume2, Settings } from "lucide-react";

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
import type { Conversation, User } from "@/types/chat";

interface ChatHeaderProps {
  conversation: Conversation;
  users: Record<string, User>;
  activeChannelId?: string;
  onToggleSidebar?: () => void;
  onToggleSettings?: () => void;
}

export function ChatHeader({
  conversation,
  users,
  activeChannelId,
  onToggleSidebar,
  onToggleSettings,
}: ChatHeaderProps) {
  const activeChannel = conversation.channels?.find((c) => c.id === activeChannelId);
  const getParticipantsStatus = () => {
    if (conversation.type === "direct") {
      const otherUser = users[conversation.participants.find((id) => id !== conversation.participants[0]) || ""];
      return otherUser?.status || "offline";
    }
    return `${conversation.participants.length} members`;
  };

  return (
    <div className="border-border bg-card flex h-16 items-center justify-between border-b px-6">
      {/* Left Section - Conversation Info */}
      <div className="flex items-center gap-3">
        {conversation.type === "group" && activeChannel ? (
          /* Group with active channel - show channel icon and name */
          <>
            {activeChannel.type === "text" ? (
              <Hash className="text-muted-foreground h-6 w-6" />
            ) : (
              <Volume2 className="text-muted-foreground h-6 w-6" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">{activeChannel.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{activeChannel.description || conversation.name}</span>
              </div>
            </div>
          </>
        ) : (
          /* Direct message or group without channel - show avatar */
          <>
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.avatar} alt={conversation.name} />
              <AvatarFallback>{conversation.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">{conversation.name}</h2>
                {conversation.isPinned && <Pin className="text-muted-foreground h-3.5 w-3.5" />}
                {conversation.isMuted && <VolumeX className="text-muted-foreground h-3.5 w-3.5" />}
              </div>
              <div className="flex items-center gap-2">
                {conversation.typingUsers && conversation.typingUsers.length > 0 ? (
                  <span className="text-primary text-xs italic">
                    {conversation.typingUsers
                      .map((userId) => users[userId]?.name.split(" ")[0])
                      .filter(Boolean)
                      .join(", ")}{" "}
                    {conversation.typingUsers.length === 1 ? "is" : "are"} typing...
                  </span>
                ) : (
                  <span className="text-muted-foreground text-xs">{getParticipantsStatus()}</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={onToggleSidebar}>
          <Info className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={onToggleSettings}>
          <Settings className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{conversation.isPinned ? "Unpin" : "Pin"} conversation</DropdownMenuItem>
            <DropdownMenuItem>{conversation.isMuted ? "Unmute" : "Mute"} notifications</DropdownMenuItem>
            <DropdownMenuItem>Search in conversation</DropdownMenuItem>
            <DropdownMenuItem>View media</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete conversation</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
