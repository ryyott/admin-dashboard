"use client";

import { useState } from "react";
import { useEffect } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AccessLevel, User } from "@/types/user";

import { ProfilePictureUpload } from "./profile-picture-upload";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editUser?: User | null;
}

export function AddUserDialog({ open, onOpenChange, editUser }: AddUserDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    position: "",
    location: "",
    bio: "",
    accessLevels: [] as AccessLevel[],
    avatar: undefined as File | undefined,
    currentAvatarUrl: undefined as string | undefined,
  });

  // Load user data when editing
  useEffect(() => {
    if (editUser) {
      setFormData({
        name: editUser.name,
        email: editUser.email,
        phone: editUser.phone || "",
        role: editUser.role,
        department: editUser.department || "",
        position: editUser.position || "",
        location: editUser.location || "",
        bio: editUser.bio || "",
        accessLevels: editUser.accessLevels,
        avatar: undefined,
        currentAvatarUrl: editUser.avatar,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
        department: "",
        position: "",
        location: "",
        bio: "",
        accessLevels: [],
        avatar: undefined,
        currentAvatarUrl: undefined,
      });
    }
  }, [editUser]);

  const accessLevelOptions: AccessLevel[] = ["Admin", "Data Export", "Data Import", "User"];

  const handleAccessLevelToggle = (level: AccessLevel) => {
    setFormData((prev) => ({
      ...prev,
      accessLevels: prev.accessLevels.includes(level)
        ? prev.accessLevels.filter((l) => l !== level)
        : [...prev.accessLevels, level],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email) {
      toast.error("Please fill in required fields");
      return;
    }

    // Here you would typically make an API call to create/update the user
    console.log(editUser ? "Updating user:" : "Creating user:", formData);
    toast.success(editUser ? "User updated successfully" : "User created successfully");

    // Reset form and close dialog
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      position: "",
      location: "",
      bio: "",
      accessLevels: [],
      avatar: undefined,
      currentAvatarUrl: undefined,
    });
    onOpenChange(false);
  };

  const handleAvatarUpload = (file: File) => {
    setFormData({ ...formData, avatar: file });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editUser ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {editUser
              ? "Update user information and permissions."
              : "Create a new user account and set their permissions."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Profile Picture */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Profile Picture</h4>
              <ProfilePictureUpload
                userName={formData.name || "New User"}
                currentAvatar={formData.currentAvatarUrl}
                onUpload={handleAvatarUpload}
              />
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Role & Department */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Role & Department</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    placeholder="Software Engineer"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Leadership">Leadership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role Title</Label>
                <Input
                  id="role"
                  placeholder="Senior Software Engineer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
            </div>

            {/* Access Permissions */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Access Permissions</h4>
              <div className="space-y-3">
                {accessLevelOptions.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={level}
                      checked={formData.accessLevels.includes(level)}
                      onCheckedChange={() => handleAccessLevelToggle(level)}
                    />
                    <Label htmlFor={level} className="cursor-pointer text-sm font-normal">
                      {level}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about this user..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editUser ? "Update User" : "Create User"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
