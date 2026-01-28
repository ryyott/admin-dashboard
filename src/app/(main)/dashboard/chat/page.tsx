"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { mockConversations } from "@/data/mock-chat-data";

export default function ChatRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first conversation
    if (mockConversations.length > 0) {
      router.replace(`/dashboard/chat/${mockConversations[0].id}`);
    }
  }, [router]);

  return (
    <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
      <p className="text-muted-foreground">Loading chat...</p>
    </div>
  );
}
