"use client";

import { useState } from "react";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useKanbanStore } from "@/stores/kanban-store";

import { CreateColumnDialog } from "./create-column-dialog";
import { KanbanColumn } from "./kanban-column";
import { KanbanListView } from "./kanban-list-view";
import { KanbanTableView } from "./kanban-table-view";
import { TaskCard } from "./task-card";

export function KanbanBoard() {
  const { viewMode } = useKanbanStore();

  // Show different views based on viewMode
  if (viewMode === "table") {
    return <KanbanTableView />;
  }

  if (viewMode === "list") {
    return <KanbanListView />;
  }

  // Default Kanban view
  return <KanbanView />;
}

function KanbanView() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const { getProjectColumns, moveTask, getTaskById } = useKanbanStore();

  const columns = getProjectColumns();
  const activeTask = activeId ? getTaskById(activeId) : null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find if we're over a column or a task
    const activeTask = getTaskById(activeId);
    if (!activeTask) return;

    // Check if overId is a column
    const overColumn = columns.find((col) => col.id === overId);
    if (overColumn) {
      // Dropped over a column, move to end of that column
      if (activeTask.columnId !== overColumn.id) {
        const position = overColumn.taskIds.length;
        moveTask(activeId, overColumn.id, position);
      }
      return;
    }

    // Check if overId is a task
    const overTask = getTaskById(overId);
    if (overTask && activeTask.columnId !== overTask.columnId) {
      // Moving to a different column, insert before the over task
      const overColumnId = overTask.columnId;
      const overColumn = columns.find((col) => col.id === overColumnId);
      if (overColumn) {
        const position = overColumn.taskIds.indexOf(overId);
        moveTask(activeId, overColumnId, position);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = getTaskById(activeId);
    if (!activeTask) {
      setActiveId(null);
      return;
    }

    // Check if overId is a column
    const overColumn = columns.find((col) => col.id === overId);
    if (overColumn) {
      // Dropped over a column, move to end of that column
      const position = overColumn.taskIds.length;
      moveTask(activeId, overColumn.id, position);
      setActiveId(null);
      return;
    }

    // Check if overId is a task
    const overTask = getTaskById(overId);
    if (overTask) {
      const overColumnId = overTask.columnId;
      const overColumn = columns.find((col) => col.id === overColumnId);

      if (overColumn) {
        // If same column, reorder
        if (activeTask.columnId === overColumnId) {
          const oldIndex = overColumn.taskIds.indexOf(activeId);
          const newIndex = overColumn.taskIds.indexOf(overId);
          moveTask(activeId, overColumnId, newIndex);
        } else {
          // Different column, insert before over task
          const position = overColumn.taskIds.indexOf(overId);
          moveTask(activeId, overColumnId, position);
        }
      }
    }

    setActiveId(null);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <ScrollArea className="h-full w-full p-6">
          <div className="flex min-h-full gap-4">
            <SortableContext items={columns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
              {columns.map((column) => (
                <KanbanColumn key={column.id} column={column} />
              ))}
            </SortableContext>

            {/* Add Another List Button */}
            <Button
              variant="ghost"
              className="border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/50 text-muted-foreground flex h-auto w-72 shrink-0 flex-col items-center justify-start gap-2 border-2 border-dashed p-4"
              onClick={() => setIsAddColumnOpen(true)}
            >
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Add another list</span>
              </div>
            </Button>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <DragOverlay>{activeTask ? <TaskCard task={activeTask} isDragging /> : null}</DragOverlay>
      </DndContext>

      <CreateColumnDialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen} />
    </>
  );
}
