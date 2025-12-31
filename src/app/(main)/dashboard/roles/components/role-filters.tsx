"use client";

import { useState } from "react";

import { Search, Filter, Grid3x3, Table2, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { permissionCategories } from "@/data/roles";
import { cn } from "@/lib/utils";
import { useRolesStore } from "@/stores/roles-store";
import type { FilterCategory, SortBy, ViewMode } from "@/types/roles";

import { RoleDialog } from "./role-dialog";

export function RoleFilters() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const searchQuery = useRolesStore((state) => state.searchQuery);
  const filterCategory = useRolesStore((state) => state.filterCategory);
  const sortBy = useRolesStore((state) => state.sortBy);
  const viewMode = useRolesStore((state) => state.viewMode);

  const setSearchQuery = useRolesStore((state) => state.setSearchQuery);
  const setFilterCategory = useRolesStore((state) => state.setFilterCategory);
  const setSortBy = useRolesStore((state) => state.setSortBy);
  const setViewMode = useRolesStore((state) => state.setViewMode);
  const resetFilters = useRolesStore((state) => state.resetFilters);

  const hasActiveFilters = searchQuery || filterCategory !== "all";

  return (
    <>
      <RoleDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} role={null} />

      <div className="space-y-4">
        {/* Search and Primary Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Bar */}
          <div className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search roles, permissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 px-3"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 px-3"
              >
                <Table2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Create Role Button */}
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Role
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
                {filterCategory !== "all" && (
                  <Badge variant="secondary" className="ml-1 px-1">
                    1
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filterCategory === "all"}
                onCheckedChange={() => setFilterCategory("all")}
              >
                All Roles
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterCategory === "system"}
                onCheckedChange={() => setFilterCategory("system")}
              >
                System Roles
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterCategory === "custom"}
                onCheckedChange={() => setFilterCategory("custom")}
              >
                Custom Roles
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Permission Categories</DropdownMenuLabel>
              {permissionCategories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.id}
                  checked={filterCategory === category.id}
                  onCheckedChange={() => setFilterCategory(category.id as FilterCategory)}
                >
                  {category.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Select */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="userCount">Most Users</SelectItem>
              <SelectItem value="createdAt">Recently Created</SelectItem>
              <SelectItem value="updatedAt">Recently Updated</SelectItem>
            </SelectContent>
          </Select>

          {/* Active Filters */}
          {hasActiveFilters && (
            <>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery("")} className="hover:text-destructive ml-1">
                    ×
                  </button>
                </Badge>
              )}

              {filterCategory !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {filterCategory === "system"
                    ? "System Roles"
                    : filterCategory === "custom"
                      ? "Custom Roles"
                      : permissionCategories.find((c) => c.id === filterCategory)?.name}
                  <button onClick={() => setFilterCategory("all")} className="hover:text-destructive ml-1">
                    ×
                  </button>
                </Badge>
              )}

              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
                Clear all
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
