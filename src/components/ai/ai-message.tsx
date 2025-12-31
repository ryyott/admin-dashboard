"use client";

import { format } from "date-fns";
import { Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AIMessageProps {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  };
  currentUserName?: string;
  currentUserAvatar?: string;
}

export function AIMessage({ message, currentUserName, currentUserAvatar }: AIMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div className="shrink-0">
        {isUser ? (
          <Avatar className="h-8 w-8">
            {currentUserAvatar && <AvatarImage src={currentUserAvatar} alt={currentUserName || "User"} />}
            <AvatarFallback className="text-xs">{currentUserName ? getInitials(currentUserName) : "U"}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={cn("flex flex-col gap-1", isUser && "items-end")}>
        <div
          className={cn(
            "max-w-[240px] rounded-lg px-3 py-2",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted",
          )}
        >
          <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-muted-foreground px-1 text-xs">{format(message.timestamp, "h:mm a")}</span>
      </div>
    </div>
  );
}
