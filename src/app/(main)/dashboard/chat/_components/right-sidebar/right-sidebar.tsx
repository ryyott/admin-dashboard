"use client";

import { X } from "lucide-react";

import { PlayfulTodolist } from "@/components/animate-ui/components/community/playful-todolist";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Conversation, User, TodoItem, Attachment } from "@/types/chat";

import { GroupDetails } from "./group-details";
import { MembersList } from "./members-list";
import { SharedMedia } from "./shared-media";

interface RightSidebarProps {
  conversation: Conversation;
  members: User[];
  media: {
    images: Attachment[];
    documents: Attachment[];
    links: string[];
  };
  todos: TodoItem[];
  onClose?: () => void;
  onAddTodo?: (content: string, emoji: string) => void;
  onToggleTodo?: (todoId: string) => void;
  onDeleteTodo?: (todoId: string) => void;
}

export function RightSidebar({
  conversation,
  members,
  media,
  todos,
  onClose,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}: RightSidebarProps) {
  return (
    <div className="border-border bg-card flex h-full w-80 flex-col border-l">
      {/* Header */}
      <div className="border-border flex h-16 shrink-0 items-center justify-between border-b px-4">
        <h2 className="text-sm font-semibold">Detail group</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-lg">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-6 p-4 pb-6">
          <GroupDetails conversation={conversation} />
          <Separator />
          <MembersList members={members} />
          <Separator />
          <SharedMedia media={media} />
          <Separator />
          <PlayfulTodolist
            todos={todos}
            onAddTodo={onAddTodo}
            onToggleTodo={onToggleTodo}
            onDeleteTodo={onDeleteTodo}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
