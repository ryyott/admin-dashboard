"use client";

import { useState, useRef, useEffect } from "react";

import { Sparkles, X, FileText, Calculator, Send, TrendingUp } from "lucide-react";

import { AIMessage } from "@/components/ai/ai-message";
import { AIPromptForm } from "@/components/ai/ai-prompt-form";
import { AISuggestions } from "@/components/ai/ai-suggestions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function InvoiceAIChatDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
      timestamp: Date;
    }>
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const [position, setPosition] = useState({ x: 24, y: 24 }); // bottom-6 right-6 in pixels
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const invoiceSuggestions = [
    {
      icon: FileText,
      text: "Help me create an invoice",
    },
    {
      icon: Calculator,
      text: "Calculate invoice totals",
    },
    {
      icon: TrendingUp,
      text: "Analyze invoice trends",
    },
    {
      icon: Send,
      text: "Suggest payment terms",
    },
  ];

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI typing
    setIsTyping(true);

    // Simulate AI response (in production, this would call an actual AI API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant" as const,
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  // Auto-scroll to bottom when new messages arrive or when typing
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;

      const deltaX = dragRef.current.startX - e.clientX;
      const deltaY = e.clientY - dragRef.current.startY;

      // Calculate new position with screen boundary constraints
      const newX = dragRef.current.initialX + deltaX;
      const newY = dragRef.current.initialY + deltaY;

      // FAB dimensions
      const fabSize = 56; // h-14 = 56px

      // Chat dialog dimensions
      const chatWidth = 420;
      const chatHeight = 700; // Updated height

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Constrain position so chat dialog stays on screen
      // Right edge: position.x is distance from right edge
      const maxX = viewportWidth - chatWidth - 24; // 24px minimum margin
      const minX = 24;

      // Bottom edge: position.y is distance from bottom edge
      // Account for chat height + FAB height + gap (72px)
      const maxY = viewportHeight - fabSize - 24; // Keep FAB visible
      const minY = chatHeight + 16; // Ensure chat doesn't go above viewport

      setPosition({
        x: Math.max(minX, Math.min(maxX, newX)),
        y: Math.max(24, Math.min(maxY, newY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const chatPosition = {
    right: `${position.x}px`,
    bottom: `${position.y + 72}px`, // 72px = FAB height (56px) + gap (16px)
  };

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          if (!isDragging) {
            setIsOpen(!isOpen);
          }
        }}
        style={{
          right: `${position.x}px`,
          bottom: `${position.y}px`,
        }}
        className={cn(
          "fixed z-50 h-14 w-14 rounded-full shadow-lg",
          "bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
          "transition-transform duration-200",
          isDragging ? "scale-110 cursor-grabbing" : "cursor-grab hover:scale-110",
        )}
      >
        {isOpen ? (
          <X className="pointer-events-none h-6 w-6 text-white" />
        ) : (
          <Sparkles className="pointer-events-none h-6 w-6 text-white" />
        )}
      </Button>

      {/* Chat Overlay */}
      <div
        style={{
          ...chatPosition,
          maxHeight: "calc(100vh - 8rem)",
          height: "700px",
        }}
        className={cn(
          "fixed z-40 w-[420px] rounded-lg shadow-2xl",
          "bg-background border-border border",
          "transition-all duration-300 ease-in-out",
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0",
          "flex flex-col overflow-hidden",
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between bg-gradient-to-br from-blue-500 to-indigo-600 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Invoice AI</h3>
              <p className="text-xs text-white/80">Your invoice assistant</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h4 className="mb-2 text-lg font-semibold">Welcome to Invoice AI</h4>
              <p className="text-muted-foreground mb-6 max-w-[300px] text-center text-sm">
                I can help you create invoices, calculate totals, analyze trends, and suggest payment terms.
              </p>
              <AISuggestions suggestions={invoiceSuggestions} onSuggestionClick={handleSuggestionClick} />
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <AIMessage key={message.id} message={message} currentUserName="You" />
              ))}
              {isTyping && (
                <div className="text-muted-foreground flex items-center gap-2 px-3 py-2 text-sm">
                  <div className="flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animation-delay-200 animate-bounce">●</span>
                    <span className="animation-delay-400 animate-bounce">●</span>
                  </div>
                  <span>Invoice AI is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-border bg-background shrink-0 border-t p-4">
          <AIPromptForm onSubmit={handleSendMessage} disabled={isTyping} placeholder="Ask Invoice AI to help..." />
        </div>
      </div>
    </>
  );
}

// Simulated AI responses (in production, replace with actual AI API calls)
function generateAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("create") || lowerMessage.includes("invoice")) {
    return "I'd be happy to help you create an invoice! To get started, I'll need the following information:\n\n1. Client details (name, email, address)\n2. Invoice items (description, quantity, price)\n3. Tax rate and any discounts\n4. Payment terms\n\nWould you like me to guide you through each step?";
  }

  if (lowerMessage.includes("calculate") || lowerMessage.includes("total")) {
    return "I can help you calculate invoice totals. The calculation typically includes:\n\n• Subtotal (sum of all items)\n• Tax (subtotal × tax rate)\n• Discount (if applicable)\n• Grand Total\n\nWould you like me to explain how to add items or adjust tax rates?";
  }

  if (lowerMessage.includes("trend") || lowerMessage.includes("analyze")) {
    return "Based on your invoice data, I can help analyze:\n\n• Revenue trends over time\n• Payment patterns\n• Outstanding invoices\n• Client payment history\n\nWhat specific analysis would you like to see?";
  }

  if (lowerMessage.includes("payment") || lowerMessage.includes("terms")) {
    return "Here are some common payment terms you can use:\n\n• Net 30: Payment due within 30 days\n• Net 15: Payment due within 15 days\n• Due on Receipt: Payment due immediately\n• 2/10 Net 30: 2% discount if paid within 10 days\n\nWould you like me to suggest payment terms based on your client relationship?";
  }

  return "I'm here to help with your invoices! I can assist with:\n\n• Creating new invoices\n• Calculating totals and taxes\n• Analyzing invoice trends\n• Suggesting payment terms\n• Managing client information\n\nWhat would you like help with?";
}
