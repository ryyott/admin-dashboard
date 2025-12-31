"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MessageSquare, Paperclip } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useKanbanStore } from "@/stores/kanban-store";
import { Task } from "@/types/kanban";

import { TaskAssignees } from "../task-elements/task-assignees";
import { TaskDueDate } from "../task-elements/task-due-date";
import { TaskPriority } from "../task-elements/task-priority";
import { TaskTags } from "../task-elements/task-tags";

export function KanbanTableView() {
  const { getProjectColumns, getColumnTasks, setSelectedTask, getColumnById } = useKanbanStore();
  const columns = getProjectColumns();

  // Flatten all tasks from all columns
  const allTasks = columns.flatMap((column) => getColumnTasks(column.id));

  const tableColumns: ColumnDef<Task>[] = [
    {
      accessorKey: "title",
      header: "Task",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <button onClick={() => setSelectedTask(row.original.id)} className="text-left font-medium hover:underline">
            {row.original.title}
          </button>
          {row.original.description && (
            <p className="text-muted-foreground line-clamp-1 text-xs">{row.original.description}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "columnId",
      header: "Status",
      cell: ({ row }) => {
        const column = getColumnById(row.original.columnId);
        return column ? (
          <div className="flex items-center gap-2">
            {column.color && <div className="h-2 w-2 rounded-full" style={{ backgroundColor: column.color }} />}
            <span className="text-sm">{column.title}</span>
          </div>
        ) : null;
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => <TaskPriority priority={row.original.priority} />,
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => <TaskTags tags={row.original.tags} maxDisplay={2} />,
    },
    {
      accessorKey: "assignees",
      header: "Assignees",
      cell: ({ row }) => <TaskAssignees assigneeIds={row.original.assignees} maxDisplay={3} size="sm" />,
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => (row.original.dueDate ? <TaskDueDate dueDate={row.original.dueDate} /> : null),
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const subtasks = row.original.subtasks || [];
        if (subtasks.length === 0) return null;
        const completed = subtasks.filter((st) => st.completed).length;
        const percentage = Math.round((completed / subtasks.length) * 100);
        return (
          <div className="flex items-center gap-2">
            <div className="bg-muted h-2 w-16 overflow-hidden rounded-full">
              <div className="bg-primary h-full transition-all" style={{ width: `${percentage}%` }} />
            </div>
            <span className="text-muted-foreground text-xs">{percentage}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: "metadata",
      header: "Activity",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.comments && row.original.comments.length > 0 && (
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <MessageSquare className="h-3 w-3" />
              <span>{row.original.comments.length}</span>
            </div>
          )}
          {row.original.attachments && row.original.attachments.length > 0 && (
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Paperclip className="h-3 w-3" />
              <span>{row.original.attachments.length}</span>
            </div>
          )}
        </div>
      ),
    },
  ];

  const table = useDataTableInstance({
    data: allTasks,
    columns: tableColumns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="rounded-lg border">
          <DataTable table={table} columns={tableColumns} />
        </div>
      </div>
      <div className="border-t p-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
