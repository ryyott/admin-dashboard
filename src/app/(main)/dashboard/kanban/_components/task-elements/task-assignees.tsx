"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useKanbanStore } from "@/stores/kanban-store";

import { UserProfilePeek } from "../shared/user-profile-peek";

interface TaskAssigneesProps {
  assigneeIds: string[];
  maxDisplay?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TaskAssignees({ assigneeIds, maxDisplay = 3, size = "sm", className }: TaskAssigneesProps) {
  const { getUserById } = useKanbanStore();
  const assignees = assigneeIds
    .map((id) => getUserById(id))
    .filter((user): user is NonNullable<typeof user> => user !== null);
  const displayedAssignees = assignees.slice(0, maxDisplay);
  const remaining = assignees.length - maxDisplay;

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  };

  if (assignees.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {displayedAssignees.map((assignee) => (
        <UserProfilePeek key={assignee.id} user={assignee}>
          <Avatar
            className={cn(
              sizeClasses[size],
              "border-background hover:ring-primary/20 cursor-pointer border-2 transition-all hover:ring-2",
            )}
          >
            <AvatarImage src={assignee.avatar} alt={assignee.name} />
            <AvatarFallback className="text-xs">{getInitials(assignee.name)}</AvatarFallback>
          </Avatar>
        </UserProfilePeek>
      ))}
      {remaining > 0 && (
        <Avatar className={cn(sizeClasses[size], "border-background border-2")}>
          <AvatarFallback className="bg-muted text-xs">+{remaining}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
