"use client";

import { useState, useEffect } from "react";

import { Search, Plus, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChatStore } from "@/stores/chat-store";
import type { Conversation, User } from "@/types/chat";

import { ChatSearchDialog } from "../dialogs/chat-search-dialog";
import { NewChatDialog } from "../dialogs/new-chat-dialog";

import { ConversationItem } from "./conversation-item";
import { CurrentUserProfile } from "./current-user-profile";
import { UserItem } from "./user-item";

interface ConversationListProps {
  conversations: Conversation[];
  users: Record<string, User>;
  currentUser: User;
  activeConversationId?: string;
}

export function ConversationList({ conversations, users, currentUser, activeConversationId }: ConversationListProps) {
  const filter = useChatStore((state) => state.conversationFilter);
  const setFilter = useChatStore((state) => state.setConversationFilter);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAllPersonal, setShowAllPersonal] = useState(false);
  const [showAllGroups, setShowAllGroups] = useState(false);

  // Global keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Get conversations with messages
  const conversationsWithMessages = conversations.filter((conv) => conv.lastMessage);

  // Sort conversations by time
  const sortedConversations = [...conversationsWithMessages].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    const aTime = a.lastMessage?.timestamp.getTime() || 0;
    const bTime = b.lastMessage?.timestamp.getTime() || 0;
    return bTime - aTime;
  });

  // Separate by type
  const pinnedConversations = sortedConversations.filter((c) => c.isPinned);
  const personalConversations = sortedConversations.filter((c) => c.type === "direct" && !c.isPinned);
  const groupConversations = sortedConversations.filter((c) => c.type === "group" && !c.isPinned);

  // Get users without active conversations (for Personal tab)
  const usersWithConversations = new Set(
    conversationsWithMessages.filter((c) => c.type === "direct").flatMap((c) => c.participants),
  );
  const usersWithoutConversations = Object.values(users).filter(
    (user) => user.id !== currentUser.id && !usersWithConversations.has(user.id),
  );

  // Render content based on filter
  const renderContent = () => {
    if (filter === "personal") {
      return (
        <div className="pb-4">
          {/* Personal conversations with messages */}
          {personalConversations.length > 0 && (
            <div className="mb-2">
              <h3 className="text-muted-foreground mb-2 px-2 text-xs font-semibold">Direct Messages</h3>
              {personalConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  users={users}
                  isActive={activeConversationId === conversation.id}
                />
              ))}
            </div>
          )}

          {/* Users without conversations */}
          {usersWithoutConversations.length > 0 && (
            <div>
              <h3 className="text-muted-foreground mb-2 px-2 text-xs font-semibold">All Friends</h3>
              {usersWithoutConversations.map((user) => (
                <UserItem key={user.id} user={user} />
              ))}
            </div>
          )}

          {personalConversations.length === 0 && usersWithoutConversations.length === 0 && (
            <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">No personal chats</div>
          )}
        </div>
      );
    }

    if (filter === "groups") {
      return (
        <div className="pb-4">
          {groupConversations.length > 0 ? (
            <>
              <h3 className="text-muted-foreground mb-2 px-2 text-xs font-semibold">Group Chats</h3>
              {groupConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  users={users}
                  isActive={activeConversationId === conversation.id}
                />
              ))}
            </>
          ) : (
            <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">No group chats</div>
          )}
        </div>
      );
    }

    // All tab - show pinned + top 3 personal + top 3 groups with "see more"
    const displayPersonal = showAllPersonal ? personalConversations : personalConversations.slice(0, 3);
    const displayGroups = showAllGroups ? groupConversations : groupConversations.slice(0, 3);

    return (
      <div className="pb-4">
        {/* Pinned */}
        {pinnedConversations.length > 0 && (
          <div className="mb-2">
            <h3 className="text-muted-foreground mb-2 px-2 text-xs font-semibold">Pinned Messages</h3>
            {pinnedConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                users={users}
                isActive={activeConversationId === conversation.id}
              />
            ))}
          </div>
        )}

        {/* Personal chats */}
        {personalConversations.length > 0 && (
          <div className="mb-2">
            <div className="mb-2 flex items-center justify-between px-2">
              <h3 className="text-muted-foreground text-xs font-semibold">Direct Messages</h3>
            </div>
            {displayPersonal.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                users={users}
                isActive={activeConversationId === conversation.id}
              />
            ))}

            {/* Show preview of 4th item + expand button when there are more than 3 */}
            {!showAllPersonal && personalConversations.length > 3 && (
              <div className="relative mt-1">
                {/* Half-visible preview of 4th chat */}
                <div className="overflow-hidden" style={{ maxHeight: "30px" }}>
                  <div className="pointer-events-none opacity-40">
                    <ConversationItem conversation={personalConversations[3]} users={users} isActive={false} />
                  </div>
                </div>

                {/* Expand button - positioned below the preview */}
                <div className="mt-3 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border-border bg-card hover:bg-accent h-auto gap-1 rounded-full border px-3 py-1.5 text-xs shadow-sm"
                    onClick={() => setShowAllPersonal(true)}
                  >
                    <ChevronRight className="h-3 w-3 rotate-90" />
                    <span>Show {personalConversations.length - 3} more</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Collapse button when expanded */}
            {showAllPersonal && personalConversations.length > 3 && (
              <div className="mt-2 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-accent h-auto gap-1 rounded-full px-3 py-1.5 text-xs"
                  onClick={() => setShowAllPersonal(false)}
                >
                  <ChevronRight className="h-3 w-3 -rotate-90" />
                  <span>Show less</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Group chats */}
        {groupConversations.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between px-2">
              <h3 className="text-muted-foreground text-xs font-semibold">Group Chats</h3>
            </div>
            {displayGroups.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                users={users}
                isActive={activeConversationId === conversation.id}
              />
            ))}

            {/* Show preview of 4th item + expand button when there are more than 3 */}
            {!showAllGroups && groupConversations.length > 3 && (
              <div className="relative mt-1">
                {/* Half-visible preview of 4th chat */}
                <div className="overflow-hidden" style={{ maxHeight: "30px" }}>
                  <div className="pointer-events-none opacity-40">
                    <ConversationItem conversation={groupConversations[3]} users={users} isActive={false} />
                  </div>
                </div>

                {/* Expand button - positioned below the preview */}
                <div className="mt-3 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border-border bg-card hover:bg-accent h-auto gap-1 rounded-full border px-3 py-1.5 text-xs shadow-sm"
                    onClick={() => setShowAllGroups(true)}
                  >
                    <ChevronRight className="h-3 w-3 rotate-90" />
                    <span>Show {groupConversations.length - 3} more</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Collapse button when expanded */}
            {showAllGroups && groupConversations.length > 3 && (
              <div className="mt-2 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-accent h-auto gap-1 rounded-full px-3 py-1.5 text-xs"
                  onClick={() => setShowAllGroups(false)}
                >
                  <ChevronRight className="h-3 w-3 -rotate-90" />
                  <span>Show less</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {conversationsWithMessages.length === 0 && (
          <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
            No conversations yet
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card flex h-full flex-col">
      {/* Search and Actions */}
      <div className="shrink-0 space-y-3 px-4 pt-4 pb-2">
        <Button className="w-full rounded-xl" size="lg" onClick={() => setIsNewChatOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Start new chat
        </Button>

        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search chat..."
            onClick={() => setIsSearchOpen(true)}
            readOnly
            className="h-10 cursor-pointer rounded-xl pr-16 pl-9"
          />
          <kbd className="border-border bg-muted text-muted-foreground pointer-events-none absolute top-1/2 right-2 inline-flex h-6 -translate-y-1/2 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "personal" | "groups")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="personal" className="text-xs">
              Personal
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-xs">
              Groups
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Conversations List */}
      <ScrollArea className="min-h-0 flex-1 px-1">{renderContent()}</ScrollArea>

      {/* Dialogs */}
      <NewChatDialog
        open={isNewChatOpen}
        onOpenChange={setIsNewChatOpen}
        users={users}
        currentUserId={currentUser.id}
      />
      <ChatSearchDialog
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        conversations={conversations}
        users={users}
      />
    </div>
  );
}
