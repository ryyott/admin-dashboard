"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MessageCircle, Paperclip } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useKanbanStore } from "@/stores/kanban-store";
import type { Task } from "@/types/kanban";

import { TaskAssignees } from "../task-elements/task-assignees";
import { TaskDueDate } from "../task-elements/task-due-date";
import { TaskPriority } from "../task-elements/task-priority";
import { TaskProgress } from "../task-elements/task-progress";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export function TaskCard({ task, isDragging }: TaskCardProps) {
  const { setSelectedTask } = useKanbanStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "mb-3 cursor-pointer transition-shadow hover:shadow-md",
        (isDragging || isSortableDragging) && "opacity-50",
      )}
      onClick={() => setSelectedTask(task.id)}
      {...attributes}
      {...listeners}
    >
      <CardContent className="space-y-3 p-4">
        {/* Priority & Tags */}
        <div className="flex items-start justify-between gap-2">
          <TaskPriority priority={task.priority} className="shrink-0" />
          <div className="flex flex-wrap justify-end gap-1">
            {task.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs"
                style={{
                  backgroundColor: `${tag.color}15`,
                  color: tag.color,
                  borderColor: `${tag.color}30`,
                }}
              >
                {tag.label}
              </Badge>
            ))}
            {task.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{task.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>

        {/* Title */}
        <h4 className="line-clamp-2 text-sm leading-tight font-medium">{task.title}</h4>

        {/* Description */}
        {task.description && <p className="text-muted-foreground line-clamp-2 text-xs">{task.description}</p>}

        {/* Subtask Progress */}
        {totalSubtasks > 0 && <TaskProgress completed={completedSubtasks} total={totalSubtasks} progress={progress} />}

        {/* Metadata Row */}
        <div className="flex items-center justify-between pt-2">
          {/* Assignees */}
          <TaskAssignees assigneeIds={task.assignees} maxDisplay={3} />

          {/* Counts & Due Date */}
          <div className="text-muted-foreground flex items-center gap-3">
            {task.comments.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="text-xs">{task.comments.length}</span>
              </div>
            )}
            {task.attachments.length > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-3.5 w-3.5" />
                <span className="text-xs">{task.attachments.length}</span>
              </div>
            )}
            {task.dueDate && <TaskDueDate dueDate={task.dueDate} compact />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
