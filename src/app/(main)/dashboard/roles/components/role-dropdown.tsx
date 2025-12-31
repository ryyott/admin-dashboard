"use client";

import { useState } from "react";

import { MoreVertical, Edit, Copy, UserPlus, Users, Download, Trash2, Power } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRolesStore } from "@/stores/roles-store";
import type { Role } from "@/types/roles";

import { RoleDialog } from "./role-dialog";

interface RoleDropdownProps {
  role: Role;
}

export function RoleDropdown({ role }: RoleDropdownProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const deleteRole = useRolesStore((state) => state.deleteRole);
  const duplicateRole = useRolesStore((state) => state.duplicateRole);
  const toggleRoleActive = useRolesStore((state) => state.toggleRoleActive);
  const exportRoles = useRolesStore((state) => state.exportRoles);

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleDuplicate = () => {
    duplicateRole(role.id);
    toast.success("Role duplicated successfully", {
      description: `Created a copy of ${role.name}`,
    });
  };

  const handleAssignUsers = () => {
    toast.info("User assignment dialog will open here");
    // TODO: Open user assignment modal
  };

  const handleViewUsers = () => {
    toast.info("Navigate to users page with filter");
    // TODO: Navigate to /dashboard/members with role filter
  };

  const handleExport = () => {
    exportRoles([role.id]);
    toast.success("Role settings exported", {
      description: "Check your downloads folder",
    });
  };

  const handleToggleActive = () => {
    toggleRoleActive(role.id);
    toast.success(role.isActive ? "Role deactivated" : "Role activated", {
      description: role.isActive ? "Users with this role will lose access" : "Users with this role will regain access",
    });
  };

  const handleDelete = () => {
    if (role.isSystemRole) {
      toast.error("Cannot delete system role", {
        description: "System roles are protected and cannot be deleted",
      });
      return;
    }

    if (role.userCount > 0) {
      toast.warning(`This role is assigned to ${role.userCount} users`, {
        description: "Please reassign users before deleting",
      });
      return;
    }

    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteRole(role.id);
    toast.success("Role deleted successfully", {
      description: `${role.name} has been removed`,
    });
    setShowDeleteDialog(false);
  };

  return (
    <>
      <RoleDialog open={showEditDialog} onOpenChange={setShowEditDialog} role={role} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Role
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate Role
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleAssignUsers}>
            <UserPlus className="mr-2 h-4 w-4" />
            Assign to Users
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleViewUsers}>
            <Users className="mr-2 h-4 w-4" />
            View Users ({role.userCount})
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleToggleActive}>
            <Power className="mr-2 h-4 w-4" />
            {role.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Settings
          </DropdownMenuItem>

          {!role.isSystemRole && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Role
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role "{role.name}" and remove it from the
              system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
