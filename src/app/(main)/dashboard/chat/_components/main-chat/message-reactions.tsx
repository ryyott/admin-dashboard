"use client";

import { useState } from "react";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Reaction } from "@/types/chat";

interface MessageReactionsProps {
  messageId: string;
  reactions?: Reaction[];
  currentUserId: string;
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
  showPicker: boolean;
  onTogglePicker: () => void;
}

// Common emoji reactions
const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🎉", "🔥", "👏"];

export function MessageReactions({
  messageId,
  reactions = [],
  currentUserId,
  onAddReaction,
  onRemoveReaction,
  showPicker,
  onTogglePicker,
}: MessageReactionsProps) {
  const handleReactionClick = (emoji: string) => {
    const reaction = reactions.find((r) => r.emoji === emoji);
    const hasReacted = reaction?.userIds.includes(currentUserId);

    if (hasReacted) {
      onRemoveReaction(messageId, emoji);
    } else {
      onAddReaction(messageId, emoji);
    }

    onTogglePicker();
  };

  const hasReactions = reactions.length > 0;

  return (
    <div className="flex flex-col gap-2">
      {/* Inline Emoji Picker - Appears above reactions */}
      {showPicker && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="border-border bg-card relative rounded-full border px-3 py-2 shadow-lg">
            {/* Close button */}
            <button
              onClick={onTogglePicker}
              className="border-border bg-card hover:bg-accent absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border shadow-md transition-colors"
            >
              <X className="h-3 w-3" />
            </button>

            {/* Emoji Grid in Pill Shape */}
            <div className="flex items-center gap-1.5">
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  className="hover:bg-accent flex h-9 w-9 items-center justify-center rounded-full text-lg transition-all duration-200 hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Existing Reactions */}
      {hasReactions && (
        <div className="flex items-center gap-1">
          {reactions.map((reaction) => {
            const hasReacted = reaction.userIds.includes(currentUserId);
            return (
              <button
                key={reaction.emoji}
                onClick={() => handleReactionClick(reaction.emoji)}
                className={cn(
                  "group relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200",
                  "border hover:scale-110",
                  hasReacted
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-primary/5",
                )}
              >
                <span className="text-sm leading-none">{reaction.emoji}</span>
                <span className="text-xs leading-none font-semibold">{reaction.count}</span>

                {/* Hover tooltip showing who reacted */}
                <div className="bg-popover text-popover-foreground pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 scale-0 rounded-md px-2 py-1 text-xs opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                  {reaction.count === 1 ? "You" : `${reaction.count} people`}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
