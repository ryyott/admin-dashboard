export type MessageType = "text" | "audio" | "image" | "file";

export type UserStatus = "online" | "offline" | "idle" | "dnd";

export type ChannelType = "text" | "voice";

export type GroupRole = "owner" | "editor" | "user";

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  status: UserStatus;
  statusMessage?: string;
  role?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  channelId?: string; // For group channels
  senderId: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  reactions?: Reaction[];
  isEdited?: boolean;
  replyTo?: string;
  attachments?: Attachment[];
  audioData?: AudioData;
}

export interface AudioData {
  duration: number;
  waveform: number[];
  url: string;
}

export interface Reaction {
  emoji: string;
  userIds: string[]; // Array of user IDs who reacted with this emoji
  count: number;
}

export interface Attachment {
  id: string;
  type: "image" | "video" | "document";
  url: string;
  name: string;
  size?: number;
  thumbnail?: string;
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  description?: string;
  conversationId: string;
  createdAt: Date;
  createdBy: string;
  position: number;
}

export interface GroupMemberRole {
  userId: string;
  role: GroupRole;
  assignedAt: Date;
}

export interface Conversation {
  id: string;
  type: "direct" | "group";
  name: string;
  avatar: string;
  description?: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  typingUsers?: string[];
  createdAt: Date;
  updatedAt: Date;
  groupLink?: string;
  // Group-specific fields
  channels?: Channel[];
  memberRoles?: GroupMemberRole[];
  activeChannelId?: string;
}

export interface TodoItem {
  id: string;
  content: string;
  completed: boolean;
  emoji?: string;
  createdAt: Date;
}

export interface SharedMedia {
  images: Attachment[];
  videos: Attachment[];
  documents: Attachment[];
  links: string[];
}
