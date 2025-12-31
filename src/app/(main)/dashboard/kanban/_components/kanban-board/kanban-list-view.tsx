"use client";

import { MessageSquare, Paperclip } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useKanbanStore } from "@/stores/kanban-store";

import { TaskAssignees } from "../task-elements/task-assignees";
import { TaskDueDate } from "../task-elements/task-due-date";
import { TaskPriority } from "../task-elements/task-priority";
import { TaskProgress } from "../task-elements/task-progress";
import { TaskTags } from "../task-elements/task-tags";

export function KanbanListView() {
  const { getProjectColumns, getColumnTasks, setSelectedTask } = useKanbanStore();
  const columns = getProjectColumns();

  return (
    <ScrollArea className="h-full w-full">
      <div className="space-y-8 p-6">
        {columns.map((column) => {
          const tasks = getColumnTasks(column.id);

          return (
            <div key={column.id} className="space-y-3">
              {/* Column Header */}
              <div className="border-border flex items-center gap-2 border-b pb-2">
                {column.color && <div className="h-3 w-3 rounded-full" style={{ backgroundColor: column.color }} />}
                <h3 className="text-sm font-semibold">{column.title}</h3>
                <span className="text-muted-foreground text-xs">({tasks.length})</span>
              </div>

              {/* Tasks List */}
              <div className="space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-muted-foreground py-4 text-center text-sm">No tasks in this column</p>
                ) : (
                  tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTask(task.id)}
                      className={cn(
                        "border-border flex w-full items-center gap-4 rounded-lg border p-3",
                        "hover:bg-accent/50 text-left transition-colors",
                      )}
                    >
                      {/* Priority */}
                      <div className="shrink-0">
                        <TaskPriority priority={task.priority} />
                      </div>

                      {/* Task Info */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="truncate text-sm font-medium">{task.title}</h4>
                          <TaskTags tags={task.tags} maxDisplay={2} />
                        </div>
                        {task.description && (
                          <p className="text-muted-foreground line-clamp-1 text-xs">{task.description}</p>
                        )}
                        {task.subtasks && task.subtasks.length > 0 && (
                          <TaskProgress
                            completed={task.subtasks.filter((st) => st.completed).length}
                            total={task.subtasks.length}
                            progress={(task.subtasks.filter((st) => st.completed).length / task.subtasks.length) * 100}
                          />
                        )}
                      </div>

                      {/* Metadata */}
                      <div className="flex shrink-0 items-center gap-4">
                        {/* Assignees */}
                        <TaskAssignees assigneeIds={task.assignees} maxDisplay={2} size="sm" />

                        {/* Due Date */}
                        {task.dueDate && <TaskDueDate dueDate={task.dueDate} />}

                        {/* Comments & Attachments */}
                        <div className="flex items-center gap-2">
                          {task.comments && task.comments.length > 0 && (
                            <div className="text-muted-foreground flex items-center gap-1 text-xs">
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span>{task.comments.length}</span>
                            </div>
                          )}
                          {task.attachments && task.attachments.length > 0 && (
                            <div className="text-muted-foreground flex items-center gap-1 text-xs">
                              <Paperclip className="h-3.5 w-3.5" />
                              <span>{task.attachments.length}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
