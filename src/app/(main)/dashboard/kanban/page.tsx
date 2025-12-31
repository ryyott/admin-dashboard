"use client";

import { useEffect } from "react";

import { mockUsers, mockProjects, mockColumns, mockTasks, currentUser } from "@/data/mock-kanban-data";
import { useKanbanStore } from "@/stores/kanban-store";

import { AIChatDialog } from "./_components/ai-assistant/ai-chat-dialog";
import { KanbanBoard } from "./_components/kanban-board/kanban-board";
import { KanbanHeader } from "./_components/kanban-board/kanban-header";
import { ProjectSidebar } from "./_components/left-sidebar/project-sidebar";
import { TaskDetailSheet } from "./_components/task-dialogs/task-detail-sheet";

export default function KanbanPage() {
  const { activeProjectId, isLeftSidebarOpen, selectedTaskId, users, setActiveProject } = useKanbanStore();

  // Initialize store with mock data
  useEffect(() => {
    if (Object.keys(users).length === 0) {
      useKanbanStore.setState({
        users: mockUsers,
        projects: mockProjects,
        columns: mockColumns,
        tasks: mockTasks,
        currentUserId: currentUser.id,
        activeProjectId: mockProjects[0].id,
      });
    }
  }, [users]);

  // Set default project
  useEffect(() => {
    if (!activeProjectId && mockProjects.length > 0) {
      setActiveProject(mockProjects[0].id);
    }
  }, [activeProjectId, setActiveProject]);

  if (Object.keys(users).length === 0) {
    return (
      <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
        <p className="text-muted-foreground">Loading kanban board...</p>
      </div>
    );
  }

  return (
    <div className="-mx-4 -my-4 md:-mx-6 md:-my-6">
      <div className="border-border bg-background relative flex h-[calc(100vh-3rem)] flex-col overflow-hidden border shadow-sm md:h-[calc(100vh-4.5rem)]">
        {/* Top Section - Header Row */}
        <div className="border-border flex shrink-0 border-b">
          {/* Left Sidebar Header */}
          {isLeftSidebarOpen && (
            <div className="hidden w-64 lg:block">
              <div className="border-border flex h-14 items-center border-r px-4">
                <h2 className="text-sm font-semibold">Projects</h2>
              </div>
            </div>
          )}

          {/* Main Header */}
          <div className="flex-1">
            <KanbanHeader />
          </div>
        </div>

        {/* Middle Section - Content Area */}
        <div className="flex min-h-0 flex-1">
          {/* Left Sidebar */}
          {isLeftSidebarOpen && (
            <div className="border-border hidden w-64 border-r lg:flex lg:flex-col">
              <ProjectSidebar />
            </div>
          )}

          {/* Main Kanban Board */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <KanbanBoard />
          </div>
        </div>

        {/* AI Chat Dialog with FAB */}
        <AIChatDialog />

        {/* Task Detail Sheet */}
        {selectedTaskId && <TaskDetailSheet />}
      </div>
    </div>
  );
}
