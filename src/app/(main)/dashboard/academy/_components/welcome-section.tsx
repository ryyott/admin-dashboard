"use client";

import { useState, useEffect } from "react";

import { Search, Calendar } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Teacher } from "@/data/mock-academy-data";

import { NotificationsDropdown } from "./notifications-dropdown";
import { useTimetable } from "./timetable-context";

interface WelcomeSectionProps {
  teacher: Teacher;
}

export function WelcomeSection({ teacher }: WelcomeSectionProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { openTimetable } = useTimetable();

  // Calculate weekly stats
  const weeklyProgress = 70; // This would be calculated from actual data
  const firstName = teacher.name.split(" ")[0];

  // Keyboard shortcut handler for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Focus the search input
        const searchInput = document.getElementById("academy-search");
        searchInput?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="border-border/50 bg-card rounded-xl border px-6 py-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80"
            onClick={openTimetable}
          >
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Calendar className="text-primary h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {firstName}</h1>
              <p className="text-muted-foreground text-xs">Click calendar to view your timetable</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <Avatar className="border-border h-8 w-8 border">
              <AvatarImage src={teacher.avatar} alt={teacher.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {teacher.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-xs">Profile</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationsDropdown />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          id="academy-search"
          type="text"
          placeholder="Search students, classes, assignments..."
          className="bg-background pr-16 pl-9"
        />
        <kbd className="bg-muted text-muted-foreground pointer-events-none absolute top-1/2 right-3 hidden h-5 -translate-y-1/2 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </div>
  );
}
