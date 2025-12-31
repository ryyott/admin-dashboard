import { users } from "@/data/users";
import type { User } from "@/types/user";

// Mapping of user IDs to role IDs (mutable state)
const userRoleMapping: Record<string, string[]> = {
  "1": ["role-1"], // ryyott - Administrator
  "2": ["role-1"], // Amelie Laurent - Administrator
  "3": ["role-10"], // Ammar Foley - Developer
  "4": ["role-2"], // Caitlyn King - Editor
  "5": ["role-2", "role-4"], // Sienna Hewitt - Editor + Data Analyst
  "6": ["role-7"], // Olly Shoeder - Project Manager
  "7": ["role-7"], // Mathilde Lewis - Project Manager
  "8": ["role-5"], // Jaya Willis - Support Agent
};

// Update user's roles
export const updateUserRoles = (userId: string, roleIds: string[]): void => {
  userRoleMapping[userId] = roleIds;
};

// Get users by role ID
export const getUsersByRoleId = (roleId: string): User[] => {
  return users.filter((user) => {
    const roleIds = userRoleMapping[user.id] || [];
    return roleIds.includes(roleId);
  });
};

// Get role IDs for a user
export const getRoleIdsForUser = (userId: string): string[] => {
  return userRoleMapping[userId] || [];
};

// Get all users with their assigned roles
export const getUsersWithRoles = (): Array<User & { assignedRoleIds: string[] }> => {
  return users.map((user) => ({
    ...user,
    assignedRoleIds: getRoleIdsForUser(user.id),
  }));
};
