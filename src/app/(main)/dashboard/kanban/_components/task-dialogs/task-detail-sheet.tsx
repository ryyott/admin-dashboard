"use client";

import { format } from "date-fns";
import { Trash2, Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKanbanStore } from "@/stores/kanban-store";

import { TaskAssignees } from "../task-elements/task-assignees";
import { TaskAttachments } from "../task-elements/task-attachments";
import { TaskComments } from "../task-elements/task-comments";
import { TaskDueDate } from "../task-elements/task-due-date";
import { TaskPriority } from "../task-elements/task-priority";
import { TaskSubtasks } from "../task-elements/task-subtasks";
import { TaskTags } from "../task-elements/task-tags";

export function TaskDetailSheet() {
  const { selectedTaskId, setSelectedTask, getTaskById, deleteTask, getProjectColumns } = useKanbanStore();
  const task = selectedTaskId ? getTaskById(selectedTaskId) : null;

  if (!task) return null;

  const column = getProjectColumns().find((col) => col.id === task.columnId);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
      setSelectedTask(null);
    }
  };

  return (
    <Sheet open={!!selectedTaskId} onOpenChange={(open) => !open && setSelectedTask(null)}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-2xl">
        <SheetHeader className="border-b px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <SheetTitle className="text-xl">{task.title}</SheetTitle>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>in</span>
                <span className="font-medium">{column?.title}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 p-6">
            {/* Description */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Description</h3>
              <p className="text-muted-foreground text-sm">{task.description || "No description provided"}</p>
            </div>

            <Separator />

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Priority</label>
                <TaskPriority priority={task.priority} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Due Date</label>
                {task.dueDate ? (
                  <TaskDueDate dueDate={task.dueDate} />
                ) : (
                  <p className="text-muted-foreground text-sm">No due date</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Assignees */}
            <div>
              <label className="mb-2 block text-sm font-medium">Assignees</label>
              {task.assignees.length > 0 ? (
                <TaskAssignees assigneeIds={task.assignees} maxDisplay={10} size="md" />
              ) : (
                <p className="text-muted-foreground text-sm">No assignees</p>
              )}
            </div>

            <Separator />

            {/* Tags */}
            <div>
              <label className="mb-2 block text-sm font-medium">Tags</label>
              <TaskTags taskId={task.id} tags={task.tags} editable />
            </div>

            <Separator />

            {/* Tabs for detailed sections */}
            <Tabs defaultValue="subtasks" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="subtasks">Subtasks ({task.subtasks.length})</TabsTrigger>
                <TabsTrigger value="comments">Comments ({task.comments.length})</TabsTrigger>
                <TabsTrigger value="attachments">Files ({task.attachments.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="subtasks" className="mt-4">
                <TaskSubtasks taskId={task.id} subtasks={task.subtasks} />
              </TabsContent>

              <TabsContent value="comments" className="mt-4">
                <TaskComments taskId={task.id} comments={task.comments} />
              </TabsContent>

              <TabsContent value="attachments" className="mt-4">
                <TaskAttachments taskId={task.id} attachments={task.attachments} />
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Metadata Footer */}
            <div className="text-muted-foreground space-y-1 text-xs">
              <p>Created {format(task.createdAt, "MMM d, yyyy 'at' h:mm a")}</p>
              <p>Last updated {format(task.updatedAt, "MMM d, yyyy 'at' h:mm a")}</p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
