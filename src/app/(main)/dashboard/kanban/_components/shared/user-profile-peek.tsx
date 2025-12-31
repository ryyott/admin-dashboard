"use client";

import { MapPin, Mail, Briefcase } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { getInitials } from "@/lib/utils";
import type { User } from "@/types/kanban";

interface UserProfilePeekProps {
  user: User;
  children: React.ReactNode;
}

export function UserProfilePeek({ user, children }: UserProfilePeekProps) {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80" side="bottom" align="start">
        <div className="flex flex-col gap-4">
          {/* Header with Avatar and Name */}
          <div className="flex gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-semibold">{user.name}</h4>
              {user.jobTitle && (
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Briefcase className="h-3 w-3" />
                  <span>{user.jobTitle}</span>
                </div>
              )}
              {user.role && (
                <Badge variant="secondary" className="text-xs">
                  {user.role}
                </Badge>
              )}
            </div>
          </div>

          {/* Bio */}
          {user.bio && <p className="text-muted-foreground text-sm leading-relaxed">{user.bio}</p>}

          {/* Contact Info */}
          <div className="border-border space-y-2 border-t pt-3">
            <div className="flex items-center gap-2 text-xs">
              <Mail className="text-muted-foreground h-3.5 w-3.5" />
              <a
                href={`mailto:${user.email}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {user.email}
              </a>
            </div>
            {user.location && (
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">{user.location}</span>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
