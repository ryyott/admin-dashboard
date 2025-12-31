"use client";

import { useRouter } from "next/navigation";

import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useRolesStore } from "@/stores/roles-store";
import type { Role } from "@/types/roles";

import { RoleDropdown } from "./role-dropdown";

const columns: ColumnDef<Role>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original;
      const IconComponent = (Icons[role.icon as keyof typeof Icons] || Icons.Circle) as LucideIcon;

      return (
        <div className="flex items-center gap-3">
          <div className={cn("rounded-lg p-2", "bg-gradient-to-br", role.color)}>
            <IconComponent className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{role.name}</span>
            <span className="text-muted-foreground line-clamp-1 text-xs">{role.description}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const permissions = row.original.permissions;
      return (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{permissions.length}</Badge>
          <div className="flex flex-wrap gap-1">
            {permissions.slice(0, 2).map((perm) => (
              <Badge key={perm.id} variant="outline" className="text-xs">
                {perm.action}
              </Badge>
            ))}
            {permissions.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{permissions.length - 2}
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "userCount",
    header: "Users",
    cell: ({ row }) => {
      const count = row.original.userCount;
      return (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[...Array(Math.min(count, 3))].map((_, i) => (
              <Avatar key={i} className="border-background h-6 w-6 border-2">
                <AvatarFallback className="text-xs">{String.fromCharCode(65 + i)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-muted-foreground text-sm">{count}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return <span className="text-muted-foreground text-sm">{formatDistanceToNow(date, { addSuffix: true })}</span>;
    },
  },
  {
    accessorKey: "isSystemRole",
    header: "Type",
    cell: ({ row }) => {
      const isSystem = row.original.isSystemRole;
      return <Badge variant={isSystem ? "default" : "secondary"}>{isSystem ? "System" : "Custom"}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <RoleDropdown role={row.original} />,
  },
];

interface RolesTableProps {
  roles: Role[];
}

export function RolesTable({ roles }: RolesTableProps) {
  const router = useRouter();
  const selectedRoleIds = useRolesStore((state) => state.selectedRoleIds);
  const toggleRoleSelection = useRolesStore((state) => state.toggleRoleSelection);

  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    state: {
      rowSelection: selectedRoleIds.reduce(
        (acc, id) => {
          acc[id] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      ),
    },
    onRowSelectionChange: (updaterOrValue) => {
      if (typeof updaterOrValue === "function") {
        const newSelection = updaterOrValue(
          selectedRoleIds.reduce(
            (acc, id) => {
              acc[id] = true;
              return acc;
            },
            {} as Record<string, boolean>,
          ),
        );
        // Update store based on new selection
        Object.keys(newSelection).forEach((id) => {
          if (newSelection[id] && !selectedRoleIds.includes(id)) {
            toggleRoleSelection(id);
          } else if (!newSelection[id] && selectedRoleIds.includes(id)) {
            toggleRoleSelection(id);
          }
        });
      }
    },
  });

  const handleRowClick = (role: Role) => {
    router.push(`/page/roles/${role.id}`);
  };

  return (
    <div className="bg-card rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group hover:bg-muted/50 cursor-pointer border-b transition-colors"
                onClick={() => handleRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </motion.tr>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No roles found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
