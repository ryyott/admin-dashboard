export type Priority = "low" | "medium" | "high" | "urgent";
export type ViewMode = "kanban" | "table" | "list";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role?: string;
  bio?: string;
  location?: string;
  jobTitle?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "image" | "document" | "video" | "other";
  size: number; // in bytes
  uploadedAt: Date;
  uploadedBy: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  isEdited?: boolean;
}

export interface Subtask {
  id: string;
  content: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface Tag {
  id: string;
  label: string;
  color: string; // hex color
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  assignees: string[]; // user IDs
  tags: Tag[];
  dueDate?: Date;
  attachments: Attachment[];
  comments: Comment[];
  subtasks: Subtask[];
  columnId: string;
  position: number; // for ordering within column
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[]; // ordered task IDs
  color?: string;
  position: number; // for column ordering
  isCollapsed?: boolean;
  taskLimit?: number; // WIP limit
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  isFavorite: boolean;
  createdAt: Date;
  members: string[]; // user IDs
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  taskContext?: string; // task ID for context
}

export interface KanbanStore {
  // Data
  projects: Project[];
  activeProjectId: string | null;
  columns: Record<string, Column[]>; // projectId -> columns
  tasks: Record<string, Task>; // taskId -> task
  users: Record<string, User>;
  currentUserId: string;

  // UI State
  viewMode: ViewMode;
  isLeftSidebarOpen: boolean;
  isAiPanelOpen: boolean;
  selectedTaskId: string | null;
  searchQuery: string;
  filterTags: string[];
  filterAssignees: string[];
  filterPriority: Priority | null;

  // AI State
  aiMessages: AIMessage[];
  isAiTyping: boolean;

  // Project Actions
  setActiveProject: (projectId: string) => void;
  createProject: (project: Omit<Project, "id" | "createdAt">) => void;
  toggleProjectFavorite: (projectId: string) => void;

  // Column Actions
  createColumn: (column: Omit<Column, "id" | "taskIds">) => void;
  updateColumn: (columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (columnId: string) => void;
  reorderColumns: (columnIds: string[]) => void;

  // Task Actions
  createTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, targetColumnId: string, position: number) => void;
  setSelectedTask: (taskId: string | null) => void;

  // Task Detail Actions
  addComment: (taskId: string, content: string) => void;
  updateComment: (taskId: string, commentId: string, content: string) => void;
  deleteComment: (taskId: string, commentId: string) => void;
  addSubtask: (taskId: string, content: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  addAttachment: (taskId: string, attachment: Omit<Attachment, "id" | "uploadedAt">) => void;
  deleteAttachment: (taskId: string, attachmentId: string) => void;
  addAssignee: (taskId: string, userId: string) => void;
  removeAssignee: (taskId: string, userId: string) => void;
  addTag: (taskId: string, tag: Tag) => void;
  removeTag: (taskId: string, tagId: string) => void;

  // UI Actions
  setViewMode: (mode: ViewMode) => void;
  toggleLeftSidebar: () => void;
  toggleAiPanel: () => void;
  setSearchQuery: (query: string) => void;
  setFilterTags: (tags: string[]) => void;
  setFilterAssignees: (assignees: string[]) => void;
  setFilterPriority: (priority: Priority | null) => void;
  resetFilters: () => void;

  // AI Actions
  sendAiMessage: (content: string, taskContext?: string) => void;
  clearAiChat: () => void;

  // Getters
  getActiveProject: () => Project | null;
  getProjectColumns: () => Column[];
  getColumnTasks: (columnId: string) => Task[];
  getFilteredTasks: () => Task[];
  getTaskById: (taskId: string) => Task | null;
  getUserById: (userId: string) => User | null;
  getColumnById: (columnId: string) => Column | null;
}
