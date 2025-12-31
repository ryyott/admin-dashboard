"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EmailMessage } from "@/types/email";

interface MailCardProps {
  email: EmailMessage;
  isSelected: boolean;
  onClick: () => void;
  onToggleStar: (e: React.MouseEvent) => void;
}

export function MailCard({ email, isSelected, onClick, onToggleStar }: MailCardProps) {
  const time = format(new Date(email.timestamp), "HH:mm");
  const visibleTags = email.tags.slice(0, 3);
  const remainingTagsCount = email.tags.length - 3;

  return (
    <motion.div
      initial={false}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "bg-card relative cursor-pointer rounded-xl border border-transparent p-4 transition-all duration-150",
        isSelected ? "border-l-primary bg-accent/10 border-l-4 shadow-sm" : "hover:bg-muted/20 hover:shadow-md",
        !email.isRead && "font-semibold",
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback
            className={cn(
              "bg-gradient-to-br text-sm font-semibold text-white",
              email.sender.avatarBgColor || "from-gray-400 to-gray-600",
            )}
          >
            {email.sender.avatar}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className={cn("text-sm", !email.isRead && "font-semibold")}>{email.sender.name}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-muted-foreground text-xs">{time}</span>
              <button
                onClick={onToggleStar}
                className={cn(
                  "transition-colors",
                  email.isStarred ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500",
                )}
              >
                <Star className="h-4 w-4" fill={email.isStarred ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <p className={cn("mb-1 truncate text-sm", !email.isRead && "font-semibold")}>{email.subject}</p>

          <p className="text-muted-foreground mb-2 line-clamp-1 text-sm">{email.preview}</p>

          {email.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {visibleTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={
                    tag.variant === "primary" || tag.variant === "success" || tag.variant === "warning"
                      ? "default"
                      : tag.variant
                  }
                  className="rounded-full text-[10px] font-medium"
                >
                  {tag.label}
                </Badge>
              ))}
              {remainingTagsCount > 0 && (
                <Badge variant="secondary" className="rounded-full text-[10px] font-medium">
                  +{remainingTagsCount}
                </Badge>
              )}
            </div>
          )}

          {email.hasNewBadge && (
            <Badge className="mt-2 rounded-full bg-blue-500 text-[10px] font-semibold text-white">NEW</Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
