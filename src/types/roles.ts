export type PermissionCategory = "users" | "projects" | "documents" | "settings" | "analytics" | "reports" | "billing";

export type PermissionAction = "view" | "create" | "edit" | "delete" | "export" | "import" | "share" | "admin";

export interface Permission {
  id: string;
  category: PermissionCategory;
  action: PermissionAction;
  resource: string;
  description: string;
  isEnabled: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  color: string; // Tailwind color class or hex
  icon: string; // Lucide icon name
  permissions: Permission[];
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
  isSystemRole: boolean; // Cannot be deleted
  isActive: boolean;
}

export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  permissions: Omit<Permission, "id">[];
  icon: string;
  color: string;
}

export type ViewMode = "grid" | "table";

export type SortBy = "name" | "userCount" | "createdAt" | "updatedAt";

export type FilterCategory = "all" | "system" | "custom" | PermissionCategory;
