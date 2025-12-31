"use client";

import { Mail, Phone, MapPin, Calendar, Activity, Briefcase, Award } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { User } from "@/types/user";

interface UserDetailsSheetProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditProfile?: (user: User) => void;
}

export function UserDetailsSheet({ user, open, onOpenChange, onEditProfile }: UserDetailsSheetProps) {
  if (!user) return null;

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto px-8 sm:max-w-xl">
        <SheetHeader className="px-0">
          <SheetTitle>User Profile</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-0">
          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground text-sm">{user.position}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={user.status === "active" ? "default" : "secondary"} className="capitalize">
                      {user.status}
                    </Badge>
                    <Badge variant="outline">{user.department}</Badge>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    if (onEditProfile) {
                      onEditProfile(user);
                      onOpenChange(false);
                    }
                  }}
                >
                  Edit Profile
                </Button>
                <Button size="sm" variant="outline">
                  New Project
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* About */}
          {user.bio && (
            <div>
              <h4 className="mb-2 text-sm font-semibold">About</h4>
              <p className="text-muted-foreground text-sm">{user.bio}</p>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs">Phone</p>
                    <p className="text-sm">{user.phone}</p>
                  </div>
                </div>
              )}
              {user.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs">Location</p>
                    <p className="text-sm">{user.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Access Levels */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Access Permissions</h4>
            <div className="flex flex-wrap gap-2">
              {user.accessLevels.map((level) => (
                <Badge key={level} variant={level === "Admin" ? "default" : "secondary"}>
                  {level}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Activity */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Activity</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">Date Added</p>
                  <p className="text-sm">{formatDate(user.dateAdded)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">Last Active</p>
                  <p className="text-sm">{formatDate(user.lastActive)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Work Experience */}
          {user.workExperience && user.workExperience.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Briefcase className="h-4 w-4" />
                  Work Experience
                </h4>
                <div className="space-y-4">
                  {user.workExperience.map((exp, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                        <Briefcase className="text-primary h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{exp.title}</p>
                        <p className="text-muted-foreground text-sm">{exp.company}</p>
                        <p className="text-muted-foreground mt-1 text-xs">{exp.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Award className="h-4 w-4" />
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
