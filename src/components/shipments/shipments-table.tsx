"use client";

import { useState } from "react";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Copy, Trash2, MapPin, Clock, AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Shipment, ShipmentStatus } from "@/types/shipment";

import { CarrierBadge } from "./carrier-badge";
import { ShipmentStatusBadge } from "./shipment-status-badge";
import { DetailedShipmentTimeline } from "./shipment-timeline";
import { ShipmentTimeline } from "./shipment-timeline";

interface ShipmentsTableProps {
  shipments: Shipment[];
  onView?: (shipment: Shipment) => void;
  onEdit?: (shipment: Shipment) => void;
  onDuplicate?: (shipment: Shipment) => void;
  onDelete?: (shipment: Shipment) => void;
}

export function ShipmentsTable({ shipments, onView, onEdit, onDuplicate, onDelete }: ShipmentsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const columns: ColumnDef<Shipment>[] = [
    {
      accessorKey: "shipmentId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent"
          >
            Shipment ID
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("shipmentId")}</div>,
    },
    {
      accessorKey: "status",
      header: "Shipment Status",
      cell: ({ row }) => {
        const shipment = row.original;
        return (
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex cursor-pointer items-center gap-2">
                <ShipmentStatusBadge status={row.getValue("status")} />
                {shipment.isDelayed && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          variant="outline"
                          className="border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800/50 dark:bg-orange-950/50 dark:text-orange-400"
                        >
                          <Clock className="mr-1 size-3" />
                          Delay
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This shipment is experiencing delays</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Shipment Progress</h4>
                <ShipmentTimeline events={shipment.events} />
              </div>
            </PopoverContent>
          </Popover>
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return row.getValue(id) === value;
      },
    },
    {
      id: "timeline",
      header: "Shipment Event",
      cell: ({ row }) => {
        const shipment = row.original;
        const formatDate = (date: Date) => {
          return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          });
        };

        return (
          <HoverCard openDelay={200}>
            <HoverCardTrigger asChild>
              <div className="cursor-help">
                <ShipmentTimeline events={shipment.events} className="ml-2" />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-96" side="right" align="start">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">{shipment.shipmentId}</h4>
                    <ShipmentStatusBadge status={shipment.status} />
                  </div>
                  <p className="text-muted-foreground text-xs">{shipment.orderId}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Route</span>
                    <span className="font-medium">
                      {shipment.origin} → {shipment.destination}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Carrier</span>
                    <CarrierBadge carrier={shipment.carrier} className="scale-90" />
                  </div>
                  {shipment.trackingNumber && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Tracking</span>
                      <span className="font-mono text-xs font-medium">{shipment.trackingNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Expected Arrival</span>
                    <span className="font-medium">{formatDate(shipment.expectedArrival)}</span>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-3">
                  <h5 className="text-muted-foreground text-xs font-semibold">Progress Timeline</h5>
                  <DetailedShipmentTimeline events={shipment.events} />
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      },
    },
    {
      accessorKey: "expectedArrival",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent"
          >
            Expected Arrival
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="text-sm">{formatDate(row.getValue("expectedArrival"))}</div>;
      },
    },
    {
      accessorKey: "orderId",
      header: "Order",
      cell: ({ row }) => {
        return <div className="text-muted-foreground text-sm">{row.getValue("orderId")}</div>;
      },
    },
    {
      accessorKey: "carrier",
      header: "Carrier",
      cell: ({ row }) => {
        return <CarrierBadge carrier={row.getValue("carrier")} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const shipment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView?.(shipment)}>
                <Eye className="mr-2 size-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(shipment)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate?.(shipment)}>
                <Copy className="mr-2 size-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(shipment)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: shipments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  // Apply status filter
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    if (value === "all") {
      table.getColumn("status")?.setFilterValue(undefined);
    } else {
      table.getColumn("status")?.setFilterValue(value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by shipment ID or order..."
          value={(table.getColumn("shipmentId")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("shipmentId")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Shipment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shipment Status</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="arrived">Arrived</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          Hide
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={(e) => {
                    // Don't trigger if clicking on action buttons
                    const target = e.target as HTMLElement;
                    if (!target.closest('[role="menuitem"]') && !target.closest("button")) {
                      onView?.(row.original);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No shipments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">{table.getFilteredRowModel().rows.length} shipment(s) found</div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
