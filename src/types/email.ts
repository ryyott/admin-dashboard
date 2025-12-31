// Email Type Definitions

export interface EmailAttachment {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: "pdf" | "doc" | "docx" | "image" | "other";
  url?: string;
}

export interface EmailSender {
  name: string;
  email: string;
  avatar: string;
  avatarBgColor?: string;
}

export interface EmailRecipient {
  name: string;
  email: string;
  type: "to" | "cc" | "bcc";
}

export interface EmailTag {
  id: string;
  label: string;
  variant: "default" | "primary" | "secondary" | "success" | "warning";
}

export interface EmailMessage {
  id: string;
  sender: EmailSender;
  recipients: EmailRecipient[];
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  dateGroup: "Today" | "Yesterday" | string;
  tags: EmailTag[];
  attachments?: EmailAttachment[];
  isRead: boolean;
  isStarred: boolean;
  category: "primary" | "company" | "promotions" | "socials" | "updates";
  hasNewBadge?: boolean;
}

export type EmailCategory = "primary" | "company" | "promotions" | "socials" | "updates";

export type EmailView = "inbox" | "starred" | "sent" | "drafts" | "deleted" | "spam" | "settings";

export type SortOption = "newest" | "oldest" | "unread" | "starred";

export interface EmailFilters {
  category: EmailCategory;
  sortBy: SortOption;
  searchQuery: string;
  view: EmailView;
}

export interface EmailStore {
  emails: EmailMessage[];
  selectedEmailId: string | null;
  filters: EmailFilters;
  sidebarCollapsed: boolean;

  selectEmail: (emailId: string | null) => void;
  toggleEmailRead: (emailId: string) => void;
  toggleEmailStarred: (emailId: string) => void;
  setCategory: (category: EmailCategory) => void;
  setSortBy: (sortBy: SortOption) => void;
  setSearchQuery: (query: string) => void;
  setView: (view: EmailView) => void;
  toggleSidebar: () => void;
  markAsRead: (emailId: string) => void;

  getSelectedEmail: () => EmailMessage | null;
  getFilteredEmails: () => EmailMessage[];
  getEmailsByDateGroup: () => Record<string, EmailMessage[]>;
  getCategoryCount: (category: EmailCategory) => number;
}
