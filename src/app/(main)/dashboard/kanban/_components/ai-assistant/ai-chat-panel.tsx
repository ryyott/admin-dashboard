"use client";

import { Sparkles } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useKanbanStore } from "@/stores/kanban-store";

import { AIMessage } from "./ai-message";
import { AIPromptForm } from "./ai-prompt-form";
import { AISuggestions } from "./ai-suggestions";

export function AIChatPanel() {
  const { aiMessages, isAiTyping, sendAiMessage, selectedTaskId } = useKanbanStore();

  const handleSend = (message: string) => {
    sendAiMessage(message, selectedTaskId || undefined);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendAiMessage(suggestion, selectedTaskId || undefined);
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="border-border flex items-center gap-2 border-b px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Kanban AI</h3>
          <p className="text-muted-foreground text-xs">Your task assistant</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {aiMessages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h4 className="mb-2 font-semibold">Welcome to Kanban AI</h4>
              <p className="text-muted-foreground mb-4 max-w-[250px] text-center text-sm">
                I can help you manage tasks, analyze progress, and suggest improvements.
              </p>
              <AISuggestions onSuggestionClick={handleSuggestionClick} />
            </div>
          ) : (
            <>
              {aiMessages.map((message) => (
                <AIMessage key={message.id} message={message} />
              ))}
              {isAiTyping && (
                <div className="text-muted-foreground flex items-center gap-2 px-3 py-2 text-sm">
                  <div className="flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animation-delay-200 animate-bounce">●</span>
                    <span className="animation-delay-400 animate-bounce">●</span>
                  </div>
                  <span>Kanban AI is thinking...</span>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-border border-t p-4">
        <AIPromptForm onSubmit={handleSend} disabled={isAiTyping} placeholder="Ask Kanban AI to help with tasks..." />
      </div>
    </div>
  );
}
