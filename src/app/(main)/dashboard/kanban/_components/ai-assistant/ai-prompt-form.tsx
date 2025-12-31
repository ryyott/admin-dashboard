"use client";

import { useState, useRef, useEffect } from "react";

import { Send, CornerDownLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AIPromptFormProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function AIPromptForm({ onSubmit, disabled, placeholder = "Ask Kanban AI..." }: AIPromptFormProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || disabled) return;
    onSubmit(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-background focus-within:ring-ring relative overflow-hidden rounded-lg border focus-within:ring-1"
    >
      <Label htmlFor="message" className="sr-only">
        Message
      </Label>
      <Textarea
        ref={textareaRef}
        id="message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="max-h-[120px] min-h-[60px] resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        rows={1}
      />
      <div className="flex items-center p-3 pt-0">
        <div className="text-muted-foreground flex-1 text-xs">
          <kbd className="border-border bg-muted pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">⌘</span>Enter
          </kbd>{" "}
          to send
        </div>
        <Button type="submit" size="sm" disabled={!input.trim() || disabled} className="gap-1.5">
          Send
          <CornerDownLeft className="h-3.5 w-3.5" />
        </Button>
      </div>
    </form>
  );
}
