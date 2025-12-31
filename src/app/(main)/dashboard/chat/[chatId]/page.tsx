"use client";

import { useEffect, useState } from "react";

import { useParams, notFound } from "next/navigation";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  mockUsers,
  mockConversations,
  mockMessages,
  mockTodos,
  mockSharedMedia,
  currentUser,
} from "@/data/mock-chat-data";
import { useChatStore } from "@/stores/chat-store";

import { ChatSettingsSheet } from "../_components/chat-settings-sheet";
import { ChatSearchDialog } from "../_components/dialogs/chat-search-dialog";
import { ConversationsSheet } from "../_components/dialogs/conversations-sheet";
import { ChannelList } from "../_components/left-sidebar/channel-list";
import { ConversationList } from "../_components/left-sidebar/conversation-list";
import { CurrentUserProfile } from "../_components/left-sidebar/current-user-profile";
import { ChatFeed } from "../_components/main-chat/chat-feed";
import { ChatHeader } from "../_components/main-chat/chat-header";
import { InputBar } from "../_components/main-chat/input-bar";
import { RightSidebar } from "../_components/right-sidebar/right-sidebar";
import { SettingsSheet } from "../_components/settings-sheet";

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isConversationsSheetOpen, setIsConversationsSheetOpen] = useState(false);
  const [showConversationList, setShowConversationList] = useState(false);

  const {
    conversations,
    users,
    currentUserId,
    activeConversationId,
    isSidebarOpen,
    isSettingsOpen,
    isChatSettingsOpen,
    activeChannels,
    todos,
    setActiveConversation,
    setActiveChannel,
    toggleSidebar,
    toggleSettings,
    toggleChatSettings,
    sendMessage,
    addTodo,
    toggleTodo,
    deleteTodo,
    addReaction,
    removeReaction,
    getActiveConversation,
    getActiveMessages,
    getConversationMembers,
  } = useChatStore();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + L - Open conversations sheet
      if ((e.metaKey || e.ctrlKey) && e.key === "l") {
        e.preventDefault();
        setIsConversationsSheetOpen((prev) => !prev);
      }

      // Cmd/Ctrl + , - Open settings
      if ((e.metaKey || e.ctrlKey) && e.key === ",") {
        e.preventDefault();
        toggleSettings();
      }

      // Esc - Close all sheets
      if (e.key === "Escape") {
        setIsConversationsSheetOpen(false);
        if (isSettingsOpen) toggleSettings();
        if (isChatSettingsOpen) toggleChatSettings();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSettingsOpen, isChatSettingsOpen, toggleSettings, toggleChatSettings]);

  // Initialize store with mock data ONCE
  useEffect(() => {
    // Only initialize if not already initialized
    if (Object.keys(users).length === 0) {
      useChatStore.setState({
        users: mockUsers,
        conversations: mockConversations,
        messages: mockMessages,
        todos: mockTodos,
        currentUserId: currentUser.id,
      });
    }
  }, [users]);

  // Set active conversation based on URL param
  useEffect(() => {
    if (chatId && Object.keys(users).length > 0) {
      // Verify the chat exists
      const conversationExists = mockConversations.find((c) => c.id === chatId);
      if (!conversationExists) {
        notFound();
      }
      setActiveConversation(chatId);

      // Reset to show channels for groups when switching conversations
      setShowConversationList(false);

      // Initialize active channel for groups
      if (conversationExists.type === "group" && conversationExists.channels && !activeChannels[chatId]) {
        const defaultChannel = conversationExists.activeChannelId || conversationExists.channels[0]?.id;
        if (defaultChannel) {
          setActiveChannel(chatId, defaultChannel);
        }
      }
    }
  }, [chatId, users, setActiveConversation, setActiveChannel, activeChannels]);

  const activeConversation = getActiveConversation();
  const activeMessages = getActiveMessages();
  const activeTodos = activeConversationId ? todos[activeConversationId] || [] : [];

  const handleSendMessage = (content: string) => {
    if (activeConversationId) {
      sendMessage(activeConversationId, content);
    }
  };

  const handleAddTodo = (content: string, emoji: string) => {
    if (activeConversationId) {
      addTodo(activeConversationId, content, emoji);
    }
  };

  const handleToggleTodo = (todoId: string) => {
    if (activeConversationId) {
      toggleTodo(activeConversationId, todoId);
    }
  };

  const handleDeleteTodo = (todoId: string) => {
    if (activeConversationId) {
      deleteTodo(activeConversationId, todoId);
    }
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    addReaction(messageId, emoji, currentUserId);
  };

  const handleRemoveReaction = (messageId: string, emoji: string) => {
    removeReaction(messageId, emoji, currentUserId);
  };

  if (!activeConversation || Object.keys(users).length === 0) {
    return (
      <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    );
  }

  const members = getConversationMembers(activeConversation.id);
  const media = mockSharedMedia[activeConversation.id] || {
    images: [],
    documents: [],
    links: [],
  };

  return (
    // Negative margins to cancel out the dashboard padding and extend to edges
    <div className="-mx-4 -my-4 md:-mx-6 md:-my-6">
      {/* Fixed height container that fills the viewport minus header */}
      <div className="border-border bg-background relative flex h-[calc(100vh-3rem)] flex-col overflow-hidden border shadow-sm md:h-[calc(100vh-4.5rem)]">
        {/* Top Section - Header Row */}
        <div className="flex shrink-0">
          {/* Left Header (Messages) */}
          <div className="hidden w-80 lg:block">
            <div className="border-border bg-card flex h-16 items-center justify-between border-r border-b px-4 py-3">
              <h2 className="text-sm font-semibold">Messages</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Chat Header */}
          <div className="flex-1">
            <ChatHeader
              conversation={activeConversation}
              users={users}
              activeChannelId={activeConversation.type === "group" ? activeChannels[activeConversation.id] : undefined}
              onToggleSidebar={toggleSidebar}
              onToggleSettings={toggleChatSettings}
            />
          </div>
        </div>

        {/* Middle Section - Content Area */}
        <div className="flex min-h-0 flex-1">
          {/* Left Sidebar - Shows ChannelList for groups, ConversationList for direct messages */}
          <div className="border-border hidden w-80 border-r lg:flex lg:flex-col">
            {activeConversation?.type === "group" && !showConversationList ? (
              /* Channel List for Groups - fills available space */
              <div className="min-h-0 flex-1">
                <ChannelList
                  conversation={activeConversation}
                  currentUserId={currentUserId}
                  currentUser={currentUser}
                  activeChannelId={activeChannels[activeConversation.id] || activeConversation.activeChannelId}
                  onChannelSelect={(channelId) => setActiveChannel(activeConversation.id, channelId)}
                  onOpenConversationsSheet={() => setIsConversationsSheetOpen(true)}
                  onOpenSettings={toggleSettings}
                />
              </div>
            ) : (
              /* Conversation List for all chats or when back button clicked */
              <>
                <div className="min-h-0 flex-1">
                  <ConversationList
                    conversations={conversations}
                    users={users}
                    currentUser={currentUser}
                    activeConversationId={activeConversationId || undefined}
                  />
                </div>

                {/* User Profile - pinned to bottom */}
                <div className="border-border shrink-0 border-t">
                  <CurrentUserProfile user={currentUser} onOpenSettings={toggleSettings} />
                </div>
              </>
            )}
          </div>

          {/* Main Chat Window - Center Column */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="min-h-0 flex-1">
              <ChatFeed
                key={activeConversationId}
                messages={activeMessages}
                users={users}
                currentUserId={currentUserId}
                onAddReaction={handleAddReaction}
                onRemoveReaction={handleRemoveReaction}
              />
            </div>

            {/* Main Input Bar */}
            <div className="border-border shrink-0 border-t">
              <InputBar onSendMessage={handleSendMessage} placeholder="Type something..." />
            </div>
          </div>

          {/* Right Sidebar - Right Column (conditionally rendered) */}
          {isSidebarOpen && (
            <div className="hidden xl:flex">
              <RightSidebar
                conversation={activeConversation}
                members={members}
                media={media}
                todos={activeTodos}
                onClose={toggleSidebar}
                onAddTodo={handleAddTodo}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
              />
            </div>
          )}
        </div>

        {/* Settings Sheet - Overlay */}
        <SettingsSheet open={isSettingsOpen} onClose={toggleSettings} />

        {/* Chat Settings Sheet - Overlay */}
        <ChatSettingsSheet open={isChatSettingsOpen} conversation={activeConversation} onClose={toggleChatSettings} />

        {/* Conversations Sheet - positioned within the chat container */}
        <ConversationsSheet
          open={isConversationsSheetOpen}
          onOpenChange={setIsConversationsSheetOpen}
          conversations={conversations}
          users={users}
          currentUser={currentUser}
          activeConversationId={activeConversationId || undefined}
          onOpenSettings={toggleSettings}
        />
      </div>

      {/* Chat Search Dialog - outside the chat container */}
      <ChatSearchDialog
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        conversations={conversations}
        users={users}
      />
    </div>
  );
}
