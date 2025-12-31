"use client";

import * as React from "react";

import { Plus, X } from "lucide-react";
import { motion, type Transition } from "motion/react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { TodoItem } from "@/types/chat";

const checkboxItems = [
  {
    id: 1,
    label: "Code in Assembly 💾",
    defaultChecked: false,
  },
  {
    id: 2,
    label: "Present a bug as a feature 🪲",
    defaultChecked: false,
  },
  {
    id: 3,
    label: "Push to prod on a Friday 🚀",
    defaultChecked: false,
  },
];

const getPathAnimate = (isChecked: boolean) => ({
  pathLength: isChecked ? 1 : 0,
  opacity: isChecked ? 1 : 0,
});

const getPathTransition = (isChecked: boolean): Transition => ({
  pathLength: { duration: 1, ease: "easeInOut" },
  opacity: {
    duration: 0.01,
    delay: isChecked ? 0 : 1,
  },
});

interface PlayfulTodolistProps {
  todos?: TodoItem[];
  onToggleTodo?: (id: string) => void;
  onAddTodo?: (content: string, emoji: string) => void;
  onDeleteTodo?: (id: string) => void;
}

const todoEmojis = ["🍰", "🌱", "🥕", "⚡", "☁️", "💯", "🎯", "🔥"];

function PlayfulTodolist({ todos, onToggleTodo, onAddTodo, onDeleteTodo }: PlayfulTodolistProps) {
  const [checked, setChecked] = React.useState(checkboxItems.map((i) => !!i.defaultChecked));
  const [isAdding, setIsAdding] = React.useState(false);
  const [newTodo, setNewTodo] = React.useState("");
  const [selectedEmoji, setSelectedEmoji] = React.useState(todoEmojis[0]);

  const handleAddTodo = () => {
    if (newTodo.trim() && onAddTodo) {
      onAddTodo(newTodo, selectedEmoji);
      setNewTodo("");
      setIsAdding(false);
      setSelectedEmoji(todoEmojis[0]);
    }
  };

  // If todos prop is provided, use controlled mode
  const isControlled = todos !== undefined;
  const displayTodos = isControlled ? todos : checkboxItems;
  const completedCount = isControlled ? todos.filter((t) => t.completed).length : checked.filter(Boolean).length;

  return (
    <div className="space-y-6 rounded-2xl bg-neutral-100 p-6 dark:bg-neutral-900">
      {/* Header with Add Button */}
      {isControlled && (
        <div className="-mt-2 mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">To-Do Lists</h3>
          {!isAdding && (
            <Button variant="ghost" size="sm" onClick={() => setIsAdding(true)} className="h-auto rounded-lg p-1.5">
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Add New Todo Form */}
      {isControlled && isAdding && (
        <div className="border-border bg-background/50 -mt-2 space-y-3 rounded-lg border p-3">
          <div className="flex flex-wrap gap-1.5">
            {todoEmojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedEmoji(emoji)}
                className={cn("h-7 w-7 p-0 text-base", selectedEmoji === emoji && "bg-accent")}
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
              className="h-8 flex-1 text-sm"
              autoFocus
            />
            <Button size="sm" onClick={handleAddTodo} disabled={!newTodo.trim()} className="h-8 shrink-0 px-2.5">
              Add
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsAdding(false);
              setNewTodo("");
            }}
            className="h-7 w-full"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Empty State */}
      {isControlled && displayTodos.length === 0 && (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
          <p className="text-muted-foreground text-sm">No tasks yet</p>
        </div>
      )}

      {/* Todo Items */}
      {displayTodos.map((item, idx) => {
        const todoItem = item as TodoItem;
        const isChecked = isControlled ? todoItem.completed : checked[idx];
        const itemId = isControlled ? todoItem.id : item.id;
        const label = isControlled
          ? `${todoItem.emoji || ""} ${todoItem.content}`.trim()
          : (item as (typeof checkboxItems)[0]).label;

        const handleToggle = () => {
          if (isControlled && onToggleTodo) {
            onToggleTodo(String(itemId));
          } else {
            const updated = [...checked];
            updated[idx] = !updated[idx];
            setChecked(updated);
          }
        };

        return (
          <div key={itemId} className="space-y-6">
            <div className="group flex items-center space-x-2">
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => handleToggle()}
                id={`checkbox-${itemId}`}
                className="shrink-0"
              />
              <div className="relative inline-block flex-1 cursor-pointer" onClick={handleToggle}>
                <Label htmlFor={`checkbox-${itemId}`} className="cursor-pointer select-none">
                  {label}
                </Label>
                <motion.svg
                  width="340"
                  height="32"
                  viewBox="0 0 340 32"
                  className="pointer-events-none absolute top-1/2 left-0 z-20 h-10 w-full -translate-y-1/2"
                >
                  <motion.path
                    d="M 10 16.91 s 79.8 -11.36 98.1 -11.34 c 22.2 0.02 -47.82 14.25 -33.39 22.02 c 12.61 6.77 124.18 -27.98 133.31 -17.28 c 7.52 8.38 -26.8 20.02 4.61 22.05 c 24.55 1.93 113.37 -20.36 113.37 -20.36"
                    vectorEffect="non-scaling-stroke"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeMiterlimit={10}
                    fill="none"
                    initial={false}
                    animate={getPathAnimate(!!isChecked)}
                    transition={getPathTransition(!!isChecked)}
                    className="stroke-neutral-900 dark:stroke-neutral-100"
                  />
                </motion.svg>
              </div>
              {isControlled && onDeleteTodo && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTodo(String(itemId));
                  }}
                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            {idx !== displayTodos.length - 1 && <div className="border-t border-neutral-300 dark:border-neutral-700" />}
          </div>
        );
      })}

      {/* Completion Counter */}
      {isControlled && displayTodos.length > 0 && (
        <div className="bg-background/50 text-muted-foreground rounded-lg px-3 py-2 text-center text-xs">
          {completedCount} of {displayTodos.length} completed
        </div>
      )}
    </div>
  );
}

export { PlayfulTodolist };
