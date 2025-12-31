"use client";

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Suggestion {
  icon: LucideIcon;
  text: string;
}

interface AISuggestionsProps {
  suggestions: Suggestion[];
  onSuggestionClick?: (suggestion: string) => void;
}

export function AISuggestions({ suggestions, onSuggestionClick }: AISuggestionsProps) {
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
