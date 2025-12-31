"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { SalesUser } from "./analytics.config";

export const columns: ColumnDef<SalesUser>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
    cell: ({ row }) => {
      const user = row.original;
      const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("");

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-muted-foreground text-xs">{user.email}</span>
          </div>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "sales",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sales" className="justify-center" />,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <Badge variant="secondary" className="rounded-full tabular-nums">
            {row.getValue("sales")}
          </Badge>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Revenue" className="justify-end" />,
    cell: ({ row }) => {
      const revenue = row.getValue("revenue");
      return <div className="text-right font-medium tabular-nums">${revenue.toLocaleString()}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "leads",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Leads" className="justify-center" />,
    cell: ({ row }) => {
      return <div className="text-center tabular-nums">{row.getValue("leads")}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "kpi",
    header: ({ column }) => <DataTableColumnHeader column={column} title="KPI" className="justify-center" />,
    cell: ({ row }) => {
      const kpi = row.getValue("kpi");
      const color =
        kpi >= 0.9
          ? "text-green-600 dark:text-green-500"
          : kpi >= 0.8
            ? "text-blue-600 dark:text-blue-500"
            : "text-orange-600 dark:text-orange-500";

      return <div className={`text-center font-medium tabular-nums ${color}`}>{kpi.toFixed(2)}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "winRate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Win Rate" className="justify-center" />,
    cell: ({ row }) => {
      const winRate = row.getValue("winRate");

      return (
        <div className="flex justify-center">
          <Badge variant="outline" className="rounded-full tabular-nums">
            {winRate}%
          </Badge>
        </div>
      );
    },
    enableSorting: true,
  },
];
