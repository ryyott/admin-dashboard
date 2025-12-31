import { create } from "zustand";

import { mockEmails } from "@/data/mock-email-data";
import type { EmailMessage, EmailCategory, SortOption, EmailStore, EmailView } from "@/types/email";

export const useEmailStore = create<EmailStore>((set, get) => ({
  emails: mockEmails,
  selectedEmailId: null,
  filters: {
    category: "primary",
    sortBy: "newest",
    searchQuery: "",
    view: "inbox",
  },
  sidebarCollapsed: false,

  selectEmail: (emailId) => {
    set({ selectedEmailId: emailId });
    if (emailId) {
      get().markAsRead(emailId);
    }
  },

  toggleEmailRead: (emailId) => {
    set((state) => ({
      emails: state.emails.map((email) => (email.id === emailId ? { ...email, isRead: !email.isRead } : email)),
    }));
  },

  toggleEmailStarred: (emailId) => {
    set((state) => ({
      emails: state.emails.map((email) => (email.id === emailId ? { ...email, isStarred: !email.isStarred } : email)),
    }));
  },

  setCategory: (category: EmailCategory) => {
    set((state) => ({
      filters: { ...state.filters, category },
      selectedEmailId: null,
    }));
  },

  setSortBy: (sortBy: SortOption) => {
    set((state) => ({
      filters: { ...state.filters, sortBy },
    }));
  },

  setSearchQuery: (query) => {
    set((state) => ({
      filters: { ...state.filters, searchQuery: query },
    }));
  },

  setView: (view: EmailView) => {
    set((state) => ({
      filters: { ...state.filters, view },
      selectedEmailId: null,
    }));
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  markAsRead: (emailId) => {
    set((state) => ({
      emails: state.emails.map((email) => (email.id === emailId && !email.isRead ? { ...email, isRead: true } : email)),
    }));
  },

  getSelectedEmail: () => {
    const { emails, selectedEmailId } = get();
    return emails.find((email) => email.id === selectedEmailId) || null;
  },

  getFilteredEmails: () => {
    const { emails, filters } = get();
    let filtered = emails;

    // Filter by view
    switch (filters.view) {
      case "inbox":
        filtered = filtered.filter((email) => email.category === filters.category);
        break;
      case "starred":
        filtered = filtered.filter((email) => email.isStarred);
        break;
      case "sent":
        // Mock: In a real app, you'd have a separate sent emails array
        filtered = filtered.filter((email) => email.isRead);
        break;
      case "drafts":
        // Mock: In a real app, you'd have a drafts array
        filtered = [];
        break;
      case "deleted":
        // Mock: In a real app, you'd have a deleted emails array
        filtered = [];
        break;
      case "spam":
        // Mock: In a real app, you'd have a spam emails array
        filtered = [];
        break;
      case "settings":
        filtered = [];
        break;
    }

    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (email) =>
          email.subject.toLowerCase().includes(query) ||
          email.sender.name.toLowerCase().includes(query) ||
          email.preview.toLowerCase().includes(query),
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        break;
      case "unread":
        filtered.sort((a, b) => (a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1));
        break;
      case "starred":
        filtered.sort((a, b) => (a.isStarred === b.isStarred ? 0 : a.isStarred ? -1 : 1));
        break;
    }

    return filtered;
  },

  getEmailsByDateGroup: () => {
    const filtered = get().getFilteredEmails();
    const grouped: Record<string, EmailMessage[]> = {};

    filtered.forEach((email) => {
      const group = email.dateGroup;
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(email);
    });

    return grouped;
  },

  getCategoryCount: (category: EmailCategory) => {
    return get().emails.filter((email) => email.category === category).length;
  },
}));
