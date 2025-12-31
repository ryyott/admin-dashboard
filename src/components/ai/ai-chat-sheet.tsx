"use client";

import { Sparkles } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { AIMessage } from "./ai-message";
import { AIPromptForm } from "./ai-prompt-form";

interface AIChatSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }>;
  isTyping?: boolean;
  onSendMessage: (message: string) => void;
  placeholder?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  suggestions?: React.ReactNode;
  currentUserName?: string;
  currentUserAvatar?: string;
}

export function AIChatSheet({
  isOpen,
  onOpenChange,
  title,
  subtitle,
  messages,
  isTyping = false,
  onSendMessage,
  placeholder = "Ask AI to help...",
  emptyStateTitle = "Welcome to AI Assistant",
  emptyStateDescription = "I can help you with various tasks and answer questions.",
  suggestions,
  currentUserName,
  currentUserAvatar,
}: AIChatSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:w-[480px]">
        <SheetHeader className="border-border border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-base">{title}</SheetTitle>
                {subtitle && <p className="text-muted-foreground text-xs">{subtitle}</p>}
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-12">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h4 className="mb-2 text-lg font-semibold">{emptyStateTitle}</h4>
                <p className="text-muted-foreground mb-6 max-w-[300px] text-center text-sm">{emptyStateDescription}</p>
                {suggestions}
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <AIMessage
                    key={message.id}
                    message={message}
                    currentUserName={currentUserName}
                    currentUserAvatar={currentUserAvatar}
                  />
                ))}
                {isTyping && (
                  <div className="text-muted-foreground flex items-center gap-2 px-3 py-2 text-sm">
                    <div className="flex gap-1">
                      <span className="animate-bounce">●</span>
                      <span className="animation-delay-200 animate-bounce">●</span>
                      <span className="animation-delay-400 animate-bounce">●</span>
                    </div>
                    <span>AI is thinking...</span>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-border border-t px-6 py-4">
          <AIPromptForm onSubmit={onSendMessage} disabled={isTyping} placeholder={placeholder} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
