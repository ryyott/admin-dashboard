"use client";

import { useMemo } from "react";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { Users, Mail, MapPin, Calendar, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getUsersByRoleId } from "@/lib/user-role-mapping";
import { cn } from "@/lib/utils";
import { useRolesStore } from "@/stores/roles-store";
import type { Role } from "@/types/roles";

interface UsersByRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
}

export function UsersByRoleDialog({ open, onOpenChange, role }: UsersByRoleDialogProps) {
  const roleUsers = useMemo(() => getUsersByRoleId(role.id), [role.id]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "inactive":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-5xl flex-col overflow-hidden p-0">
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl">Users with {role.name} Role</DialogTitle>
          <DialogDescription className="mt-1.5">
            {roleUsers.length} {roleUsers.length === 1 ? "user has" : "users have"} been assigned this role
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto px-6">
          {roleUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted mb-4 rounded-full p-6">
                <Users className="text-muted-foreground h-12 w-12" />
              </div>
              <h3 className="text-lg font-semibold">No users assigned</h3>
              <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                No users have been assigned the {role.name} role yet.
              </p>
            </div>
          ) : (
            <div className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roleUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-muted-foreground flex items-center gap-1 text-xs">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{user.position || "-"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{user.department || "-"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-muted-foreground flex items-center gap-1 text-sm">
                          {user.location ? (
                            <>
                              <MapPin className="h-3 w-3" />
                              {user.location}
                            </>
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-muted-foreground flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(user.lastActive), "MMM dd, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("capitalize", getStatusColor(user.status))}>
                          {user.status}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="bg-muted/20 border-t px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Showing {roleUsers.length} of {roleUsers.length} users
            </p>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
