"use client";

import { useState } from "react";

import { Search, Filter, Plus, MoreVertical, ArrowUpDown, SlidersHorizontal } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { users } from "@/data/users";
import { User } from "@/types/user";

import { AddUserDialog } from "./_components/add-user-dialog";
import { MemberCardHover } from "./_components/member-card-hover";
import { OrganizationChart } from "./_components/organization-chart";
import { UserDetailsSheet } from "./_components/user-details-sheet";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<"list" | "chart">("list");

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      user.department?.toLowerCase().includes(searchLower)
    );
  });

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsSheetOpen(true);
  };

  const handleEditProfile = (user: User) => {
    setEditingUser(user);
    setIsAddUserOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsAddUserOpen(open);
    if (!open) {
      setEditingUser(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
        <div className="flex flex-col gap-4 p-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">User management</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your team members and their account permissions here.
            </p>
          </div>

          <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as "list" | "chart")}>
            <TabsList>
              <TabsTrigger value="list">All Users</TabsTrigger>
              <TabsTrigger value="chart">Organization Chart</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {currentView === "list" ? (
          <div className="p-6">
            {/* Actions Bar */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative max-w-sm flex-1">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={() => setIsAddUserOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add user
              </Button>
            </div>

            {/* Stats */}
            <div className="mb-6">
              <p className="text-muted-foreground text-sm">
                All users <span className="text-foreground font-medium">{filteredUsers.length}</span>
              </p>
            </div>

            {/* Table */}
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" className="-ml-3 h-8 font-medium">
                        User name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" className="-ml-3 h-8 font-medium">
                        Last active
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" className="-ml-3 h-8 font-medium">
                        Date added
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <MemberCardHover user={user}>
                            <Avatar className="h-10 w-10 cursor-pointer">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                          </MemberCardHover>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-muted-foreground text-sm">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.accessLevels.map((level) => (
                            <Badge
                              key={level}
                              variant={level === "Admin" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {level}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(user.lastActive)}</TableCell>
                      <TableCell className="text-sm">{formatDate(user.dateAdded)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUserClick(user)}>View profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit user</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete user</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6].map((page) => (
                  <Button key={page} variant={page === 1 ? "default" : "ghost"} size="sm" className="h-8 w-8 p-0">
                    {page}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        ) : (
          <OrganizationChart />
        )}
      </div>

      {/* Modals */}
      <UserDetailsSheet
        user={selectedUser}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onEditProfile={handleEditProfile}
      />
      <AddUserDialog open={isAddUserOpen} onOpenChange={handleDialogClose} editUser={editingUser} />
    </div>
  );
}
