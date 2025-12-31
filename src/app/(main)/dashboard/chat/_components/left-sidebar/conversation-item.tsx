"use client";

import Link from "next/link";

import { formatDistanceToNow } from "date-fns";
import { Pin, Volume2, VolumeX } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Conversation, User } from "@/types/chat";

interface ConversationItemProps {
  conversation: Conversation;
  users: Record<string, User>;
  isActive?: boolean;
}

export function ConversationItem({ conversation, users, isActive }: ConversationItemProps) {
  const getConversationPreview = () => {
    if (conversation.typingUsers && conversation.typingUsers.length > 0) {
      const typingUserNames = conversation.typingUsers
        .map((userId) => users[userId]?.name.split(" ")[0])
        .filter(Boolean)
        .join(", ");
      return `${typingUserNames} ${conversation.typingUsers.length === 1 ? "is" : "are"} typing...`;
    }
    const content = conversation.lastMessage?.content || "No messages yet";
    // Truncate to 35 characters max with ellipsis
    return content.length > 35 ? `${content.substring(0, 35)}...` : content;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return formatDistanceToNow(date, { addSuffix: false });
  };

  return (
    <Link
      href={`/page/chat/${conversation.id}`}
      className={cn(
        "hover:bg-accent block w-full rounded-lg p-2 text-left transition-all",
        isActive && "bg-accent",
        conversation.isPinned && "bg-muted/50",
      )}
    >
      <div className="flex items-start gap-2">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback>{conversation.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {conversation.type === "group" && (
            <div className="bg-primary text-primary-foreground absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold">
              {conversation.participants.length}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              <h3 className="truncate text-sm font-semibold">{conversation.name}</h3>
              {conversation.isPinned && <Pin className="text-muted-foreground h-3 w-3 shrink-0" />}
              {conversation.isMuted && <VolumeX className="text-muted-foreground h-3 w-3 shrink-0" />}
            </div>
            <span className="text-muted-foreground shrink-0 text-xs whitespace-nowrap">
              {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p
              className={cn(
                "min-w-0 flex-1 truncate text-xs",
                conversation.typingUsers && conversation.typingUsers.length > 0
                  ? "text-primary italic"
                  : "text-muted-foreground",
                conversation.unreadCount > 0 && "text-foreground font-medium",
              )}
            >
              {getConversationPreview()}
            </p>
            {conversation.unreadCount > 0 && (
              <Badge variant="default" className="h-5 min-w-5 shrink-0 rounded-full px-1.5 text-xs">
                {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
