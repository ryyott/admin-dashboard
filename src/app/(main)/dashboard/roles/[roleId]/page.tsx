"use client";

import { useState, useMemo } from "react";

import { useParams, useRouter } from "next/navigation";

import { format } from "date-fns";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { ArrowLeft, Edit, Users, Shield, Calendar, MoreVertical } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUsersByRoleId } from "@/lib/user-role-mapping";
import { cn } from "@/lib/utils";
import { useRolesStore } from "@/stores/roles-store";

import { RoleDialog } from "../components/role-dialog";
import { RoleDropdown } from "../components/role-dropdown";
import { UsersByRoleDialog } from "../components/users-by-role-dialog";

export default function RoleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showUsersDialog, setShowUsersDialog] = useState(false);

  const roleId = params.roleId as string;
  const getRoleById = useRolesStore((state) => state.getRoleById);
  const role = getRoleById(roleId);

  // Get users for this role
  const roleUsers = useMemo(() => {
    if (!role) return [];
    return getUsersByRoleId(role.id);
  }, [role]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!role) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Shield className="text-muted-foreground/50 h-16 w-16" />
        <div className="text-center">
          <h2 className="text-2xl font-bold">Role Not Found</h2>
          <p className="text-muted-foreground mt-2">The role you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/page/roles")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Roles
          </Button>
        </div>
      </div>
    );
  }

  const IconComponent = (Icons[role.icon as keyof typeof Icons] || Icons.Shield) as LucideIcon;

  // Group permissions by category
  const permissionsByCategory = role.permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    },
    {} as Record<string, typeof role.permissions>,
  );

  return (
    <>
      <RoleDialog open={showEditDialog} onOpenChange={setShowEditDialog} role={role} />

      <UsersByRoleDialog open={showUsersDialog} onOpenChange={setShowUsersDialog} role={role} />

      <div className="flex flex-col gap-6 p-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/page/roles")} className="w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Roles
        </Button>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg border p-8"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={cn("rounded-2xl p-6", "bg-gradient-to-br", role.color, "shadow-xl")}
              >
                <IconComponent className="h-12 w-12 text-white" />
              </motion.div>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold">{role.name}</h1>
                  <div className="flex gap-2">
                    {role.isSystemRole && <Badge>System Role</Badge>}
                    <Badge variant={role.isActive ? "default" : "secondary"}>
                      {role.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <p className="text-muted-foreground mt-3 max-w-2xl text-lg">{role.description}</p>

                <div className="text-muted-foreground mt-6 flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      <strong className="text-foreground font-medium">{roleUsers.length}</strong> users assigned
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>
                      <strong className="text-foreground font-medium">{role.permissions.length}</strong> permissions
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {format(role.updatedAt, "MMM dd, yyyy")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setShowEditDialog(true)} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Role
              </Button>
              <RoleDropdown role={role} />
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Permissions Detail */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(permissionsByCategory).map(([category, permissions], index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    <h3 className="flex items-center gap-2 font-semibold capitalize">
                      <div className="bg-primary h-2 w-2 rounded-full" />
                      {category}
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {permissions.map((permission, permIndex) => (
                        <div
                          key={`${role.id}-${permission.id}-${permIndex}`}
                          className="bg-muted/50 rounded-lg border p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-medium capitalize">
                                {permission.action} {permission.resource}
                              </div>
                              <p className="text-muted-foreground mt-1 text-xs">{permission.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {permission.action}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Assigned Users */}
            <Card>
              <CardHeader>
                <CardTitle>Assigned Users</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {roleUsers.length > 0 ? (
                  <div className="flex -space-x-2">
                    {roleUsers.slice(0, 8).map((user) => (
                      <Avatar key={user.id} className="border-background h-10 w-10 border-2">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {roleUsers.length > 8 && (
                      <div className="border-background bg-muted flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium">
                        +{roleUsers.length - 8}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No users assigned yet</p>
                )}
                <Button variant="outline" className="w-full" onClick={() => setShowUsersDialog(true)}>
                  <Users className="mr-2 h-4 w-4" />
                  View All Users
                </Button>
              </CardContent>
            </Card>

            {/* Role Info */}
            <Card>
              <CardHeader>
                <CardTitle>Role Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Role ID</div>
                  <div className="mt-1 font-mono text-xs">{role.id}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-muted-foreground">Created</div>
                  <div className="mt-1 font-medium">{format(role.createdAt, "PPP")}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-muted-foreground">Last Updated</div>
                  <div className="mt-1 font-medium">{format(role.updatedAt, "PPP")}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-muted-foreground">Type</div>
                  <div className="mt-1">
                    <Badge variant={role.isSystemRole ? "default" : "secondary"}>
                      {role.isSystemRole ? "System Role" : "Custom Role"}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-muted-foreground">Status</div>
                  <div className="mt-1">
                    <Badge variant={role.isActive ? "default" : "secondary"}>
                      {role.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
