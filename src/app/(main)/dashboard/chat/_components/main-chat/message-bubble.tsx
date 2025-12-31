"use client";

import { useState } from "react";

import { format } from "date-fns";
import { MoreVertical, Reply, Smile } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Message, User } from "@/types/chat";

import { UserProfilePopover } from "../user-profile-popover";

import { MessageReactions } from "./message-reactions";

interface MessageBubbleProps {
  message: Message;
  user: User;
  isOwn: boolean;
  showAvatar?: boolean;
  isGrouped?: boolean;
  currentUserId?: string;
  onAddReaction?: (messageId: string, emoji: string) => void;
  onRemoveReaction?: (messageId: string, emoji: string) => void;
}

export function MessageBubble({
  message,
  user,
  isOwn,
  showAvatar = true,
  isGrouped = false,
  currentUserId,
  onAddReaction,
  onRemoveReaction,
}: MessageBubbleProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const formatMessageTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  return (
    <div
      className={cn(
        "group hover:bg-accent/50 flex gap-3 px-6 py-1.5 transition-colors",
        isOwn && "flex-row-reverse",
        isGrouped && "mt-0.5",
        !isGrouped && "mt-4",
      )}
    >
      {/* Avatar */}
      {showAvatar ? (
        <UserProfilePopover user={user} currentUserId={currentUserId}>
          <button className="shrink-0 cursor-pointer transition-opacity hover:opacity-80">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xs">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </button>
        </UserProfilePopover>
      ) : (
        <div className="w-9 shrink-0" />
      )}

      {/* Message Content */}
      <div className={cn("flex flex-1 flex-col gap-1", isOwn && "items-end")}>
        {!isGrouped && (
          <div className={cn("flex items-center gap-2", isOwn && "flex-row-reverse")}>
            <span className="text-sm font-semibold">{user.name}</span>
            <span className="text-muted-foreground text-xs">{formatMessageTime(message.timestamp)}</span>
          </div>
        )}

        <div className={cn("flex items-start gap-2", isOwn && "flex-row-reverse")}>
          <div
            className={cn(
              "group/message relative max-w-[500px] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
              isOwn ? "bg-primary text-primary-foreground" : "bg-card border-border border",
            )}
          >
            <p className="leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>

            {message.isEdited && (
              <span
                className={cn("mt-1 text-xs italic", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}
              >
                (edited)
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg"
              onClick={() => setShowReactionPicker(!showReactionPicker)}
            >
              <Smile className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
              <Reply className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit message</DropdownMenuItem>
                <DropdownMenuItem>Copy text</DropdownMenuItem>
                <DropdownMenuItem>Pin message</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete message</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Message Reactions - Below the message bubble */}
        {currentUserId && onAddReaction && onRemoveReaction && (
          <div className={cn("mt-2 px-1", isOwn && "flex justify-end")}>
            <MessageReactions
              messageId={message.id}
              reactions={message.reactions}
              currentUserId={currentUserId}
              onAddReaction={onAddReaction}
              onRemoveReaction={onRemoveReaction}
              showPicker={showReactionPicker}
              onTogglePicker={() => setShowReactionPicker(!showReactionPicker)}
            />
          </div>
        )}

        {/* Image Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div
            className={cn(
              "mt-1 grid gap-2",
              message.attachments.length === 1 && "grid-cols-1",
              message.attachments.length === 2 && "grid-cols-2",
              message.attachments.length > 2 && "grid-cols-2 md:grid-cols-3",
            )}
          >
            {message.attachments.map((attachment) => (
              <div key={attachment.id} className="border-border overflow-hidden rounded-xl border">
                <img src={attachment.url} alt={attachment.name} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
