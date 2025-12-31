import { create } from "zustand";

import type { Conversation, Message, User, TodoItem, Attachment } from "@/types/chat";

interface ChatState {
  // Users
  users: Record<string, User>;
  currentUserId: string;

  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;

  // Messages
  messages: Record<string, Message[]>;

  // UI State
  isSidebarOpen: boolean;
  isSettingsOpen: boolean;
  isChatSettingsOpen: boolean;
  conversationFilter: "all" | "personal" | "groups";
  activeChannels: Record<string, string>; // conversationId -> activeChannelId

  // Todos
  todos: Record<string, TodoItem[]>;

  // Actions
  setCurrentUser: (userId: string) => void;
  setActiveConversation: (conversationId: string | null) => void;
  toggleSidebar: () => void;
  toggleSettings: () => void;
  toggleChatSettings: () => void;
  setConversationFilter: (filter: "all" | "personal" | "groups") => void;
  setActiveChannel: (conversationId: string, channelId: string) => void;

  // Message actions
  sendMessage: (conversationId: string, content: string) => void;
  addMessage: (message: Message) => void;

  // Conversation actions
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
  setTypingUsers: (conversationId: string, userIds: string[]) => void;

  // Todo actions
  addTodo: (conversationId: string, content: string, emoji: string) => void;
  toggleTodo: (conversationId: string, todoId: string) => void;
  deleteTodo: (conversationId: string, todoId: string) => void;

  // Reaction actions
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  removeReaction: (messageId: string, emoji: string, userId: string) => void;

  // Getters
  getActiveConversation: () => Conversation | null;
  getActiveMessages: () => Message[];
  getActiveTodos: () => TodoItem[];
  getConversationMembers: (conversationId: string) => User[];
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  users: {},
  currentUserId: "",
  conversations: [],
  activeConversationId: null,
  messages: {},
  isSidebarOpen: true,
  isSettingsOpen: false,
  isChatSettingsOpen: false,
  conversationFilter: "all",
  activeChannels: {},
  todos: {},

  // Actions
  setCurrentUser: (userId) => set({ currentUserId: userId }),

  setActiveConversation: (conversationId) => set({ activeConversationId: conversationId }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),

  toggleChatSettings: () => set((state) => ({ isChatSettingsOpen: !state.isChatSettingsOpen })),

  setConversationFilter: (filter) => set({ conversationFilter: filter }),

  setActiveChannel: (conversationId, channelId) =>
    set((state) => ({
      activeChannels: {
        ...state.activeChannels,
        [conversationId]: channelId,
      },
    })),

  sendMessage: (conversationId, content) => {
    const state = get();
    const conversation = state.conversations.find((c) => c.id === conversationId);
    const channelId = conversation?.type === "group" ? state.activeChannels[conversationId] : undefined;

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      conversationId,
      channelId,
      senderId: state.currentUserId,
      type: "text",
      content,
      timestamp: new Date(),
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), newMessage],
      },
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: newMessage,
              updatedAt: new Date(),
            }
          : conv,
      ),
    }));
  },

  addMessage: (message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [message.conversationId]: [...(state.messages[message.conversationId] || []), message],
      },
    })),

  updateConversation: (conversationId, updates) =>
    set((state) => ({
      conversations: state.conversations.map((conv) => (conv.id === conversationId ? { ...conv, ...updates } : conv)),
    })),

  setTypingUsers: (conversationId, userIds) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, typingUsers: userIds } : conv,
      ),
    })),

  addTodo: (conversationId, content, emoji) => {
    const newTodo: TodoItem = {
      id: `todo-${Date.now()}-${Math.random()}`,
      content,
      emoji,
      completed: false,
      createdAt: new Date(),
    };

    set((state) => ({
      todos: {
        ...state.todos,
        [conversationId]: [...(state.todos[conversationId] || []), newTodo],
      },
    }));
  },

  toggleTodo: (conversationId, todoId) =>
    set((state) => ({
      todos: {
        ...state.todos,
        [conversationId]: (state.todos[conversationId] || []).map((todo) =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
        ),
      },
    })),

  deleteTodo: (conversationId, todoId) =>
    set((state) => ({
      todos: {
        ...state.todos,
        [conversationId]: (state.todos[conversationId] || []).filter((todo) => todo.id !== todoId),
      },
    })),

  addReaction: (messageId, emoji, userId) =>
    set((state) => {
      const updatedMessages = { ...state.messages };

      // Find the conversation containing this message
      for (const conversationId in updatedMessages) {
        const messages = updatedMessages[conversationId];
        const messageIndex = messages.findIndex((m) => m.id === messageId);

        if (messageIndex !== -1) {
          const message = { ...messages[messageIndex] };
          const reactions = message.reactions || [];
          const reactionIndex = reactions.findIndex((r) => r.emoji === emoji);

          if (reactionIndex !== -1) {
            // Reaction exists, add user to it
            const reaction = { ...reactions[reactionIndex] };
            if (!reaction.userIds.includes(userId)) {
              reaction.userIds = [...reaction.userIds, userId];
              reaction.count = reaction.userIds.length;
              reactions[reactionIndex] = reaction;
            }
          } else {
            // Create new reaction
            reactions.push({
              emoji,
              userIds: [userId],
              count: 1,
            });
          }

          message.reactions = [...reactions];
          messages[messageIndex] = message;
          updatedMessages[conversationId] = [...messages];
          break;
        }
      }

      return { messages: updatedMessages };
    }),

  removeReaction: (messageId, emoji, userId) =>
    set((state) => {
      const updatedMessages = { ...state.messages };

      // Find the conversation containing this message
      for (const conversationId in updatedMessages) {
        const messages = updatedMessages[conversationId];
        const messageIndex = messages.findIndex((m) => m.id === messageId);

        if (messageIndex !== -1) {
          const message = { ...messages[messageIndex] };
          const reactions = message.reactions || [];
          const reactionIndex = reactions.findIndex((r) => r.emoji === emoji);

          if (reactionIndex !== -1) {
            const reaction = { ...reactions[reactionIndex] };
            reaction.userIds = reaction.userIds.filter((id) => id !== userId);
            reaction.count = reaction.userIds.length;

            if (reaction.count === 0) {
              // Remove reaction if no users left
              reactions.splice(reactionIndex, 1);
            } else {
              reactions[reactionIndex] = reaction;
            }

            message.reactions = [...reactions];
            messages[messageIndex] = message;
            updatedMessages[conversationId] = [...messages];
            break;
          }
        }
      }

      return { messages: updatedMessages };
    }),

  // Getters
  getActiveConversation: () => {
    const state = get();
    if (!state.activeConversationId) return null;
    return state.conversations.find((c) => c.id === state.activeConversationId) || null;
  },

  getActiveMessages: () => {
    const state = get();
    if (!state.activeConversationId) return [];
    const allMessages = state.messages[state.activeConversationId] || [];

    // Filter by channel for group conversations
    const conversation = state.conversations.find((c) => c.id === state.activeConversationId);
    if (conversation?.type === "group") {
      const activeChannelId = state.activeChannels[state.activeConversationId];
      if (activeChannelId) {
        return allMessages.filter((m) => m.channelId === activeChannelId);
      }
    }

    return allMessages;
  },

  getActiveTodos: () => {
    const state = get();
    if (!state.activeConversationId) return [];
    return state.todos[state.activeConversationId] || [];
  },

  getConversationMembers: (conversationId) => {
    const state = get();
    const conversation = state.conversations.find((c) => c.id === conversationId);
    if (!conversation) return [];
    return conversation.participants.map((userId) => state.users[userId]).filter(Boolean);
  },
}));
