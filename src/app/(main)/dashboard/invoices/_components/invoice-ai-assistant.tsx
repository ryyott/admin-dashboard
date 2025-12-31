"use client";

import { useState } from "react";

import { FileText, Calculator, Send, TrendingUp } from "lucide-react";

import { AIChatSheet } from "@/components/ai/ai-chat-sheet";
import { AISuggestions } from "@/components/ai/ai-suggestions";

interface InvoiceAIAssistantProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceAIAssistant({ isOpen, onOpenChange }: InvoiceAIAssistantProps) {
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
      timestamp: Date;
    }>
  >([]);
  const [isTyping, setIsTyping] = useState(false);

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

  return (
    <AIChatSheet
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Invoice AI"
      subtitle="Your invoice assistant"
      messages={messages}
      isTyping={isTyping}
      onSendMessage={handleSendMessage}
      placeholder="Ask Invoice AI to help..."
      emptyStateTitle="Welcome to Invoice AI"
      emptyStateDescription="I can help you create invoices, calculate totals, analyze trends, and suggest payment terms."
      suggestions={<AISuggestions suggestions={invoiceSuggestions} onSuggestionClick={handleSuggestionClick} />}
      currentUserName="You"
    />
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
