"use client";

import { useState } from "react";

import { Sparkles, Wand2, MessageSquare, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AIComposeAssistantProps {
  onGenerateDraft?: (content: string) => void;
  onRewrite?: (content: string) => void;
  onChangeTone?: (tone: string) => void;
}

const toneOptions = [
  { label: "Professional", value: "professional", emoji: "👔" },
  { label: "Friendly", value: "friendly", emoji: "😊" },
  { label: "Concise", value: "concise", emoji: "⚡" },
  { label: "Detailed", value: "detailed", emoji: "📝" },
];

const quickActions = [
  { label: "Generate Draft", icon: Sparkles, action: "draft" },
  { label: "Rewrite", icon: RefreshCw, action: "rewrite" },
  { label: "Change Tone", icon: MessageSquare, action: "tone" },
  { label: "Improve", icon: Wand2, action: "improve" },
];

export function AIComposeAssistant({ onGenerateDraft, onRewrite, onChangeTone }: AIComposeAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAction = async (action: string) => {
    setIsGenerating(true);

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    switch (action) {
      case "draft":
        onGenerateDraft?.(
          "Thank you for your email. I appreciate you reaching out.\n\nI've reviewed your message and wanted to respond promptly. Based on what you've shared, I believe we can move forward with the following next steps.\n\nPlease let me know if you have any questions or if there's anything else I can help clarify.\n\nBest regards",
        );
        break;
      case "rewrite":
        onRewrite?.(
          "I appreciate your email and the time you took to reach out.\n\nAfter careful consideration of your points, I'd like to propose we discuss this further. I believe we can find a solution that works for everyone involved.\n\nLooking forward to your thoughts.\n\nBest",
        );
        break;
      case "improve":
        onRewrite?.(
          "Thank you for your thoughtful email.\n\nI've given this matter careful consideration and would like to schedule a brief call to discuss the details further. I believe a conversation would be the most effective way to address your questions and ensure we're aligned.\n\nWould you be available for a 15-minute call this week?\n\nBest regards",
        );
        break;
    }

    setIsGenerating(false);
    setIsOpen(false);
  };

  const handleToneChange = async (tone: string) => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onChangeTone?.(tone);
    setIsGenerating(false);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2 border-2 border-dashed border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 hover:border-purple-400 hover:from-purple-100 hover:to-pink-100 dark:border-purple-700 dark:from-purple-950/50 dark:to-pink-950/50 dark:text-purple-300 dark:hover:border-purple-600",
            isGenerating && "animate-pulse",
          )}
        >
          <Sparkles className="h-4 w-4" />
          {isGenerating ? "Generating..." : "AI Assistant"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-purple-600" />
              AI Writing Assistant
            </h4>
            <p className="text-muted-foreground text-xs">Let AI help you compose the perfect email</p>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    className="h-auto flex-col gap-1 py-3"
                    onClick={() => handleAction(action.action)}
                    disabled={isGenerating}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium">Change Tone</p>
            <div className="grid grid-cols-2 gap-2">
              {toneOptions.map((tone) => (
                <Button
                  key={tone.value}
                  variant="outline"
                  size="sm"
                  className="justify-start gap-2 text-xs"
                  onClick={() => handleToneChange(tone.value)}
                  disabled={isGenerating}
                >
                  <span>{tone.emoji}</span>
                  <span>{tone.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
