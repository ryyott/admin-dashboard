"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Search, Hash, Users2, MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Conversation, User } from "@/types/chat";

interface ChatSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversations: Conversation[];
  users: Record<string, User>;
}

export function ChatSearchDialog({ open, onOpenChange, conversations, users }: ChatSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectConversation = (conversationId: string) => {
    router.push(`/page/chat/${conversationId}`);
    onOpenChange(false);
    setSearchQuery("");
    setSelectedIndex(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredConversations.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredConversations[selectedIndex]) {
          handleSelectConversation(filteredConversations[selectedIndex].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, selectedIndex, filteredConversations]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 [&>button]:hidden">
        <DialogTitle className="sr-only">Search Conversations</DialogTitle>
        {/* Search Input */}
        <div className="border-border flex items-center gap-3 border-b px-4 py-3">
          <Search className="text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
          <kbd className="border-border bg-muted text-muted-foreground pointer-events-none inline-flex h-6 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
            <span className="text-xs">ESC</span>
          </kbd>
        </div>

        {/* Results */}
        <ScrollArea className="max-h-[400px]">
          <div className="p-2">
            {filteredConversations.length === 0 ? (
              <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
                {searchQuery ? "No conversations found" : "Start typing to search..."}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredConversations.map((conversation, index) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors",
                      index === selectedIndex ? "bg-accent" : "hover:bg-accent/50",
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.avatar} alt={conversation.name} />
                        <AvatarFallback>{conversation.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {conversation.type === "group" && (
                        <div className="bg-primary text-primary-foreground absolute -right-0.5 -bottom-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold">
                          {conversation.participants.length}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        {conversation.type === "group" ? (
                          <Users2 className="text-muted-foreground h-3.5 w-3.5" />
                        ) : (
                          <MessageSquare className="text-muted-foreground h-3.5 w-3.5" />
                        )}
                        <p className="truncate text-sm font-medium">{conversation.name}</p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="default" className="ml-auto h-5 min-w-5 rounded-full px-1.5 text-xs">
                            {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <p className="text-muted-foreground truncate text-xs">{conversation.lastMessage.content}</p>
                      )}
                    </div>

                    {index === selectedIndex && (
                      <kbd className="border-border bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-6 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
                        ↵
                      </kbd>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer hint */}
        <div className="border-border text-muted-foreground flex items-center gap-4 border-t px-4 py-2 text-xs">
          <div className="flex items-center gap-1.5">
            <kbd className="border-border bg-muted pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1 font-mono text-[10px] font-medium select-none">
              ↑↓
            </kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="border-border bg-muted pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1 font-mono text-[10px] font-medium select-none">
              ↵
            </kbd>
            <span>Select</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
