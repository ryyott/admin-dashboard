"use client";

import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useKanbanStore } from "@/stores/kanban-store";
import type { Tag } from "@/types/kanban";

interface TaskTagsProps {
  taskId?: string;
  tags: Tag[];
  editable?: boolean;
  maxDisplay?: number;
}

export function TaskTags({ taskId, tags, editable = false, maxDisplay }: TaskTagsProps) {
  const { removeTag } = useKanbanStore();

  if (tags.length === 0) {
    return <p className="text-muted-foreground text-sm">No tags</p>;
  }

  const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags;
  const remainingCount = maxDisplay && tags.length > maxDisplay ? tags.length - maxDisplay : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className="gap-1 text-xs"
          style={{
            backgroundColor: `${tag.color}15`,
            color: tag.color,
            borderColor: `${tag.color}30`,
          }}
        >
          {tag.label}
          {editable && taskId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTag(taskId, tag.id);
              }}
              className="hover:bg-background/20 ml-1 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
}
