"use client";

import { useState } from "react";

import { Hash, Volume2, Plus, ChevronDown, ChevronRight, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Channel, Conversation, GroupRole, User } from "@/types/chat";

import { CurrentUserProfile } from "./current-user-profile";

interface ChannelListProps {
  conversation: Conversation;
  currentUserId: string;
  currentUser: User;
  activeChannelId?: string;
  onChannelSelect: (channelId: string) => void;
  onCreateChannel?: () => void;
  onOpenConversationsSheet?: () => void;
  onOpenSettings?: () => void;
}

export function ChannelList({
  conversation,
  currentUserId,
  currentUser,
  activeChannelId,
  onChannelSelect,
  onCreateChannel,
  onOpenConversationsSheet,
  onOpenSettings,
}: ChannelListProps) {
  const [textChannelsExpanded, setTextChannelsExpanded] = useState(true);
  const [voiceChannelsExpanded, setVoiceChannelsExpanded] = useState(true);

  // Get current user's role
  const currentUserRole: GroupRole = conversation.memberRoles?.find((r) => r.userId === currentUserId)?.role || "user";

  const canCreateChannels = currentUserRole === "owner" || currentUserRole === "editor";

  // Separate channels by type
  const textChannels = (conversation.channels || [])
    .filter((c) => c.type === "text")
    .sort((a, b) => a.position - b.position);

  const voiceChannels = (conversation.channels || [])
    .filter((c) => c.type === "voice")
    .sort((a, b) => a.position - b.position);

  return (
    <div className="bg-card flex h-full flex-col">
      {/* Group Header with Menu Button */}
      <div className="border-border shrink-0 border-b px-4 py-3">
        <div className="mb-1 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onOpenConversationsSheet}>
            <Menu className="h-4 w-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold">{conversation.name}</h2>
          </div>
          <Kbd className="shrink-0">⌘L</Kbd>
        </div>
        {conversation.description && (
          <p className="text-muted-foreground ml-10 line-clamp-2 text-xs">{conversation.description}</p>
        )}
      </div>

      {/* Channels */}
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-2">
          {/* Text Channels */}
          <div>
            <button
              onClick={() => setTextChannelsExpanded(!textChannelsExpanded)}
              className="text-muted-foreground hover:text-foreground flex w-full items-center gap-1 px-2 py-1 text-xs font-semibold transition-colors"
            >
              {textChannelsExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              <span>TEXT CHANNELS</span>
              {canCreateChannels && (
                <Plus
                  className="hover:text-foreground ml-auto h-4 w-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateChannel?.();
                  }}
                />
              )}
            </button>

            {textChannelsExpanded && (
              <div className="mt-1 space-y-0.5">
                {textChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => onChannelSelect(channel.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                      activeChannelId === channel.id
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )}
                  >
                    <Hash className="h-4 w-4 shrink-0" />
                    <span className="truncate">{channel.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Voice Channels */}
          <div>
            <button
              onClick={() => setVoiceChannelsExpanded(!voiceChannelsExpanded)}
              className="text-muted-foreground hover:text-foreground flex w-full items-center gap-1 px-2 py-1 text-xs font-semibold transition-colors"
            >
              {voiceChannelsExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              <span>VOICE CHANNELS</span>
              {canCreateChannels && (
                <Plus
                  className="hover:text-foreground ml-auto h-4 w-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateChannel?.();
                  }}
                />
              )}
            </button>

            {voiceChannelsExpanded && (
              <div className="mt-1 space-y-0.5">
                {voiceChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => onChannelSelect(channel.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                      activeChannelId === channel.id
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )}
                  >
                    <Volume2 className="h-4 w-4 shrink-0" />
                    <span className="truncate">{channel.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* User Profile - pinned to bottom */}
      <div className="border-border shrink-0 border-t">
        <CurrentUserProfile user={currentUser} onOpenSettings={onOpenSettings} />
      </div>
    </div>
  );
}
