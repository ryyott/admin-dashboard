import type { Role, Permission, RoleTemplate } from "@/types/roles";

// Helper to create permissions
const createPermission = (
  category: Permission["category"],
  action: Permission["action"],
  resource: string,
  description: string,
): Permission => ({
  id: `${category}-${action}-${resource}`.toLowerCase().replace(/\s+/g, "-"),
  category,
  action,
  resource,
  description,
  isEnabled: true,
});

// Common permission sets
const viewOnlyPermissions: Permission[] = [
  createPermission("users", "view", "Users", "View user profiles and information"),
  createPermission("projects", "view", "Projects", "View project details"),
  createPermission("documents", "view", "Documents", "View documents"),
  createPermission("analytics", "view", "Analytics", "View analytics dashboards"),
  createPermission("reports", "view", "Reports", "View reports"),
];

const editorPermissions: Permission[] = [
  ...viewOnlyPermissions,
  createPermission("users", "edit", "Users", "Edit user information"),
  createPermission("projects", "create", "Projects", "Create new projects"),
  createPermission("projects", "edit", "Projects", "Edit project details"),
  createPermission("documents", "create", "Documents", "Create documents"),
  createPermission("documents", "edit", "Documents", "Edit documents"),
  createPermission("documents", "share", "Documents", "Share documents with others"),
  createPermission("reports", "create", "Reports", "Create custom reports"),
  createPermission("reports", "export", "Reports", "Export reports"),
];

const adminPermissions: Permission[] = [
  ...editorPermissions,
  createPermission("users", "create", "Users", "Create new users"),
  createPermission("users", "delete", "Users", "Delete users"),
  createPermission("users", "admin", "Users", "Full user management"),
  createPermission("projects", "delete", "Projects", "Delete projects"),
  createPermission("projects", "admin", "Projects", "Full project management"),
  createPermission("documents", "delete", "Documents", "Delete documents"),
  createPermission("settings", "view", "Settings", "View system settings"),
  createPermission("settings", "edit", "Settings", "Modify system settings"),
  createPermission("settings", "admin", "Settings", "Full settings access"),
  createPermission("billing", "view", "Billing", "View billing information"),
  createPermission("billing", "edit", "Billing", "Manage billing settings"),
  createPermission("analytics", "export", "Analytics", "Export analytics data"),
];

const dataAnalystPermissions: Permission[] = [
  createPermission("analytics", "view", "Analytics", "View analytics dashboards"),
  createPermission("analytics", "export", "Analytics", "Export analytics data"),
  createPermission("reports", "view", "Reports", "View reports"),
  createPermission("reports", "create", "Reports", "Create custom reports"),
  createPermission("reports", "export", "Reports", "Export reports"),
  createPermission("projects", "view", "Projects", "View project data"),
  createPermission("users", "view", "Users", "View user statistics"),
];

const supportPermissions: Permission[] = [
  createPermission("users", "view", "Users", "View user profiles"),
  createPermission("users", "edit", "Users", "Edit user information"),
  createPermission("projects", "view", "Projects", "View projects"),
  createPermission("documents", "view", "Documents", "View documents"),
  createPermission("documents", "create", "Documents", "Create support documents"),
];

const billingPermissions: Permission[] = [
  createPermission("billing", "view", "Billing", "View billing information"),
  createPermission("billing", "edit", "Billing", "Manage billing settings"),
  createPermission("billing", "export", "Billing", "Export billing data"),
  createPermission("users", "view", "Users", "View user billing info"),
  createPermission("reports", "view", "Reports", "View financial reports"),
  createPermission("reports", "create", "Reports", "Create billing reports"),
];

export const mockRoles: Role[] = [
  {
    id: "role-1",
    name: "Administrator",
    description: "Full system access with all permissions",
    color: "from-red-500 to-orange-500",
    icon: "Shield",
    permissions: adminPermissions,
    userCount: 3,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2025-01-10"),
    isSystemRole: true,
    isActive: true,
  },
  {
    id: "role-2",
    name: "Editor",
    description: "Can create and edit content across the platform",
    color: "from-blue-500 to-cyan-500",
    icon: "Edit",
    permissions: editorPermissions,
    userCount: 12,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2025-01-15"),
    isSystemRole: true,
    isActive: true,
  },
  {
    id: "role-3",
    name: "Viewer",
    description: "Read-only access to view content",
    color: "from-green-500 to-emerald-500",
    icon: "Eye",
    permissions: viewOnlyPermissions,
    userCount: 45,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-12-20"),
    isSystemRole: true,
    isActive: true,
  },
  {
    id: "role-4",
    name: "Data Analyst",
    description: "Access to analytics and reporting tools",
    color: "from-purple-500 to-pink-500",
    icon: "BarChart3",
    permissions: dataAnalystPermissions,
    userCount: 8,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-11-05"),
    isSystemRole: false,
    isActive: true,
  },
  {
    id: "role-5",
    name: "Support Agent",
    description: "Customer support with limited edit permissions",
    color: "from-yellow-500 to-amber-500",
    icon: "Headphones",
    permissions: supportPermissions,
    userCount: 15,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-12-10"),
    isSystemRole: false,
    isActive: true,
  },
  {
    id: "role-6",
    name: "Billing Manager",
    description: "Manage billing and financial operations",
    color: "from-indigo-500 to-violet-500",
    icon: "CreditCard",
    permissions: billingPermissions,
    userCount: 4,
    createdAt: new Date("2024-04-05"),
    updatedAt: new Date("2025-01-05"),
    isSystemRole: false,
    isActive: true,
  },
  {
    id: "role-7",
    name: "Project Manager",
    description: "Full project management capabilities",
    color: "from-teal-500 to-cyan-500",
    icon: "FolderKanban",
    permissions: [
      ...viewOnlyPermissions,
      createPermission("projects", "create", "Projects", "Create projects"),
      createPermission("projects", "edit", "Projects", "Edit projects"),
      createPermission("projects", "delete", "Projects", "Delete projects"),
      createPermission("projects", "admin", "Projects", "Full project control"),
      createPermission("users", "view", "Users", "View team members"),
      createPermission("documents", "create", "Documents", "Create project docs"),
      createPermission("documents", "edit", "Documents", "Edit project docs"),
      createPermission("reports", "create", "Reports", "Create project reports"),
    ],
    userCount: 6,
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date("2024-12-28"),
    isSystemRole: false,
    isActive: true,
  },
  {
    id: "role-8",
    name: "Content Creator",
    description: "Create and manage documents and content",
    color: "from-rose-500 to-pink-500",
    icon: "FileText",
    permissions: [
      createPermission("documents", "view", "Documents", "View documents"),
      createPermission("documents", "create", "Documents", "Create documents"),
      createPermission("documents", "edit", "Documents", "Edit documents"),
      createPermission("documents", "share", "Documents", "Share documents"),
      createPermission("projects", "view", "Projects", "View projects"),
    ],
    userCount: 22,
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2025-01-08"),
    isSystemRole: false,
    isActive: true,
  },
  {
    id: "role-9",
    name: "Guest",
    description: "Limited access for external users",
    color: "from-gray-500 to-slate-500",
    icon: "UserCircle",
    permissions: [
      createPermission("projects", "view", "Projects", "View shared projects"),
      createPermission("documents", "view", "Documents", "View shared documents"),
    ],
    userCount: 89,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-10-12"),
    isSystemRole: true,
    isActive: true,
  },
  {
    id: "role-10",
    name: "Developer",
    description: "Technical access with API and settings permissions",
    color: "from-emerald-500 to-teal-500",
    icon: "Code",
    permissions: [
      ...editorPermissions,
      createPermission("settings", "view", "Settings", "View technical settings"),
      createPermission("settings", "edit", "Settings", "Edit configurations"),
      createPermission("analytics", "export", "Analytics", "Export data via API"),
    ],
    userCount: 7,
    createdAt: new Date("2024-07-20"),
    updatedAt: new Date("2025-01-12"),
    isSystemRole: false,
    isActive: true,
  },
];

// Role Templates for quick creation
export const roleTemplates: RoleTemplate[] = [
  {
    id: "template-admin",
    name: "Administrator",
    description: "Full system access",
    icon: "Shield",
    color: "from-red-500 to-orange-500",
    permissions: adminPermissions.map(({ id, ...rest }) => rest),
  },
  {
    id: "template-editor",
    name: "Editor",
    description: "Create and edit content",
    icon: "Edit",
    color: "from-blue-500 to-cyan-500",
    permissions: editorPermissions.map(({ id, ...rest }) => rest),
  },
  {
    id: "template-viewer",
    name: "Viewer",
    description: "Read-only access",
    icon: "Eye",
    color: "from-green-500 to-emerald-500",
    permissions: viewOnlyPermissions.map(({ id, ...rest }) => rest),
  },
  {
    id: "template-custom",
    name: "Custom Role",
    description: "Start from scratch",
    icon: "Sparkles",
    color: "from-purple-500 to-pink-500",
    permissions: [],
  },
];

// All available permissions for the permission matrix
export const allPermissions: Permission[] = [
  // Users
  createPermission("users", "view", "Users", "View user profiles and information"),
  createPermission("users", "create", "Users", "Create new user accounts"),
  createPermission("users", "edit", "Users", "Edit user information and settings"),
  createPermission("users", "delete", "Users", "Delete user accounts"),
  createPermission("users", "export", "Users", "Export user data"),
  createPermission("users", "import", "Users", "Import user data"),

  // Projects
  createPermission("projects", "view", "Projects", "View project details and status"),
  createPermission("projects", "create", "Projects", "Create new projects"),
  createPermission("projects", "edit", "Projects", "Edit project information"),
  createPermission("projects", "delete", "Projects", "Delete projects"),
  createPermission("projects", "export", "Projects", "Export project data"),
  createPermission("projects", "share", "Projects", "Share projects with others"),

  // Documents
  createPermission("documents", "view", "Documents", "View documents and files"),
  createPermission("documents", "create", "Documents", "Create new documents"),
  createPermission("documents", "edit", "Documents", "Edit document content"),
  createPermission("documents", "delete", "Documents", "Delete documents"),
  createPermission("documents", "export", "Documents", "Export documents"),
  createPermission("documents", "share", "Documents", "Share documents externally"),

  // Settings
  createPermission("settings", "view", "Settings", "View system settings"),
  createPermission("settings", "edit", "Settings", "Modify system configurations"),
  createPermission("settings", "admin", "Settings", "Full settings administration"),

  // Analytics
  createPermission("analytics", "view", "Analytics", "View analytics dashboards"),
  createPermission("analytics", "export", "Analytics", "Export analytics data"),

  // Reports
  createPermission("reports", "view", "Reports", "View existing reports"),
  createPermission("reports", "create", "Reports", "Create custom reports"),
  createPermission("reports", "export", "Reports", "Export report data"),

  // Billing
  createPermission("billing", "view", "Billing", "View billing information"),
  createPermission("billing", "edit", "Billing", "Manage billing settings"),
  createPermission("billing", "export", "Billing", "Export billing data"),
];

// Permission categories with metadata
export const permissionCategories = [
  {
    id: "users",
    name: "Users",
    icon: "Users",
    description: "User account management",
  },
  {
    id: "projects",
    name: "Projects",
    icon: "FolderKanban",
    description: "Project creation and management",
  },
  {
    id: "documents",
    name: "Documents",
    icon: "FileText",
    description: "Document and file operations",
  },
  {
    id: "settings",
    name: "Settings",
    icon: "Settings",
    description: "System configuration",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: "BarChart3",
    description: "Analytics and insights",
  },
  {
    id: "reports",
    name: "Reports",
    icon: "FileBarChart",
    description: "Report generation and export",
  },
  {
    id: "billing",
    name: "Billing",
    icon: "CreditCard",
    description: "Billing and payments",
  },
] as const;
