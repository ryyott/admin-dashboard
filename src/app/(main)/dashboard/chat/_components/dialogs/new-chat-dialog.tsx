"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Search, Check, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { User } from "@/types/chat";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: Record<string, User>;
  currentUserId: string;
}

export function NewChatDialog({ open, onOpenChange, users, currentUserId }: NewChatDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatType, setChatType] = useState<"direct" | "group">("direct");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const router = useRouter();

  // Filter out current user and search
  const availableUsers = Object.values(users)
    .filter((user) => user.id !== currentUserId)
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const handleSelectUser = (userId: string) => {
    if (chatType === "direct") {
      // Direct chat - immediately create/navigate
      onOpenChange(false);
      setSearchQuery("");
      setSelectedUsers([]);

      // TODO: Implement actual conversation creation
      console.log("Create direct conversation with user:", userId);
    } else {
      // Group chat - toggle selection
      setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
    }
  };

  const handleCreateGroup = () => {
    if (selectedUsers.length === 0) return;

    onOpenChange(false);
    setSearchQuery("");
    setSelectedUsers([]);
    setGroupName("");

    // TODO: Implement actual group conversation creation
    console.log("Create group conversation:", {
      name: groupName || "Untitled Group",
      members: selectedUsers,
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setSearchQuery("");
    setSelectedUsers([]);
    setGroupName("");
    setChatType("direct");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
          <DialogDescription>
            {chatType === "direct"
              ? "Select a user to start a direct conversation"
              : "Select users to create a group chat"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={chatType} onValueChange={(v) => setChatType(v as "direct" | "group")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direct">Direct</TabsTrigger>
            <TabsTrigger value="group">Group</TabsTrigger>
          </TabsList>

          <TabsContent value="direct" className="mt-4 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>

            {/* Users List */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-1">
                {availableUsers.length === 0 ? (
                  <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
                    No users found
                  </div>
                ) : (
                  availableUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user.id)}
                      className="hover:bg-accent flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">{user.name}</p>
                          {user.status === "online" && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                              Online
                            </Badge>
                          )}
                        </div>
                        {user.role && <p className="text-muted-foreground truncate text-xs">{user.role}</p>}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="group" className="mt-4 space-y-4">
            {/* Group Name Input */}
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name (Optional)</Label>
              <Input
                id="group-name"
                placeholder="Enter group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Selected Users Count */}
            {selectedUsers.length > 0 && (
              <div className="bg-primary/10 flex items-center gap-2 rounded-lg px-3 py-2">
                <Users className="text-primary h-4 w-4" />
                <span className="text-sm font-medium">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""} selected
                </span>
              </div>
            )}

            {/* Users List with Multi-Select */}
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-1">
                {availableUsers.length === 0 ? (
                  <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
                    No users found
                  </div>
                ) : (
                  availableUsers.map((user) => {
                    const isSelected = selectedUsers.includes(user.id);
                    return (
                      <button
                        key={user.id}
                        onClick={() => handleSelectUser(user.id)}
                        className={cn(
                          "hover:bg-accent flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors",
                          isSelected && "bg-accent",
                        )}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          {isSelected && (
                            <div className="bg-primary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full">
                              <Check className="text-primary-foreground h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium">{user.name}</p>
                            {user.status === "online" && (
                              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                Online
                              </Badge>
                            )}
                          </div>
                          {user.role && <p className="text-muted-foreground truncate text-xs">{user.role}</p>}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            {/* Create Group Button */}
            <Button className="w-full" onClick={handleCreateGroup} disabled={selectedUsers.length === 0}>
              Create Group ({selectedUsers.length})
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
