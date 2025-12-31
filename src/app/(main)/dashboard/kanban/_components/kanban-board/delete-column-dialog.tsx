"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useKanbanStore } from "@/stores/kanban-store";
import type { Column } from "@/types/kanban";

interface DeleteColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  column: Column;
}

export function DeleteColumnDialog({ open, onOpenChange, column }: DeleteColumnDialogProps) {
  const { deleteColumn, getColumnTasks } = useKanbanStore();
  const tasks = getColumnTasks(column.id);

  const handleDelete = () => {
    deleteColumn(column.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{column.title}"?</AlertDialogTitle>
          <AlertDialogDescription>
            {tasks.length > 0 ? (
              <>
                This list contains{" "}
                <strong>
                  {tasks.length} task{tasks.length !== 1 ? "s" : ""}
                </strong>
                . All tasks in this list will be permanently deleted. This action cannot be undone.
              </>
            ) : (
              "This action cannot be undone. This will permanently delete this list."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete List
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
