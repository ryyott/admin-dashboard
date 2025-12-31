"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { Shield, Check, X, Search } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useRolesStore } from "@/stores/roles-store";
import type { User } from "@/types/user";

interface AssignRolesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  currentRoleIds: string[];
  onRolesUpdate: (userId: string, roleIds: string[]) => void;
}

export function AssignRolesDialog({ open, onOpenChange, user, currentRoleIds, onRolesUpdate }: AssignRolesDialogProps) {
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(currentRoleIds);
  const [searchQuery, setSearchQuery] = useState("");

  const roles = useRolesStore((state) => state.roles);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) => (prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]));
  };

  const handleSave = () => {
    onRolesUpdate(user.id, selectedRoleIds);

    const addedRoles = selectedRoleIds.filter((id) => !currentRoleIds.includes(id));
    const removedRoles = currentRoleIds.filter((id) => !selectedRoleIds.includes(id));

    if (addedRoles.length > 0) {
      const roleNames = addedRoles.map((id) => roles.find((r) => r.id === id)?.name).join(", ");
      toast.success(`Added ${roleNames} to ${user.name}`);
    }

    if (removedRoles.length > 0) {
      const roleNames = removedRoles.map((id) => roles.find((r) => r.id === id)?.name).join(", ");
      toast.info(`Removed ${roleNames} from ${user.name}`);
    }

    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedRoleIds(currentRoleIds);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col overflow-hidden p-0">
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl">Assign Roles</DialogTitle>
          <DialogDescription className="mt-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-foreground font-medium">{user.name}</div>
                <div className="text-sm">{user.email}</div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="border-b px-6 py-4">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-2 py-4">
            {filteredRoles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Shield className="text-muted-foreground/50 mb-3 h-12 w-12" />
                <p className="text-muted-foreground text-sm">No roles found</p>
              </div>
            ) : (
              filteredRoles.map((role, index) => {
                const isSelected = selectedRoleIds.includes(role.id);
                const IconComponent = (Icons[role.icon as keyof typeof Icons] || Icons.Shield) as LucideIcon;

                return (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => toggleRole(role.id)}
                    className={cn(
                      "flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all",
                      "hover:bg-muted/50",
                      isSelected && "bg-primary/5 border-primary",
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleRole(role.id)}
                      className="mt-1"
                      onClick={(e) => e.stopPropagation()}
                    />

                    <div className={cn("rounded-lg p-2.5", "bg-gradient-to-br", role.color, "shrink-0")}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold">{role.name}</div>
                          <p className="text-muted-foreground mt-0.5 text-sm">{role.description}</p>
                        </div>
                        {role.isSystemRole && (
                          <Badge variant="secondary" className="shrink-0 text-xs">
                            System
                          </Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                        <span>{role.permissions.length} permissions</span>
                      </div>
                    </div>

                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="shrink-0">
                        <div className="bg-primary rounded-full p-1">
                          <Check className="text-primary-foreground h-3 w-3" />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="bg-muted/20 border-t px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {selectedRoleIds.length} {selectedRoleIds.length === 1 ? "role" : "roles"} selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
