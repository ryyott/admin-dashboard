"use client";

import { useState } from "react";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useKanbanStore } from "@/stores/kanban-store";
import type { Column } from "@/types/kanban";

import { CreateTaskDialog } from "../task-dialogs/create-task-dialog";

import { DeleteColumnDialog } from "./delete-column-dialog";
import { EditColumnDialog } from "./edit-column-dialog";
import { TaskCard } from "./task-card";

interface KanbanColumnProps {
  column: Column;
}

export function KanbanColumn({ column }: KanbanColumnProps) {
  const { getColumnTasks } = useKanbanStore();
  const tasks = getColumnTasks(column.id);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <>
      <div className="bg-muted/30 flex w-72 shrink-0 flex-col rounded-lg">
        {/* Column Header */}
        <div className="border-border flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            {column.color && <div className="h-3 w-3 rounded-full" style={{ backgroundColor: column.color }} />}
            <h3 className="text-sm font-semibold">{column.title}</h3>
            <Badge variant="secondary" className="h-5 min-w-[20px] px-1.5">
              {tasks.length}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Column Content */}
        <ScrollArea className="flex-1 p-4">
          <div
            ref={setNodeRef}
            className={cn(
              "min-h-[200px]",
              isOver && "bg-accent/50 rounded-lg",
              tasks.length === 0 && "flex items-center justify-center",
            )}
          >
            {tasks.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center text-sm">No tasks yet</p>
            ) : (
              <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </SortableContext>
            )}
          </div>
        </ScrollArea>
      </div>

      <CreateTaskDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} columnId={column.id} />

      <EditColumnDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} column={column} />

      <DeleteColumnDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} column={column} />
    </>
  );
}
