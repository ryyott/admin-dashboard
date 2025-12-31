"use client";

import { useState, useEffect } from "react";

import { X, Bell, BellOff, Pin, Trash2, UserPlus, Archive, Shield, Palette, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { Conversation } from "@/types/chat";

interface ChatSettingsSheetProps {
  open: boolean;
  conversation: Conversation;
  onClose: () => void;
}

export function ChatSettingsSheet({ open, conversation, onClose }: ChatSettingsSheetProps) {
  const [settings, setSettings] = useState({
    notifications: !conversation.isMuted,
    pinned: conversation.isPinned || false,
    showMedia: true,
    showLinks: true,
  });

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="hidden lg:block">
      {/* Backdrop */}
      <div className="animate-in fade-in absolute inset-0 z-40 bg-black/50 duration-300" onClick={onClose} />

      {/* Sheet */}
      <div className="bg-card border-border animate-in slide-in-from-right absolute top-0 right-0 bottom-0 z-50 flex w-80 flex-col border-l shadow-xl duration-300">
        {/* Header */}
        <div className="border-border flex h-16 shrink-0 items-center justify-between border-b px-4">
          <h2 className="text-sm font-semibold">Chat Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-lg">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable content */}
        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-6 p-4 pb-6">
            {/* Conversation Info */}
            <div className="space-y-3">
              <div className="border-border bg-background rounded-lg border p-4">
                <h3 className="mb-1 text-sm font-medium">{conversation.name}</h3>
                <p className="text-muted-foreground text-xs">
                  {conversation.type === "group" ? `${conversation.participants.length} members` : "Direct message"}
                </p>
              </div>
            </div>

            <Separator />

            {/* Quick Actions */}
            <div className="space-y-3">
              <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                <span>Quick Actions</span>
              </div>

              <div className="space-y-2">
                <div className="border-border bg-background flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md">
                      <Bell className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div>
                      <Label htmlFor="notifications" className="cursor-pointer text-sm font-medium">
                        Notifications
                      </Label>
                      <p className="text-muted-foreground text-xs">Receive message alerts</p>
                    </div>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, notifications: checked }))}
                  />
                </div>

                <div className="border-border bg-background flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md">
                      <Pin className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div>
                      <Label htmlFor="pinned" className="cursor-pointer text-sm font-medium">
                        Pin Conversation
                      </Label>
                      <p className="text-muted-foreground text-xs">Keep at top of list</p>
                    </div>
                  </div>
                  <Switch
                    id="pinned"
                    checked={settings.pinned}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, pinned: checked }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Privacy & Media */}
            <div className="space-y-3">
              <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                <span>Privacy & Media</span>
              </div>

              <div className="space-y-2">
                <div className="border-border bg-background flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md">
                      <ImageIcon className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div>
                      <Label htmlFor="showMedia" className="cursor-pointer text-sm font-medium">
                        Show Media
                      </Label>
                      <p className="text-muted-foreground text-xs">Auto-display images</p>
                    </div>
                  </div>
                  <Switch
                    id="showMedia"
                    checked={settings.showMedia}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showMedia: checked }))}
                  />
                </div>

                <Button variant="outline" className="w-full justify-start gap-2">
                  <Shield className="h-4 w-4" />
                  Privacy Settings
                </Button>

                <Button variant="outline" className="w-full justify-start gap-2">
                  <Palette className="h-4 w-4" />
                  Customize Theme
                </Button>
              </div>
            </div>

            <Separator />

            {/* Manage Conversation */}
            <div className="space-y-3">
              <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                <span>Manage</span>
              </div>

              <div className="space-y-2">
                {conversation.type === "group" && (
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Members
                  </Button>
                )}

                <Button variant="outline" className="w-full justify-start gap-2">
                  <Archive className="h-4 w-4" />
                  Archive Conversation
                </Button>

                <Button variant="destructive" className="w-full justify-start gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Conversation
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
