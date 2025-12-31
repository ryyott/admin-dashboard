"use client";

import { useState } from "react";

import { Smile, Paperclip, Send, Mic, Image as ImageIcon, FileText, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

interface InputBarProps {
  onSendMessage: (content: string) => void;
  placeholder?: string;
}

const emojiCategories = {
  "Frequently Used": ["😀", "😂", "❤️", "👍", "🎉", "🔥", "✨", "💯"],
  Smileys: ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊"],
  Gestures: ["👍", "👎", "👏", "🙌", "👋", "🤝", "💪", "🙏"],
  Hearts: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍"],
};

export function InputBar({ onSendMessage, placeholder = "Type something..." }: InputBarProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-card px-6 py-4">
      <div className="flex items-end gap-2">
        {/* Attachment Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-xl">
              <Plus className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem>
              <ImageIcon className="mr-2 h-4 w-4" />
              Photo or Video
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              Document
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mic className="mr-2 h-4 w-4" />
              Audio
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Message Input */}
        <div className="relative flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="max-h-32 min-h-[44px] resize-none rounded-xl pr-24 text-sm leading-relaxed"
            rows={1}
          />

          {/* Inline Actions */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3" align="end">
                <div className="space-y-3">
                  {Object.entries(emojiCategories).map(([category, emojis]) => (
                    <div key={category}>
                      <h4 className="text-muted-foreground mb-2 text-xs font-semibold">{category}</h4>
                      <div className="grid grid-cols-8 gap-1">
                        {emojis.map((emoji) => (
                          <Button
                            key={emoji}
                            variant="ghost"
                            className="hover:bg-accent h-8 w-8 p-0 text-lg"
                            onClick={() => setMessage((prev) => prev + emoji)}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Send Button */}
        <Button onClick={handleSend} disabled={!message.trim()} size="icon" className="h-10 w-10 shrink-0 rounded-xl">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
