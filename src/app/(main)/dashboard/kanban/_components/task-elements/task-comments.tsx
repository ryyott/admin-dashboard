"use client";

import { useState } from "react";

import { format } from "date-fns";
import { Send, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getInitials } from "@/lib/utils";
import { useKanbanStore } from "@/stores/kanban-store";
import type { Comment } from "@/types/kanban";

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
}

export function TaskComments({ taskId, comments }: TaskCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const { addComment, deleteComment, getUserById, currentUserId } = useKanbanStore();

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment(taskId, newComment);
    setNewComment("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const user = getUserById(comment.userId);
        if (!user) return null;

        return (
          <div key={comment.id} className="group flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-muted-foreground text-xs">{format(comment.createdAt, "MMM d, h:mm a")}</span>
                {comment.isEdited && <span className="text-muted-foreground text-xs">(edited)</span>}
              </div>
              <p className="text-muted-foreground text-sm whitespace-pre-wrap">{comment.content}</p>
            </div>
            {comment.userId === currentUserId && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => deleteComment(taskId, comment.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        );
      })}

      {/* Add New Comment */}
      <div className="space-y-2 pt-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment... (Ctrl+Enter to send)"
          className="min-h-[80px] resize-none text-sm"
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
            <Send className="mr-1 h-3.5 w-3.5" />
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
