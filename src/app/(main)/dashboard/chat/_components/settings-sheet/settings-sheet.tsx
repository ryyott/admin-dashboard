"use client";

import { useState, useEffect } from "react";

import {
  User,
  Bell,
  Video,
  LogOut,
  X,
  ChevronRight,
  Volume2,
  Mic,
  Camera,
  BellRing,
  MessageSquare,
  Shield,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useChatStore } from "@/stores/chat-store";

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsSheet({ open, onClose }: SettingsSheetProps) {
  const { users, currentUserId } = useChatStore();
  const currentUser = users[currentUserId];

  // Local state for settings
  const [notifications, setNotifications] = useState({
    messages: true,
    mentions: true,
    sounds: true,
  });

  const [voiceVideo, setVoiceVideo] = useState({
    microphone: true,
    camera: true,
    speaker: true,
  });

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logging out...");
  };

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
          <h2 className="text-sm font-semibold">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-lg">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable content */}
        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-6 p-4 pb-6">
            {/* Account Section */}
            <div className="space-y-3">
              <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                <User className="h-3.5 w-3.5" />
                <span>Account</span>
              </div>

              <div className="border-border bg-background flex items-center gap-3 rounded-lg border p-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                  <AvatarFallback>{currentUser?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{currentUser?.name || "User"}</p>
                  <p className="text-muted-foreground truncate text-xs">{currentUser?.status || "Online"}</p>
                </div>
                <ChevronRight className="text-muted-foreground h-4 w-4" />
              </div>

              <Button variant="outline" className="w-full justify-start gap-2">
                <Shield className="h-4 w-4" />
                Privacy & Security
              </Button>
            </div>

            <Separator />

            {/* Voice & Video Section */}
            <div className="space-y-3">
              <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                <Video className="h-3.5 w-3.5" />
                <span>Voice & Video</span>
              </div>

              <div className="space-y-3">
                <div className="border-border bg-background flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md">
                      <Mic className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div>
                      <Label htmlFor="microphone" className="cursor-pointer text-sm font-medium">
                        Microphone
                      </Label>
                      <p className="text-muted-foreground text-xs">Enable audio input</p>
                    </div>
                  </div>
                  <Switch
                    id="microphone"
                    checked={voiceVideo.microphone}
                    onCheckedChange={(checked) => setVoiceVideo((prev) => ({ ...prev, microphone: checked }))}
                  />
                </div>

                <div className="border-border bg-background flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md">
                      <Camera className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div>
                      <Label htmlFor="camera" className="cursor-pointer text-sm font-medium">
                        Camera
                      </Label>
                      <p className="text-muted-foreground text-xs">Enable video input</p>
                    </div>
                  </div>
                  <Switch
                    id="camera"
                    checked={voiceVideo.camera}
                    onCheckedChange={(checked) => setVoiceVideo((prev) => ({ ...prev, camera: checked }))}
                  />
                </div>

                <div className="border-border bg-background flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md">
                      <Volume2 className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div>
                      <Label htmlFor="speaker" className="cursor-pointer text-sm font-medium">
                        Speaker
                      </Label>
                      <p className="text-muted-foreground text-xs">Enable audio output</p>
                    </div>
                  </div>
                  <Switch
                    id="speaker"
                    checked={voiceVideo.speaker}
                    onCheckedChange={(checked) => setVoiceVideo((prev) => ({ ...prev, speaker: checked }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Notifications Section */}
            <div className="space-y-3">
              <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                <Bell className="h-3.5 w-3.5" />
                <span>Notifications</span>
              </div>

              <div className="space-y-3">
                <div className="border-border bg-background flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md">
                      <MessageSquare className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div>
                      <Label htmlFor="messages" className="cursor-pointer text-sm font-medium">
                        Messages
                      </Label>
                      <p className="text-muted-foreground text-xs">New message alerts</p>
                    </div>
                  </div>
                  <Switch
                    id="messages"
                    checked={notifications.messages}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, messages: checked }))}
                  />
                </div>

                <div className="border-border bg-background flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md">
                      <BellRing className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div>
                      <Label htmlFor="mentions" className="cursor-pointer text-sm font-medium">
                        Mentions
                      </Label>
                      <p className="text-muted-foreground text-xs">When you are mentioned</p>
                    </div>
                  </div>
                  <Switch
                    id="mentions"
                    checked={notifications.mentions}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, mentions: checked }))}
                  />
                </div>

                <div className="border-border bg-background flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md">
                      <Volume2 className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div>
                      <Label htmlFor="sounds" className="cursor-pointer text-sm font-medium">
                        Sounds
                      </Label>
                      <p className="text-muted-foreground text-xs">Notification sounds</p>
                    </div>
                  </div>
                  <Switch
                    id="sounds"
                    checked={notifications.sounds}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, sounds: checked }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Logout Section */}
            <div className="space-y-3">
              <Button variant="destructive" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
