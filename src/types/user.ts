export type AccessLevel = "Admin" | "Data Export" | "Data Import" | "User";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  roleIds?: string[]; // Array of role IDs from roles system
  department?: string;
  position?: string;
  phone?: string;
  location?: string;
  accessLevels: AccessLevel[];
  status: "active" | "inactive" | "pending";
  dateAdded: string;
  lastActive: string;
  reportsTo?: string; // User ID of manager
  teamMembers?: string[]; // Array of user IDs
  bio?: string;
  workExperience?: WorkExperience[];
  skills?: string[];
}

export interface WorkExperience {
  title: string;
  company: string;
  logo?: string;
  period: string;
}

export interface OrganizationNode {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  avatar?: string;
  reportsTo?: string;
  teamSize?: number;
}
