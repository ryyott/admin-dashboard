"use client";

import { useState } from "react";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { TodoItem } from "@/types/chat";

interface TodoPanelProps {
  todos: TodoItem[];
  onToggleTodo?: (id: string) => void;
  onAddTodo?: (content: string, emoji: string) => void;
  onDeleteTodo?: (id: string) => void;
}

const todoEmojis = ["🍰", "🌱", "🥕", "⚡", "☁️", "💯", "🎯", "🔥"];

export function TodoPanel({ todos, onToggleTodo, onAddTodo, onDeleteTodo }: TodoPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(todoEmojis[0]);

  const handleAddTodo = () => {
    if (newTodo.trim() && onAddTodo) {
      onAddTodo(newTodo, selectedEmoji);
      setNewTodo("");
      setIsAdding(false);
      setSelectedEmoji(todoEmojis[0]);
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">To-Do Lists</h3>
        {!isAdding && (
          <Button variant="ghost" size="sm" onClick={() => setIsAdding(true)} className="h-auto rounded-lg p-1.5">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Add New Todo */}
      {isAdding && (
        <div className="border-border bg-muted/50 space-y-2 rounded-lg border p-3">
          <div className="flex gap-2">
            {todoEmojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedEmoji(emoji)}
                className={cn("h-8 w-8 p-0 text-lg", selectedEmoji === emoji && "bg-accent")}
              >
                {emoji}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
              placeholder="Add a task..."
              className="h-8 text-sm"
              autoFocus
            />
            <Button size="sm" onClick={handleAddTodo} disabled={!newTodo.trim()} className="h-8 px-3">
              Add
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setNewTodo("");
              }}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Todo List */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <div className="border-border flex h-32 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground text-sm">No tasks yet</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="group hover:bg-accent flex items-start gap-3 rounded-lg p-2.5 transition-colors"
            >
              <Checkbox checked={todo.completed} onCheckedChange={() => onToggleTodo?.(todo.id)} className="mt-0.5" />
              <div className="flex-1">
                <div className="flex items-start gap-2">
                  {todo.emoji && <span className="text-base">{todo.emoji}</span>}
                  <p
                    className={cn(
                      "flex-1 text-sm leading-relaxed",
                      todo.completed && "text-muted-foreground line-through",
                    )}
                  >
                    {todo.content}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteTodo?.(todo.id)}
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))
        )}
      </div>

      {todos.length > 0 && (
        <div className="bg-muted/50 text-muted-foreground rounded-lg px-3 py-2 text-center text-xs">
          {completedCount} of {todos.length} completed
        </div>
      )}
    </div>
  );
}
