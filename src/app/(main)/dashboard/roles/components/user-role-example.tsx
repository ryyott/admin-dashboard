"use client";

/**
 * Example Component: How to Assign Roles to Users
 *
 * This demonstrates the complete flow of assigning roles to users.
 * You can use this pattern in your Users page.
 */

import { useState } from "react";

import { Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { users } from "@/data/users";
import { getRoleIdsForUser, updateUserRoles } from "@/lib/user-role-mapping";
import { useRolesStore } from "@/stores/roles-store";

import { AssignRolesDialog } from "./assign-roles-dialog";

export function UserRoleExample() {
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [userRoles, setUserRoles] = useState<Record<string, string[]>>({});

  const roles = useRolesStore((state) => state.roles);

  // Get current role IDs for a user
  const getCurrentRoleIds = (userId: string): string[] => {
    return userRoles[userId] || getRoleIdsForUser(userId);
  };

  // Handle role update
  const handleRolesUpdate = (userId: string, roleIds: string[]) => {
    // Update the mapping
    updateUserRoles(userId, roleIds);

    // Update local state to trigger re-render
    setUserRoles((prev) => ({
      ...prev,
      [userId]: roleIds,
    }));
  };

  // Open assign dialog for a user
  const openAssignDialog = (user: (typeof users)[0]) => {
    setSelectedUser(user);
    setShowAssignDialog(true);
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Role Assignment Example</h2>
      </div>

      <div className="rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-4 text-left font-medium">User</th>
              <th className="p-4 text-left font-medium">Assigned Roles</th>
              <th className="p-4 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const currentRoleIds = getCurrentRoleIds(user.id);
              const userRoleList = roles.filter((r) => currentRoleIds.includes(r.id));

              return (
                <tr key={user.id} className="border-t">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-muted-foreground text-sm">{user.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    {userRoleList.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userRoleList.map((role) => (
                          <Badge key={role.id} variant="secondary">
                            {role.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No roles assigned</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Button variant="outline" size="sm" onClick={() => openAssignDialog(user)}>
                      <Shield className="mr-2 h-4 w-4" />
                      Manage Roles
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <AssignRolesDialog
          open={showAssignDialog}
          onOpenChange={setShowAssignDialog}
          user={selectedUser}
          currentRoleIds={getCurrentRoleIds(selectedUser.id)}
          onRolesUpdate={handleRolesUpdate}
        />
      )}
    </div>
  );
}
