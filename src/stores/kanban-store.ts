import { create } from "zustand";

import type {
  KanbanStore,
  Task,
  Column,
  Project,
  Comment,
  Subtask,
  Attachment,
  Tag,
  AIMessage,
  Priority,
  ViewMode,
} from "@/types/kanban";

export const useKanbanStore = create<KanbanStore>((set, get) => ({
  // Initial state
  projects: [],
  activeProjectId: null,
  columns: {},
  tasks: {},
  users: {},
  currentUserId: "",
  viewMode: "kanban",
  isLeftSidebarOpen: true,
  isAiPanelOpen: true,
  selectedTaskId: null,
  searchQuery: "",
  filterTags: [],
  filterAssignees: [],
  filterPriority: null,
  aiMessages: [],
  isAiTyping: false,

  // Project Actions
  setActiveProject: (projectId) => set({ activeProjectId: projectId }),

  createProject: (project) => {
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
    };
    set((state) => ({
      projects: [...state.projects, newProject],
      activeProjectId: newProject.id,
    }));
  },

  toggleProjectFavorite: (projectId) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === projectId ? { ...p, isFavorite: !p.isFavorite } : p)),
    })),

  // Column Actions
  createColumn: (column) => {
    const activeProject = get().activeProjectId;
    if (!activeProject) return;

    const newColumn: Column = {
      ...column,
      id: `column-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      taskIds: [],
    };

    set((state) => ({
      columns: {
        ...state.columns,
        [activeProject]: [...(state.columns[activeProject] || []), newColumn],
      },
    }));
  },

  updateColumn: (columnId, updates) => {
    const activeProject = get().activeProjectId;
    if (!activeProject) return;

    set((state) => ({
      columns: {
        ...state.columns,
        [activeProject]: (state.columns[activeProject] || []).map((col) =>
          col.id === columnId ? { ...col, ...updates } : col,
        ),
      },
    }));
  },

  deleteColumn: (columnId) => {
    const activeProject = get().activeProjectId;
    if (!activeProject) return;

    set((state) => {
      const columns = state.columns[activeProject] || [];
      const column = columns.find((c) => c.id === columnId);

      // Delete all tasks in this column
      const tasksToDelete = column?.taskIds || [];
      const newTasks = { ...state.tasks };
      tasksToDelete.forEach((taskId) => {
        delete newTasks[taskId];
      });

      return {
        columns: {
          ...state.columns,
          [activeProject]: columns.filter((c) => c.id !== columnId),
        },
        tasks: newTasks,
      };
    });
  },

  reorderColumns: (columnIds) => {
    const activeProject = get().activeProjectId;
    if (!activeProject) return;

    set((state) => {
      const columns = state.columns[activeProject] || [];
      const reordered = columnIds
        .map((id, index) => {
          const col = columns.find((c) => c.id === id);
          return col ? { ...col, position: index } : null;
        })
        .filter(Boolean) as Column[];

      return {
        columns: {
          ...state.columns,
          [activeProject]: reordered,
        },
      };
    });
  },

  // Task Actions
  createTask: (task) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => {
      const activeProject = get().activeProjectId;
      if (!activeProject) return state;

      const columns = state.columns[activeProject] || [];
      const column = columns.find((c) => c.id === task.columnId);

      if (!column) return state;

      return {
        tasks: {
          ...state.tasks,
          [newTask.id]: newTask,
        },
        columns: {
          ...state.columns,
          [activeProject]: columns.map((col) =>
            col.id === task.columnId ? { ...col, taskIds: [newTask.id, ...col.taskIds] } : col,
          ),
        },
      };
    });
  },

  updateTask: (taskId, updates) => {
    set((state) => ({
      tasks: {
        ...state.tasks,
        [taskId]: state.tasks[taskId]
          ? { ...state.tasks[taskId], ...updates, updatedAt: new Date() }
          : state.tasks[taskId],
      },
    }));
  },

  deleteTask: (taskId) => {
    set((state) => {
      const task = state.tasks[taskId];
      if (!task) return state;

      const activeProject = get().activeProjectId;
      if (!activeProject) return state;

      const newTasks = { ...state.tasks };
      delete newTasks[taskId];

      const columns = state.columns[activeProject] || [];
      const updatedColumns = columns.map((col) =>
        col.id === task.columnId ? { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) } : col,
      );

      return {
        tasks: newTasks,
        columns: {
          ...state.columns,
          [activeProject]: updatedColumns,
        },
        selectedTaskId: state.selectedTaskId === taskId ? null : state.selectedTaskId,
      };
    });
  },

  moveTask: (taskId, targetColumnId, position) => {
    const state = get();
    const task = state.tasks[taskId];
    if (!task) return;

    const activeProject = state.activeProjectId;
    if (!activeProject) return;

    const columns = state.columns[activeProject] || [];

    set(() => {
      // Remove from source column
      const sourceColumn = columns.find((c) => c.id === task.columnId);
      const targetColumn = columns.find((c) => c.id === targetColumnId);

      if (!sourceColumn || !targetColumn) return state;

      const newSourceTaskIds = sourceColumn.taskIds.filter((id) => id !== taskId);
      const newTargetTaskIds = [...targetColumn.taskIds];

      // Add to target column at position
      if (sourceColumn.id === targetColumn.id) {
        // Reordering within same column
        const oldIndex = sourceColumn.taskIds.indexOf(taskId);
        newTargetTaskIds.splice(oldIndex, 1);
        newTargetTaskIds.splice(position, 0, taskId);
      } else {
        // Moving to different column
        newTargetTaskIds.splice(position, 0, taskId);
      }

      const updatedColumns = columns.map((col) => {
        if (col.id === sourceColumn.id && col.id === targetColumn.id) {
          return { ...col, taskIds: newTargetTaskIds };
        } else if (col.id === sourceColumn.id) {
          return { ...col, taskIds: newSourceTaskIds };
        } else if (col.id === targetColumn.id) {
          return { ...col, taskIds: newTargetTaskIds };
        }
        return col;
      });

      return {
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...task,
            columnId: targetColumnId,
            position,
            updatedAt: new Date(),
          },
        },
        columns: {
          ...state.columns,
          [activeProject]: updatedColumns,
        },
      };
    });
  },

  setSelectedTask: (taskId) => set({ selectedTaskId: taskId }),

  // Task Detail Actions
  addComment: (taskId, content) => {
    const state = get();
    const task = state.tasks[taskId];
    if (!task) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      taskId,
      userId: state.currentUserId,
      content,
      createdAt: new Date(),
    };

    set({
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...task,
          comments: [...task.comments, newComment],
          updatedAt: new Date(),
        },
      },
    });
  },

  updateComment: (taskId, commentId, content) => {
    const state = get();
    const task = state.tasks[taskId];
    if (!task) return;

    set({
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...task,
          comments: task.comments.map((c) =>
            c.id === commentId ? { ...c, content, updatedAt: new Date(), isEdited: true } : c,
          ),
          updatedAt: new Date(),
        },
      },
    });
  },

  deleteComment: (taskId, commentId) => {
    const state = get();
    const task = state.tasks[taskId];
    if (!task) return;

    set({
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...task,
          comments: task.comments.filter((c) => c.id !== commentId),
          updatedAt: new Date(),
        },
      },
    });
  },

  addSubtask: (taskId, content) => {
    const state = get();
    const task = state.tasks[taskId];
    if (!task) return;

    const newSubtask: Subtask = {
      id: `subtask-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      content,
      completed: false,
      createdAt: new Date(),
    };

    set({
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...task,
          subtasks: [...task.subtasks, newSubtask],
          updatedAt: new Date(),
        },
      },
    });
  },

  toggleSubtask: (taskId, subtaskId) => {
    const state = get();
    const task = state.tasks[taskId];
    if (!task) return;

    set({
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...task,
          subtasks: task.subtasks.map((s) =>
            s.id === subtaskId
              ? {
                  ...s,
                  completed: !s.completed,
                  completedAt: !s.completed ? new Date() : undefined,
                }
              : s,
          ),
          updatedAt: new Date(),
        },
      },
    });
  },

  deleteSubtask: (taskId, subtaskId) => {
    const state = get();
    const task = state.tasks[taskId];
    if (!task) return;

    set({
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...task,
          subtasks: task.subtasks.filter((s) => s.id !== subtaskId),
          updatedAt: new Date(),
        },
      },
    });
  },

  addAttachment: (taskId, attachment) => {
    const state = get();
    const task = state.tasks[taskId];
    if (!task) return;

    const newAttachment: Attachment = {
      ...attachment,
      id: `attachment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      uploadedAt: new Date(),
    };

    set({
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...task,
          attachments: [...task.attachments, newAttachment],
          updatedAt: new Date(),
        },
      },
    });
  },

  deleteAttachment: (taskId, attachmentId) => {
    const state = get();
    const task = state.tasks[taskId];
    if (!task) return;

    set({
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...task,
          attachments: task.attachments.filter((a) => a.id !== attachmentId),
          updatedAt: new Date(),
        },
      },
    });
  },

  addAssignee: (taskId, userId) => {
    const state = get();
    const task = state.tasks[taskId];
    if (!task || task.assignees.includes(userId)) return;

    set({
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...task,
          assignees: [...task.assignees, userId],
          updatedAt: new Date(),
        },
      },
    });
  },

  removeAssignee: (taskId, userId) => {
    const state = get();
    const task = state.tasks[taskId];
    if (!task) return;

    set({
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...task,
          assignees: task.assignees.filter((id) => id !== userId),
          updatedAt: new Date(),
        },
      },
    });
  },

  addTag: (taskId, tag) => {
    const state = get();
    const task = state.tasks[taskId];
    if (!task || task.tags.some((t) => t.id === tag.id)) return;

    set({
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...task,
          tags: [...task.tags, tag],
          updatedAt: new Date(),
        },
      },
    });
  },

  removeTag: (taskId, tagId) => {
    const state = get();
    const task = state.tasks[taskId];
    if (!task) return;

    set({
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...task,
          tags: task.tags.filter((t) => t.id !== tagId),
          updatedAt: new Date(),
        },
      },
    });
  },

  // UI Actions
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleLeftSidebar: () => set((state) => ({ isLeftSidebarOpen: !state.isLeftSidebarOpen })),
  toggleAiPanel: () => set((state) => ({ isAiPanelOpen: !state.isAiPanelOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterTags: (tags) => set({ filterTags: tags }),
  setFilterAssignees: (assignees) => set({ filterAssignees: assignees }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  resetFilters: () =>
    set({
      searchQuery: "",
      filterTags: [],
      filterAssignees: [],
      filterPriority: null,
    }),

  // AI Actions
  sendAiMessage: (content, taskContext) => {
    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
      taskContext,
    };

    set((state) => ({
      aiMessages: [...state.aiMessages, userMessage],
      isAiTyping: true,
    }));

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your current tasks, I suggest prioritizing high-priority items first to maintain momentum.",
        "To improve website conversion, focus on optimizing the user experience and streamlining the checkout process.",
        `Your project has ${Object.keys(get().tasks).length} tasks. Consider breaking down larger tasks into smaller, manageable subtasks.`,
        "I can help you organize your workflow. Would you like me to suggest task groupings or priority adjustments?",
        "Great progress! Keep maintaining this pace and you'll complete the sprint goals on time.",
      ];

      const aiResponse: AIMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        taskContext,
      };

      set((state) => ({
        aiMessages: [...state.aiMessages, aiResponse],
        isAiTyping: false,
      }));
    }, 1500);
  },

  clearAiChat: () => set({ aiMessages: [] }),

  // Getters
  getActiveProject: () => {
    const state = get();
    if (!state.activeProjectId) return null;
    return state.projects.find((p) => p.id === state.activeProjectId) || null;
  },

  getProjectColumns: () => {
    const state = get();
    if (!state.activeProjectId) return [];
    return (state.columns[state.activeProjectId] || []).sort((a, b) => a.position - b.position);
  },

  getColumnTasks: (columnId) => {
    const state = get();
    const columns = get().getProjectColumns();
    const column = columns.find((c) => c.id === columnId);
    if (!column) return [];

    return column.taskIds
      .map((id) => state.tasks[id])
      .filter(Boolean)
      .sort((a, b) => a.position - b.position);
  },

  getFilteredTasks: () => {
    const state = get();
    let tasks = Object.values(state.tasks);

    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      tasks = tasks.filter(
        (task) => task.title.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query),
      );
    }

    // Filter by tags
    if (state.filterTags.length > 0) {
      tasks = tasks.filter((task) => task.tags.some((tag) => state.filterTags.includes(tag.id)));
    }

    // Filter by assignees
    if (state.filterAssignees.length > 0) {
      tasks = tasks.filter((task) => task.assignees.some((assignee) => state.filterAssignees.includes(assignee)));
    }

    // Filter by priority
    if (state.filterPriority) {
      tasks = tasks.filter((task) => task.priority === state.filterPriority);
    }

    return tasks;
  },

  getTaskById: (taskId) => get().tasks[taskId] || null,
  getUserById: (userId) => get().users[userId] || null,
  getColumnById: (columnId) => {
    const columns = get().getProjectColumns();
    return columns.find((c) => c.id === columnId) || null;
  },
}));
