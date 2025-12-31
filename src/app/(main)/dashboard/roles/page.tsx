"use client";

import { useMemo } from "react";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useRolesStore, getFilteredRoles } from "@/stores/roles-store";

import { RoleCard } from "./components/role-card";
import { RoleFilters } from "./components/role-filters";
import { RoleStats } from "./components/role-stats";
import { RolesTable } from "./components/roles-table";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export default function RolesPage() {
  const viewMode = useRolesStore((state) => state.viewMode);
  const selectedRoleIds = useRolesStore((state) => state.selectedRoleIds);

  // Get all the state needed for filtering
  const roles = useRolesStore((state) => state.roles);
  const searchQuery = useRolesStore((state) => state.searchQuery);
  const filterCategory = useRolesStore((state) => state.filterCategory);
  const sortBy = useRolesStore((state) => state.sortBy);

  // Compute filtered roles with memoization
  const filteredRoles = useMemo(
    () => getFilteredRoles({ roles, searchQuery, filterCategory, sortBy } as any),
    [roles, searchQuery, filterCategory, sortBy],
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="from-primary/20 to-primary/10 rounded-lg bg-gradient-to-br p-3">
            <Shield className="text-primary h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
            <p className="text-muted-foreground">Manage user roles and permission settings across your organization</p>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <RoleStats />

      {/* Filters and Search */}
      <RoleFilters />

      {/* Selection Info */}
      {selectedRoleIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex items-center gap-2">
            <Badge variant="default">{selectedRoleIds.length}</Badge>
            <span className="text-sm font-medium">
              {selectedRoleIds.length === 1 ? "1 role selected" : `${selectedRoleIds.length} roles selected`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-primary text-sm hover:underline">Assign to users</button>
            <span className="text-muted-foreground">•</span>
            <button className="text-primary text-sm hover:underline">Export selected</button>
            <span className="text-muted-foreground">•</span>
            <button className="text-destructive text-sm hover:underline">Delete selected</button>
          </div>
        </motion.div>
      )}

      {/* Roles Content - Grid or Table */}
      {viewMode === "grid" ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredRoles.map((role, index) => (
            <RoleCard key={role.id} role={role} index={index} />
          ))}
        </motion.div>
      ) : (
        <RolesTable roles={filteredRoles} />
      )}

      {/* Empty State */}
      {filteredRoles.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center"
        >
          <Shield className="text-muted-foreground/50 h-12 w-12" />
          <h3 className="mt-4 text-lg font-semibold">No roles found</h3>
          <p className="text-muted-foreground mt-2 text-sm">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}
    </div>
  );
}
