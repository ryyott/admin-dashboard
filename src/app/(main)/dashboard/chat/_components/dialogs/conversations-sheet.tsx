"use client";

import { useEffect } from "react";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Conversation, User } from "@/types/chat";

import { ConversationList } from "../left-sidebar/conversation-list";
import { CurrentUserProfile } from "../left-sidebar/current-user-profile";

interface ConversationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversations: Conversation[];
  users: Record<string, User>;
  currentUser: User;
  activeConversationId?: string;
  onOpenSettings?: () => void;
}

export function ConversationsSheet({
  open,
  onOpenChange,
  conversations,
  users,
  currentUser,
  activeConversationId,
  onOpenSettings,
}: ConversationsSheetProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <>
      {/* Sheet */}
      <div className="bg-card border-border animate-in slide-in-from-left absolute top-0 bottom-0 left-0 z-50 flex w-80 flex-col border-r shadow-xl duration-300">
        {/* Header */}
        <div className="border-border flex shrink-0 items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">All Conversations</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1">
          <ConversationList
            conversations={conversations}
            users={users}
            currentUser={currentUser}
            activeConversationId={activeConversationId}
          />
        </div>

        {/* Footer */}
        <div className="border-border shrink-0 border-t">
          <CurrentUserProfile user={currentUser} onOpenSettings={onOpenSettings} />
        </div>
      </div>
    </>
  );
}
