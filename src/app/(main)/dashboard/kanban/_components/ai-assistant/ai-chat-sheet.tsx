"use client";

import { Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useKanbanStore } from "@/stores/kanban-store";

import { AIMessage } from "./ai-message";
import { AIPromptForm } from "./ai-prompt-form";
import { AISuggestions } from "./ai-suggestions";

export function AIChatSheet() {
  const { isAiPanelOpen, toggleAiPanel, aiMessages, isAiTyping, sendAiMessage, selectedTaskId } = useKanbanStore();

  const handleSend = (message: string) => {
    sendAiMessage(message, selectedTaskId || undefined);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendAiMessage(suggestion, selectedTaskId || undefined);
  };

  return (
    <Sheet open={isAiPanelOpen} onOpenChange={toggleAiPanel}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:w-[480px]">
        <SheetHeader className="border-border border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-base">Kanban AI</SheetTitle>
                <p className="text-muted-foreground text-xs">Your task assistant</p>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-4">
            {aiMessages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-12">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h4 className="mb-2 text-lg font-semibold">Welcome to Kanban AI</h4>
                <p className="text-muted-foreground mb-6 max-w-[300px] text-center text-sm">
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
        <div className="border-border border-t px-6 py-4">
          <AIPromptForm onSubmit={handleSend} disabled={isAiTyping} placeholder="Ask Kanban AI to help with tasks..." />
        </div>
      </SheetContent>
    </Sheet>
  );
}
