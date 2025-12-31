"use client";

import { Lightbulb, TrendingUp, ListChecks, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AISuggestionsProps {
  onSuggestionClick?: (suggestion: string) => void;
}

export function AISuggestions({ onSuggestionClick }: AISuggestionsProps) {
  const suggestions = [
    {
      icon: Lightbulb,
      text: "Help me prioritize tasks",
    },
    {
      icon: ListChecks,
      text: "Suggest task breakdown",
    },
    {
      icon: TrendingUp,
      text: "Analyze project progress",
    },
    {
      icon: Sparkles,
      text: "Generate task ideas",
    },
  ];

  return (
    <div className="grid w-full grid-cols-2 gap-2">
      {suggestions.map((suggestion) => {
        const Icon = suggestion.icon;
        return (
          <Button
            key={suggestion.text}
            variant="outline"
            size="sm"
            className="h-auto flex-col items-start gap-2 px-3 py-3 text-xs"
            onClick={() => onSuggestionClick?.(suggestion.text)}
          >
            <Icon className="h-4 w-4" />
            <span className="text-left whitespace-normal">{suggestion.text}</span>
          </Button>
        );
      })}
    </div>
  );
}
