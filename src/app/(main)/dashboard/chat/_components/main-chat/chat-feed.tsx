"use client";

import { useEffect, useRef } from "react";

import { format, isSameDay } from "date-fns";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message, User } from "@/types/chat";

import { AudioMessage } from "./audio-message";
import { MessageBubble } from "./message-bubble";

interface ChatFeedProps {
  messages: Message[];
  users: Record<string, User>;
  currentUserId: string;
  onAddReaction?: (messageId: string, emoji: string) => void;
  onRemoveReaction?: (messageId: string, emoji: string) => void;
}

export function ChatFeed({ messages, users, currentUserId, onAddReaction, onRemoveReaction }: ChatFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    const isNewMessage = messages.length > prevMessagesLengthRef.current;
    const isConversationSwitch = isInitialMountRef.current;

    // Instant scroll for conversation switches, smooth scroll for new messages
    if (isConversationSwitch) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
      isInitialMountRef.current = false;
    } else if (isNewMessage) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  // Reset initial mount flag when component unmounts (conversation switch via key prop)
  useEffect(() => {
    return () => {
      isInitialMountRef.current = true;
    };
  }, []);

  const shouldShowAvatar = (message: Message, prevMessage?: Message) => {
    if (!prevMessage) return true;
    if (prevMessage.senderId !== message.senderId) return true;

    const timeDiff = message.timestamp.getTime() - prevMessage.timestamp.getTime();
    return timeDiff > 5 * 60 * 1000; // 5 minutes
  };

  const shouldShowDateSeparator = (message: Message, prevMessage?: Message) => {
    if (!prevMessage) return true;
    return !isSameDay(prevMessage.timestamp, message.timestamp);
  };

  const formatDateSeparator = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, yesterday)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  return (
    <ScrollArea className="h-full">
      <div ref={scrollRef} className="py-4">
        {messages.map((message, index) => {
          const prevMessage = index > 0 ? messages[index - 1] : undefined;
          const showAvatar = shouldShowAvatar(message, prevMessage);
          const showDateSeparator = shouldShowDateSeparator(message, prevMessage);
          const isGrouped = !showAvatar && prevMessage?.senderId === message.senderId;
          const user = users[message.senderId];
          const isOwn = message.senderId === currentUserId;

          if (!user) return null;

          return (
            <div key={message.id}>
              {showDateSeparator && (
                <div className="my-6 flex items-center justify-center">
                  <div className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">
                    {formatDateSeparator(message.timestamp)}
                  </div>
                </div>
              )}

              {message.type === "audio" ? (
                <AudioMessage message={message} user={user} isOwn={isOwn} />
              ) : (
                <MessageBubble
                  message={message}
                  user={user}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                  isGrouped={isGrouped}
                  currentUserId={currentUserId}
                  onAddReaction={onAddReaction}
                  onRemoveReaction={onRemoveReaction}
                />
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
