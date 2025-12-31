import { create } from "zustand";

import { mockRoles } from "@/data/roles";
import type { Role, Permission, ViewMode, SortBy, FilterCategory } from "@/types/roles";

interface RolesStore {
  // State
  roles: Role[];
  selectedRoleIds: string[];
  searchQuery: string;
  filterCategory: FilterCategory;
  sortBy: SortBy;
  viewMode: ViewMode;
  isLoading: boolean;

  // Actions - Role Management
  addRole: (role: Omit<Role, "id" | "createdAt" | "updatedAt">) => void;
  updateRole: (id: string, updates: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  duplicateRole: (id: string) => void;
  toggleRoleActive: (id: string) => void;

  // Actions - Selection
  toggleRoleSelection: (id: string) => void;
  selectAllRoles: () => void;
  clearSelection: () => void;

  // Actions - Filters & Search
  setSearchQuery: (query: string) => void;
  setFilterCategory: (category: FilterCategory) => void;
  setSortBy: (sortBy: SortBy) => void;
  setViewMode: (mode: ViewMode) => void;

  // Actions - Permissions
  updateRolePermissions: (roleId: string, permissions: Permission[]) => void;
  togglePermission: (roleId: string, permissionId: string) => void;

  // Actions - User Assignment
  assignRoleToUsers: (roleId: string, userIds: string[]) => void;
  updateUserCount: (roleId: string, count: number) => void;

  // Actions - Bulk Operations
  deleteSelectedRoles: () => void;
  exportRoles: (roleIds: string[]) => void;

  // Utilities
  getRoleById: (id: string) => Role | undefined;
  resetFilters: () => void;
}

// Helper functions to compute derived state
export const getFilteredRoles = (store: RolesStore): Role[] => {
  const { roles, searchQuery, filterCategory, sortBy } = store;

  let filtered = [...roles];

  // Search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (role) =>
        role.name.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query) ||
        role.permissions.some(
          (p) => p.resource.toLowerCase().includes(query) || p.description.toLowerCase().includes(query),
        ),
    );
  }

  // Category filter
  if (filterCategory !== "all") {
    if (filterCategory === "system") {
      filtered = filtered.filter((role) => role.isSystemRole);
    } else if (filterCategory === "custom") {
      filtered = filtered.filter((role) => !role.isSystemRole);
    } else {
      // Filter by permission category
      filtered = filtered.filter((role) => role.permissions.some((p) => p.category === filterCategory));
    }
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "userCount":
        return b.userCount - a.userCount;
      case "createdAt":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "updatedAt":
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      default:
        return 0;
    }
  });

  return filtered;
};

export const getSelectedRoles = (store: RolesStore): Role[] => {
  const { roles, selectedRoleIds } = store;
  return roles.filter((role) => selectedRoleIds.includes(role.id));
};

export const getRoleStats = (store: RolesStore) => {
  const { roles } = store;
  return {
    totalRoles: roles.length,
    systemRoles: roles.filter((r) => r.isSystemRole).length,
    customRoles: roles.filter((r) => !r.isSystemRole).length,
    activeUsers: roles.reduce((sum, role) => sum + role.userCount, 0),
    totalPermissions: new Set(roles.flatMap((r) => r.permissions.map((p) => p.id))).size,
  };
};

export const useRolesStore = create<RolesStore>((set, get) => ({
  // Initial State
  roles: mockRoles,
  selectedRoleIds: [],
  searchQuery: "",
  filterCategory: "all",
  sortBy: "name",
  viewMode: "grid",
  isLoading: false,

  // Role Management Actions
  addRole: (roleData) => {
    set((state) => ({
      roles: [
        ...state.roles,
        {
          ...roleData,
          id: `role-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          userCount: 0,
        },
      ],
    }));
  },

  updateRole: (id, updates) => {
    set((state) => ({
      roles: state.roles.map((role) => (role.id === id ? { ...role, ...updates, updatedAt: new Date() } : role)),
    }));
  },

  deleteRole: (id) => {
    set((state) => {
      const role = state.roles.find((r) => r.id === id);
      if (role?.isSystemRole) {
        console.warn("Cannot delete system role");
        return state;
      }
      return {
        roles: state.roles.filter((role) => role.id !== id),
        selectedRoleIds: state.selectedRoleIds.filter((roleId) => roleId !== id),
      };
    });
  },

  duplicateRole: (id) => {
    set((state) => {
      const role = state.roles.find((r) => r.id === id);
      if (!role) return state;

      const duplicatedRole: Role = {
        ...role,
        id: `role-${Date.now()}`,
        name: `${role.name} (Copy)`,
        isSystemRole: false,
        userCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        roles: [...state.roles, duplicatedRole],
      };
    });
  },

  toggleRoleActive: (id) => {
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === id ? { ...role, isActive: !role.isActive, updatedAt: new Date() } : role,
      ),
    }));
  },

  // Selection Actions
  toggleRoleSelection: (id) => {
    set((state) => ({
      selectedRoleIds: state.selectedRoleIds.includes(id)
        ? state.selectedRoleIds.filter((roleId) => roleId !== id)
        : [...state.selectedRoleIds, id],
    }));
  },

  selectAllRoles: () => {
    const state = get();
    const filtered = getFilteredRoles(state as any);
    set({ selectedRoleIds: filtered.map((r) => r.id) });
  },

  clearSelection: () => {
    set({ selectedRoleIds: [] });
  },

  // Filter & Search Actions
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setFilterCategory: (category) => {
    set({ filterCategory: category });
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  // Permission Actions
  updateRolePermissions: (roleId, permissions) => {
    set((state) => ({
      roles: state.roles.map((role) => (role.id === roleId ? { ...role, permissions, updatedAt: new Date() } : role)),
    }));
  },

  togglePermission: (roleId, permissionId) => {
    set((state) => ({
      roles: state.roles.map((role) => {
        if (role.id !== roleId) return role;

        const hasPermission = role.permissions.some((p) => p.id === permissionId);

        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter((p) => p.id !== permissionId)
            : [
                ...role.permissions,
                // This would need to find the permission from allPermissions
                // For now, just filter it out
              ].filter((p) => p.id !== permissionId),
          updatedAt: new Date(),
        };
      }),
    }));
  },

  // User Assignment Actions
  assignRoleToUsers: (roleId, userIds) => {
    // This would integrate with the users store
    // For now, just update the count
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === roleId
          ? {
              ...role,
              userCount: role.userCount + userIds.length,
              updatedAt: new Date(),
            }
          : role,
      ),
    }));
  },

  updateUserCount: (roleId, count) => {
    set((state) => ({
      roles: state.roles.map((role) => (role.id === roleId ? { ...role, userCount: count } : role)),
    }));
  },

  // Bulk Operations
  deleteSelectedRoles: () => {
    set((state) => {
      const systemRoleIds = state.roles.filter((r) => r.isSystemRole).map((r) => r.id);

      const roleIdsToDelete = state.selectedRoleIds.filter((id) => !systemRoleIds.includes(id));

      return {
        roles: state.roles.filter((role) => !roleIdsToDelete.includes(role.id)),
        selectedRoleIds: [],
      };
    });
  },

  exportRoles: (roleIds) => {
    const { roles } = get();
    const rolesToExport = roles.filter((r) => roleIds.includes(r.id));

    const dataStr = JSON.stringify(rolesToExport, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `roles-export-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  },

  // Utilities
  getRoleById: (id) => {
    return get().roles.find((role) => role.id === id);
  },

  resetFilters: () => {
    set({
      searchQuery: "",
      filterCategory: "all",
      sortBy: "name",
      selectedRoleIds: [],
    });
  },
}));
