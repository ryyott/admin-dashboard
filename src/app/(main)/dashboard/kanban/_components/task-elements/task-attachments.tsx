"use client";

import { FileText, Image, Video, File, Download, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useKanbanStore } from "@/stores/kanban-store";
import type { Attachment } from "@/types/kanban";

interface TaskAttachmentsProps {
  taskId: string;
  attachments: Attachment[];
}

export function TaskAttachments({ taskId, attachments }: TaskAttachmentsProps) {
  const { deleteAttachment } = useKanbanStore();

  const getFileIcon = (type: Attachment["type"]) => {
    switch (type) {
      case "image":
        return Image;
      case "video":
        return Video;
      case "document":
        return FileText;
      default:
        return File;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (attachments.length === 0) {
    return <p className="text-muted-foreground py-4 text-center text-sm">No attachments yet</p>;
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => {
        const Icon = getFileIcon(attachment.type);

        return (
          <div
            key={attachment.id}
            className="border-border group hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 transition-colors"
          >
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-md">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{attachment.name}</p>
              <p className="text-muted-foreground text-xs">{formatFileSize(attachment.size)}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => deleteAttachment(taskId, attachment.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
