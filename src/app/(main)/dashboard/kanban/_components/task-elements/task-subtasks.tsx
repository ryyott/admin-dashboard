"use client";

import { useState } from "react";

import { Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useKanbanStore } from "@/stores/kanban-store";
import type { Subtask } from "@/types/kanban";

interface TaskSubtasksProps {
  taskId: string;
  subtasks: Subtask[];
}

export function TaskSubtasks({ taskId, subtasks }: TaskSubtasksProps) {
  const [newSubtask, setNewSubtask] = useState("");
  const { addSubtask, toggleSubtask, deleteSubtask } = useKanbanStore();

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    addSubtask(taskId, newSubtask);
    setNewSubtask("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSubtask();
    }
  };

  return (
    <div className="space-y-3">
      {subtasks.map((subtask) => (
        <div key={subtask.id} className="group flex items-center gap-2">
          <Checkbox
            id={subtask.id}
            checked={subtask.completed}
            onCheckedChange={() => toggleSubtask(taskId, subtask.id)}
          />
          <label
            htmlFor={subtask.id}
            className={`flex-1 cursor-pointer text-sm ${subtask.completed ? "text-muted-foreground line-through" : ""}`}
          >
            {subtask.content}
          </label>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => deleteSubtask(taskId, subtask.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}

      {/* Add New Subtask */}
      <div className="flex gap-2 pt-2">
        <Input
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a subtask..."
          className="h-8 text-sm"
        />
        <Button size="sm" onClick={handleAddSubtask} className="h-8 px-3">
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add
        </Button>
      </div>
    </div>
  );
}
