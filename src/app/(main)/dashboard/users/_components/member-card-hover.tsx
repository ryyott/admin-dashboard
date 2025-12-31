"use client";

import { useState, useRef, useEffect } from "react";

import { AnimatePresence, motion } from "motion/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CometCard } from "@/components/ui/comet-card";
import { User } from "@/types/user";

interface MemberCardHoverProps {
  user: User;
  children: React.ReactNode;
}

export function MemberCardHover({ user, children }: MemberCardHoverProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      if (!isCardHovered) {
        setIsHovering(false);
      }
    }, 300);
  };

  const handleCardMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsCardHovered(true);
  };

  const handleCardMouseLeave = () => {
    setIsCardHovered(false);
    setIsHovering(false);
  };

  return (
    <>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>

      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Card */}
            <div
              className="pointer-events-auto relative z-10"
              onMouseEnter={handleCardMouseEnter}
              onMouseLeave={handleCardMouseLeave}
            >
              <CometCard rotateDepth={12} translateDepth={15}>
                <div className="from-card via-card to-card/95 dark:from-card dark:via-card dark:to-card/95 border-border relative aspect-[2/3] w-80 overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-2xl">
                  {/* User Image */}
                  <div className="my-12 mt-16 flex justify-center">
                    <div className="relative">
                      <Avatar className="border-border h-32 w-32 border-4">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-muted text-foreground text-3xl">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      {/* Status indicator */}
                      {user.status === "active" && (
                        <div className="border-card absolute right-2 bottom-2 h-4 w-4 rounded-full border-2 bg-green-500" />
                      )}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="space-y-2 text-center">
                    <h4 className="text-foreground text-xl font-semibold">{user.name}</h4>
                    <p className="text-muted-foreground text-sm">{user.position}</p>
                    <p className="text-muted-foreground text-xs">{user.email}</p>
                  </div>

                  {/* Badge */}
                  <div className="absolute right-6 bottom-6 left-6 text-center">
                    <div className="bg-muted/50 border-border inline-block rounded-full border px-4 py-1 backdrop-blur-sm">
                      <p className="text-foreground text-xs font-medium">Member Card</p>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="bg-primary/5 absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl" />
                  <div className="bg-primary/5 absolute bottom-0 left-0 h-24 w-24 rounded-full blur-2xl" />
                </div>
              </CometCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
