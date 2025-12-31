"use client";

import { useState } from "react";

import { format } from "date-fns";
import { Pause, Play } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Message, User } from "@/types/chat";

interface AudioMessageProps {
  message: Message;
  user: User;
  isOwn: boolean;
}

export function AudioMessage({ message, user, isOwn }: AudioMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatMessageTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  if (!message.audioData) return null;

  const progress = (currentTime / message.audioData.duration) * 100;

  return (
    <div className={cn("group hover:bg-accent/50 flex gap-3 px-6 py-3 transition-colors", isOwn && "flex-row-reverse")}>
      {/* Avatar */}
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="text-xs">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      {/* Audio Content */}
      <div className={cn("flex flex-1 flex-col gap-1.5", isOwn && "items-end")}>
        <div className={cn("flex items-center gap-2", isOwn && "flex-row-reverse")}>
          <span className="text-sm font-semibold">{user.name}</span>
          <span className="text-muted-foreground text-xs">{formatMessageTime(message.timestamp)}</span>
        </div>

        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl px-4 py-3 shadow-sm",
            isOwn ? "bg-primary text-primary-foreground" : "bg-card border-border border",
          )}
        >
          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              "h-10 w-10 shrink-0 rounded-full",
              isOwn
                ? "bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
                : "bg-primary hover:bg-primary/90 text-primary-foreground",
            )}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" fill="currentColor" />
            ) : (
              <Play className="h-4 w-4" fill="currentColor" />
            )}
          </Button>

          {/* Waveform and Progress */}
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="flex h-12 items-center gap-0.5">
              {message.audioData?.waveform.map((height, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-1 rounded-full transition-all",
                    idx < ((message.audioData?.waveform.length ?? 0) * progress) / 100
                      ? isOwn
                        ? "bg-primary-foreground"
                        : "bg-primary"
                      : isOwn
                        ? "bg-primary-foreground/30"
                        : "bg-muted",
                  )}
                  style={{
                    height: `${height}%`,
                    minHeight: "8px",
                  }}
                />
              ))}
            </div>

            {/* Time Display */}
            <div className="flex items-center justify-between text-xs">
              <span className={isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}>
                {formatTime(currentTime)}
              </span>
              <span className={isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}>
                {formatTime(message.audioData.duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {message.reactions.map((reaction, idx) => (
              <div key={idx} className="bg-accent flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
                <span>{reaction.emoji}</span>
                <span className="font-medium">{reaction.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
