"use client";

import { useMemo } from "react";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getUsersByRoleId } from "@/lib/user-role-mapping";
import { cn } from "@/lib/utils";
import { useRolesStore } from "@/stores/roles-store";
import type { Role } from "@/types/roles";

import { RoleDropdown } from "./role-dropdown";

interface RoleCardProps {
  role: Role;
  index: number;
}

export function RoleCard({ role, index }: RoleCardProps) {
  const router = useRouter();
  const selectedRoleIds = useRolesStore((state) => state.selectedRoleIds);
  const toggleRoleSelection = useRolesStore((state) => state.toggleRoleSelection);

  const isSelected = selectedRoleIds.includes(role.id);

  // Get real users for this role
  const roleUsers = useMemo(() => getUsersByRoleId(role.id), [role.id]);

  // Dynamically get the icon component
  const IconComponent = (Icons[role.icon as keyof typeof Icons] || Icons.Circle) as LucideIcon;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("[role='checkbox']") || target.closest("[role='menuitem']")) {
      return;
    }
    router.push(`/dashboard/roles/${role.id}`);
  };

  const handleCheckboxChange = (checked: boolean) => {
    toggleRoleSelection(role.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "group bg-card relative cursor-pointer overflow-hidden rounded-lg border p-6 transition-all",
        "hover:shadow-primary/10 hover:shadow-xl",
        isSelected && "ring-primary ring-2",
      )}
      onClick={handleCardClick}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-4 left-4 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleCheckboxChange}
          className="data-[state=checked]:bg-primary border-2"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Dropdown Menu */}
      <div className="absolute top-4 right-4 z-10">
        <RoleDropdown role={role} />
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 pt-8">
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={cn("rounded-lg p-3", "bg-gradient-to-br", role.color, "shadow-lg")}
        >
          <IconComponent className="h-6 w-6 text-white" />
        </motion.div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="group-hover:text-primary text-lg font-semibold transition-colors">{role.name}</h3>
              {role.isSystemRole && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  System Role
                </Badge>
              )}
            </div>
          </div>
          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{role.description}</p>
        </div>
      </div>

      {/* Permission Badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        {role.permissions.slice(0, 3).map((perm) => (
          <motion.div
            key={perm.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 + 0.2 }}
          >
            <Badge variant="outline" className="text-xs">
              {perm.action} {perm.resource}
            </Badge>
          </motion.div>
        ))}
        {role.permissions.length > 3 && (
          <Badge variant="outline" className="bg-muted text-xs">
            +{role.permissions.length - 3} more
          </Badge>
        )}
      </div>

      {/* Footer - User Count */}
      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          {/* Real User Avatars */}
          <div className="flex -space-x-2">
            {roleUsers.slice(0, 4).map((user) => (
              <Avatar key={user.id} className="border-background h-7 w-7 border-2">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="from-primary/20 to-primary/10 bg-gradient-to-br text-xs">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {roleUsers.length > 4 && (
              <div className="border-background bg-muted flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-medium">
                +{roleUsers.length - 4}
              </div>
            )}
          </div>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Icons.Users className="h-4 w-4" />
          <span className="font-medium">{roleUsers.length}</span>
        </div>
      </div>

      {/* Hover Gradient Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className={cn(
          "pointer-events-none absolute inset-0 rounded-lg",
          "from-primary/5 bg-gradient-to-t to-transparent",
        )}
      />

      {/* Color Accent Border */}
      <div className={cn("absolute top-0 left-0 h-full w-1 rounded-l-lg", "bg-gradient-to-b", role.color)} />
    </motion.div>
  );
}
