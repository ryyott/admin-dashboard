"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useRolesStore } from "@/stores/roles-store";
import type { Role, Permission } from "@/types/roles";

import { PermissionMatrix } from "./permission-matrix";

const roleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  icon: z.string().min(1, "Please select an icon"),
  color: z.string().min(1, "Please select a color"),
  isSystemRole: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
}

const iconOptions = [
  "Shield",
  "Users",
  "Eye",
  "Edit",
  "BarChart3",
  "Headphones",
  "CreditCard",
  "FolderKanban",
  "FileText",
  "UserCircle",
  "Code",
  "Settings",
  "Lock",
  "Star",
  "Award",
];

const colorOptions = [
  { value: "from-red-500 to-orange-500", label: "Red Orange" },
  { value: "from-blue-500 to-cyan-500", label: "Blue Cyan" },
  { value: "from-green-500 to-emerald-500", label: "Green Emerald" },
  { value: "from-purple-500 to-pink-500", label: "Purple Pink" },
  { value: "from-yellow-500 to-amber-500", label: "Yellow Amber" },
  { value: "from-indigo-500 to-violet-500", label: "Indigo Violet" },
  { value: "from-teal-500 to-cyan-500", label: "Teal Cyan" },
  { value: "from-rose-500 to-pink-500", label: "Rose Pink" },
  { value: "from-gray-500 to-slate-500", label: "Gray Slate" },
  { value: "from-emerald-500 to-teal-500", label: "Emerald Teal" },
];

export function RoleDialog({ open, onOpenChange, role }: RoleDialogProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(role?.permissions || []);

  const addRole = useRolesStore((state) => state.addRole);
  const updateRole = useRolesStore((state) => state.updateRole);

  const isEdit = !!role;

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || "",
      description: role?.description || "",
      icon: role?.icon || "Shield",
      color: role?.color || colorOptions[0].value,
      isSystemRole: role?.isSystemRole || false,
      isActive: role?.isActive ?? true,
    },
  });

  const onSubmit = (data: RoleFormValues) => {
    if (selectedPermissions.length === 0) {
      toast.error("Please select at least one permission");
      setActiveTab("permissions");
      return;
    }

    if (isEdit && role) {
      updateRole(role.id, {
        ...data,
        permissions: selectedPermissions,
      });
      toast.success("Role updated successfully", {
        description: `${data.name} has been updated`,
      });
    } else {
      addRole({
        ...data,
        permissions: selectedPermissions,
        userCount: 0,
      });
      toast.success("Role created successfully", {
        description: `${data.name} has been created`,
      });
    }

    onOpenChange(false);
    form.reset();
    setSelectedPermissions([]);
    setActiveTab("basic");
  };

  const handleCancel = () => {
    if (form.formState.isDirty || selectedPermissions.length > 0) {
      if (!confirm("You have unsaved changes. Are you sure you want to close this dialog?")) {
        return;
      }
    }
    onOpenChange(false);
    form.reset();
    setSelectedPermissions([]);
    setActiveTab("basic");
  };

  const selectedIcon = form.watch("icon");
  const selectedColor = form.watch("color");
  const IconComponent = (Icons[selectedIcon as keyof typeof Icons] || Icons.Shield) as any;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[95vh] w-[95vw] max-w-[1800px] flex-col overflow-hidden p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn("rounded-lg p-2", "bg-gradient-to-br", selectedColor)}>
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            {isEdit ? `Edit Role: ${role?.name}` : "Create New Role"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Update role information and permissions" : "Define a new role with specific permissions"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="permissions">
                  Permissions
                  {selectedPermissions.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedPermissions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <div className="mt-4 flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TabsContent value="basic" className="mt-0 space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Content Manager" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe what this role does and who it's for..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              A clear description helps users understand the role's purpose
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="icon"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Icon</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an icon" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {iconOptions.map((icon) => {
                                    const Icon = (Icons[icon as keyof typeof Icons] || Icons.Circle) as any;
                                    return (
                                      <SelectItem key={icon} value={icon}>
                                        <div className="flex items-center gap-2">
                                          <Icon className="h-4 w-4" />
                                          <span>{icon}</span>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="color"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Color</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a color" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {colorOptions.map((color) => (
                                    <SelectItem key={color.value} value={color.value}>
                                      <div className="flex items-center gap-2">
                                        <div className={cn("h-4 w-4 rounded", "bg-gradient-to-br", color.value)} />
                                        <span>{color.label}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4 rounded-lg border p-4">
                        <FormField
                          control={form.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div>
                                <FormLabel>Active Status</FormLabel>
                                <FormDescription>Inactive roles cannot be assigned to users</FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="isSystemRole"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div>
                                <FormLabel>System Role</FormLabel>
                                <FormDescription>System roles cannot be deleted</FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="permissions" className="mt-0">
                      <PermissionMatrix
                        selectedPermissions={selectedPermissions}
                        onPermissionsChange={setSelectedPermissions}
                      />
                    </TabsContent>

                    <TabsContent value="preview" className="mt-0 space-y-4">
                      <div className="bg-card rounded-lg border p-6">
                        <div className="flex items-start gap-4">
                          <div className={cn("rounded-lg p-4", "bg-gradient-to-br", selectedColor)}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold">{form.watch("name") || "Role Name"}</h3>
                            <p className="text-muted-foreground mt-2">
                              {form.watch("description") || "Role description"}
                            </p>
                            <div className="mt-4 flex gap-2">
                              {form.watch("isSystemRole") && <Badge>System Role</Badge>}
                              <Badge variant={form.watch("isActive") ? "default" : "secondary"}>
                                {form.watch("isActive") ? "Active" : "Inactive"}
                              </Badge>
                              <Badge variant="outline">{selectedPermissions.length} Permissions</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="mb-3 font-semibold">Selected Permissions</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedPermissions.length === 0 ? (
                              <p className="text-muted-foreground col-span-2 text-sm">No permissions selected</p>
                            ) : (
                              selectedPermissions.map((perm) => (
                                <Badge key={perm.id} variant="secondary">
                                  {perm.action} {perm.resource}
                                </Badge>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Tabs>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">{isEdit ? "Save Changes" : "Create Role"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
