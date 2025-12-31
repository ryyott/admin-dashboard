"use client";

import { Settings, Link, Bell, BellOff, ChevronRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Conversation } from "@/types/chat";

interface GroupDetailsProps {
  conversation: Conversation;
}

export function GroupDetails({ conversation }: GroupDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Group Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback className="text-2xl">{conversation.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute -right-1 -bottom-1 h-7 w-7 rounded-full shadow-md"
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div>
          <h2 className="text-lg font-semibold">{conversation.name}</h2>
          {conversation.description && <p className="text-muted-foreground mt-1 text-sm">{conversation.description}</p>}
        </div>

        {conversation.type === "group" && (
          <Badge variant="secondary" className="rounded-full">
            {conversation.participants.length} members
          </Badge>
        )}
      </div>

      <Separator />

      {/* Quick Actions */}
      <div className="space-y-1">
        <Button variant="ghost" className="h-auto w-full justify-between rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            {conversation.isMuted ? (
              <BellOff className="text-muted-foreground h-4 w-4" />
            ) : (
              <Bell className="text-muted-foreground h-4 w-4" />
            )}
            <span className="text-sm">{conversation.isMuted ? "Unmute notifications" : "Mute notifications"}</span>
          </div>
          <ChevronRight className="text-muted-foreground h-4 w-4" />
        </Button>

        {conversation.groupLink && (
          <Button variant="ghost" className="h-auto w-full justify-between rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <Link className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">Link group</span>
            </div>
            <ChevronRight className="text-muted-foreground h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      {/* Descriptions */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Descriptions</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {conversation.description || "No description available."}
        </p>
      </div>
    </div>
  );
}
