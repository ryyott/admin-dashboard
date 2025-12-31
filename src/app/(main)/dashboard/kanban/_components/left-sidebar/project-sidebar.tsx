"use client";

import { useState } from "react";

import { Star, Folder, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useKanbanStore } from "@/stores/kanban-store";

import { CreateProjectDialog } from "./create-project-dialog";

export function ProjectSidebar() {
  const { projects, activeProjectId, setActiveProject, toggleProjectFavorite } = useKanbanStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const favoriteProjects = projects.filter((p) => p.isFavorite);
  const otherProjects = projects.filter((p) => !p.isFavorite);

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-4 p-4">
        {/* Favorites Section */}
        {favoriteProjects.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-muted-foreground px-2 text-xs font-semibold tracking-wider uppercase">Favorites</h3>
            <div className="space-y-1">
              {favoriteProjects.map((project) => (
                <div
                  key={project.id}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    activeProjectId === project.id ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                  )}
                  onClick={() => setActiveProject(project.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveProject(project.id);
                    }
                  }}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {project.color && (
                      <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: project.color }} />
                    )}
                    <span className="truncate">{project.name}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleProjectFavorite(project.id);
                    }}
                    className="shrink-0 transition-opacity hover:opacity-80"
                    aria-label="Remove from favorites"
                  >
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Projects Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">All Projects</h3>
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-1">
            {otherProjects.map((project) => (
              <div
                key={project.id}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  activeProjectId === project.id ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                )}
                onClick={() => setActiveProject(project.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveProject(project.id);
                  }
                }}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Folder className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{project.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProjectFavorite(project.id);
                  }}
                  className="shrink-0 transition-opacity hover:opacity-80"
                  aria-label="Add to favorites"
                >
                  <Star className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Categories (Future Feature) */}
        <div className="space-y-2">
          <h3 className="text-muted-foreground px-2 text-xs font-semibold tracking-wider uppercase">Categories</h3>
          <div className="space-y-1">
            <button className="hover:bg-accent/50 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors">
              <div className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>Development</span>
            </button>
            <button className="hover:bg-accent/50 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors">
              <div className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
              <span>Design</span>
            </button>
            <button className="hover:bg-accent/50 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors">
              <div className="h-2 w-2 shrink-0 rounded-full bg-purple-500" />
              <span>Marketing</span>
            </button>
          </div>
        </div>
      </div>

      <CreateProjectDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </ScrollArea>
  );
}
