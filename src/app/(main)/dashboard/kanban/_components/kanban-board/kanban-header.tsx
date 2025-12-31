"use client";

import {
  Settings,
  Filter,
  LayoutGrid,
  List,
  Table2,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { useKanbanStore } from "@/stores/kanban-store";
import type { ViewMode } from "@/types/kanban";

import { UserProfilePeek } from "../shared/user-profile-peek";

export function KanbanHeader() {
  const {
    viewMode,
    setViewMode,
    getActiveProject,
    toggleLeftSidebar,
    toggleAiPanel,
    isLeftSidebarOpen,
    isAiPanelOpen,
    users,
  } = useKanbanStore();

  const project = getActiveProject();
  const members = project?.members || [];
  const memberUsers = members
    .slice(0, 4)
    .map((id) => users[id])
    .filter(Boolean);

  const viewModes: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: "kanban", icon: <LayoutGrid className="h-4 w-4" />, label: "Kanban" },
    { mode: "table", icon: <Table2 className="h-4 w-4" />, label: "Table" },
    { mode: "list", icon: <List className="h-4 w-4" />, label: "List" },
  ];

  return (
    <div className="flex items-center justify-between px-6 py-3">
      {/* Left - Title & Controls */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleLeftSidebar} className="hidden lg:flex">
          {isLeftSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </Button>
        <h1 className="text-lg font-semibold">{project?.name || "Kanban Board"}</h1>
      </div>

      {/* Right - Controls */}
      <div className="flex items-center gap-3">
        {/* View Switcher */}
        <div className="border-border bg-background flex items-center gap-1 rounded-lg border p-1">
          {viewModes.map(({ mode, icon, label }) => (
            <Button
              key={mode}
              variant={viewMode === mode ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-3"
              onClick={() => setViewMode(mode)}
              title={label}
            >
              {icon}
            </Button>
          ))}
        </div>

        {/* Team Avatars with Profile Peek */}
        <div className="hidden items-center gap-1 sm:flex">
          {memberUsers.map((user) => (
            <UserProfilePeek key={user.id} user={user}>
              <Avatar className="border-background hover:ring-primary/20 h-8 w-8 cursor-pointer border-2 transition-all hover:ring-2">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </UserProfilePeek>
          ))}
          {members.length > 4 && (
            <Avatar className="border-background h-8 w-8 border-2">
              <AvatarFallback className="bg-muted text-xs">+{members.length - 4}</AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Filter */}
        <Button variant="ghost" size="icon">
          <Filter className="h-4 w-4" />
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
