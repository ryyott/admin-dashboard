"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { permissionCategories, allPermissions } from "@/data/roles";
import { cn } from "@/lib/utils";
import type { Permission, PermissionAction } from "@/types/roles";

const actions: PermissionAction[] = ["view", "create", "edit", "delete", "export", "import"];

const actionIcons: Record<PermissionAction, LucideIcon> = {
  view: Icons.Eye,
  create: Icons.Plus,
  edit: Icons.Edit,
  delete: Icons.Trash2,
  export: Icons.Download,
  import: Icons.Upload,
  share: Icons.Share2,
  admin: Icons.Shield,
};

interface PermissionMatrixProps {
  selectedPermissions: Permission[];
  onPermissionsChange: (permissions: Permission[]) => void;
}

export function PermissionMatrix({ selectedPermissions, onPermissionsChange }: PermissionMatrixProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    category: string;
    action: PermissionAction;
  } | null>(null);

  const hasPermission = (categoryId: string, action: PermissionAction): boolean => {
    return selectedPermissions.some((p) => p.category === categoryId && p.action === action);
  };

  const togglePermission = (categoryId: string, action: PermissionAction) => {
    const permission = allPermissions.find((p) => p.category === categoryId && p.action === action);

    if (!permission) return;

    const isSelected = hasPermission(categoryId, action);

    if (isSelected) {
      // Remove permission
      onPermissionsChange(selectedPermissions.filter((p) => !(p.category === categoryId && p.action === action)));
    } else {
      // Add permission
      onPermissionsChange([...selectedPermissions, permission]);
    }
  };

  const toggleRow = (categoryId: string) => {
    const categoryPermissions = allPermissions.filter((p) => p.category === categoryId && actions.includes(p.action));

    const allSelected = categoryPermissions.every((p) =>
      selectedPermissions.some((sp) => sp.category === p.category && sp.action === p.action),
    );

    if (allSelected) {
      // Deselect all in row
      onPermissionsChange(selectedPermissions.filter((p) => p.category !== categoryId));
      toast.info(`Removed all ${categoryId} permissions`);
    } else {
      // Select all in row
      const newPermissions = [...selectedPermissions.filter((p) => p.category !== categoryId), ...categoryPermissions];
      onPermissionsChange(newPermissions);
      toast.success(`Added all ${categoryId} permissions`);
    }
  };

  const toggleColumn = (action: PermissionAction) => {
    const columnPermissions = allPermissions.filter((p) => p.action === action);

    const allSelected = columnPermissions.every((p) =>
      selectedPermissions.some((sp) => sp.category === p.category && sp.action === p.action),
    );

    if (allSelected) {
      // Deselect all in column
      onPermissionsChange(selectedPermissions.filter((p) => p.action !== action));
      toast.info(`Removed all ${action} permissions`);
    } else {
      // Select all in column
      const newPermissions = [...selectedPermissions.filter((p) => p.action !== action), ...columnPermissions];
      onPermissionsChange(newPermissions);
      toast.success(`Added all ${action} permissions`);
    }
  };

  const applyPreset = (preset: string) => {
    switch (preset) {
      case "view-only":
        onPermissionsChange(allPermissions.filter((p) => p.action === "view"));
        toast.success("Applied View Only preset");
        break;
      case "editor":
        onPermissionsChange(allPermissions.filter((p) => ["view", "create", "edit", "export"].includes(p.action)));
        toast.success("Applied Editor preset");
        break;
      case "admin":
        onPermissionsChange([...allPermissions]);
        toast.success("Applied Admin preset");
        break;
      case "clear":
        onPermissionsChange([]);
        toast.info("Cleared all permissions");
        break;
    }
  };

  const isRowFullySelected = (categoryId: string) => {
    return actions.every((action) => {
      const permission = allPermissions.find((p) => p.category === categoryId && p.action === action);
      return !permission || hasPermission(categoryId, action);
    });
  };

  const isColumnFullySelected = (action: PermissionAction) => {
    return permissionCategories.every((category) => {
      const permission = allPermissions.find((p) => p.category === category.id && p.action === action);
      return !permission || hasPermission(category.id, action);
    });
  };

  return (
    <div className="flex h-full flex-col space-y-4">
      {/* Preset Templates */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Quick Presets:</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => applyPreset("view-only")}>
              View Only
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset("editor")}>
              Editor
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset("admin")}>
              Admin
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset("clear")}>
              Clear All
            </Button>
          </div>
        </div>
        <Badge variant="secondary" className="whitespace-nowrap">
          {selectedPermissions.length} / {allPermissions.length} selected
        </Badge>
      </div>

      {/* Permission Matrix */}
      <div className="bg-card min-h-0 flex-1 overflow-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted sticky top-0 z-10">
            <tr>
              <th className="bg-muted sticky left-0 z-20 w-[160px] p-2 text-left">
                <span className="text-xs font-medium">Resource</span>
              </th>
              {actions.map((action) => {
                const ActionIcon = actionIcons[action];
                const isFullySelected = isColumnFullySelected(action);

                return (
                  <th
                    key={action}
                    className="bg-muted relative w-[70px] p-2 text-center"
                    onMouseEnter={() => setHoveredCell({ category: "header", action })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto flex-col gap-0.5 p-1.5"
                        onClick={() => toggleColumn(action)}
                      >
                        <ActionIcon className="h-3.5 w-3.5" />
                        <span className="text-[10px] leading-tight capitalize">{action}</span>
                      </Button>
                      <Checkbox
                        checked={isFullySelected}
                        onCheckedChange={() => toggleColumn(action)}
                        className="h-3 w-3"
                      />
                    </div>
                    {hoveredCell?.action === action && (
                      <motion.div
                        layoutId="column-highlight"
                        className="bg-primary/5 absolute inset-0"
                        initial={false}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {permissionCategories.map((category, categoryIndex) => {
              const CategoryIcon = (Icons[category.icon as keyof typeof Icons] || Icons.Circle) as LucideIcon;
              const isRowSelected = isRowFullySelected(category.id);

              return (
                <motion.tr
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: categoryIndex * 0.05 }}
                  className="group border-b last:border-b-0"
                  onMouseEnter={() => setHoveredCell({ category: category.id, action: "view" })}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  <td className="bg-card group-hover:bg-muted sticky left-0 z-10 w-[160px] p-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isRowSelected}
                        onCheckedChange={() => toggleRow(category.id)}
                        className="h-3 w-3 shrink-0"
                      />
                      <CategoryIcon className="text-muted-foreground h-4 w-4 shrink-0" />
                      <div className="min-w-0">
                        <div className="truncate text-xs font-medium">{category.name}</div>
                        <div className="text-muted-foreground truncate text-[10px]">{category.description}</div>
                      </div>
                    </div>
                  </td>
                  {actions.map((action) => {
                    const permission = allPermissions.find((p) => p.category === category.id && p.action === action);

                    if (!permission) {
                      return (
                        <td key={action} className="bg-muted relative w-[70px] p-2 text-center">
                          <span className="text-muted-foreground text-xs">-</span>
                        </td>
                      );
                    }

                    const isChecked = hasPermission(category.id, action);
                    const isHovered = hoveredCell?.category === category.id || hoveredCell?.action === action;

                    return (
                      <td
                        key={action}
                        className={cn(
                          "relative w-[70px] p-2 text-center transition-colors",
                          isHovered && "bg-primary/5",
                        )}
                      >
                        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="inline-flex">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => togglePermission(category.id, action)}
                            className={cn("mx-auto transition-all", isChecked && "bg-primary")}
                          />
                        </motion.div>
                      </td>
                    );
                  })}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Permissions Summary */}
      <div className="bg-muted/20 rounded-lg border p-4">
        <h4 className="mb-2 text-sm font-medium">Selected Permissions</h4>
        <div className="flex flex-wrap gap-2">
          {selectedPermissions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No permissions selected</p>
          ) : (
            selectedPermissions.map((perm) => (
              <Badge key={perm.id} variant="secondary" className="gap-1">
                {perm.action} {perm.resource}
                <button
                  onClick={() => togglePermission(perm.category, perm.action)}
                  className="hover:text-destructive ml-1"
                >
                  ×
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
