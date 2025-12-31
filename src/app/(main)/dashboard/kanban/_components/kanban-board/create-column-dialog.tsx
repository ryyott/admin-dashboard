"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useKanbanStore } from "@/stores/kanban-store";

interface CreateColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COLORS = [
  { name: "Gray", value: "#94a3b8" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Yellow", value: "#f59e0b" },
  { name: "Red", value: "#ef4444" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
];

export function CreateColumnDialog({ open, onOpenChange }: CreateColumnDialogProps) {
  const { createColumn, getProjectColumns } = useKanbanStore();
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const columns = getProjectColumns();
    const position = columns.length;

    createColumn({
      title: title.trim(),
      color: selectedColor,
      position,
    });

    // Reset form
    setTitle("");
    setSelectedColor(COLORS[0].value);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Another List</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">List Title *</Label>
            <Input
              id="title"
              placeholder="Enter list title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className="relative h-8 w-8 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: color.value,
                    borderColor: selectedColor === color.value ? color.value : "transparent",
                    boxShadow:
                      selectedColor === color.value
                        ? `0 0 0 2px hsl(var(--background)), 0 0 0 4px ${color.value}`
                        : "none",
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add List
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
