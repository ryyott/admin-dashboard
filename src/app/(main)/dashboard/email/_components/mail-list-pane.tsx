"use client";

import { useState, useRef, useEffect } from "react";

import { Search, Settings2, RefreshCcw, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCategoryCounts } from "@/data/mock-email-data";
import { cn } from "@/lib/utils";
import { useEmailStore } from "@/stores/email-store";

import { MailCard } from "./mail-card";
import { MailCategoryTabs } from "./mail-category-tabs";

const getViewTitle = (view: string) => {
  switch (view) {
    case "inbox":
      return "All Inbox";
    case "starred":
      return "Starred";
    case "sent":
      return "Sent";
    case "drafts":
      return "Drafts";
    case "deleted":
      return "Deleted";
    case "spam":
      return "Spam";
    default:
      return "All Inbox";
  }
};

export function MailListPane() {
  const {
    filters,
    selectedEmailId,
    selectEmail,
    toggleEmailStarred,
    setCategory,
    setSearchQuery,
    getEmailsByDateGroup,
  } = useEmailStore();

  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const emailsByDateGroup = getEmailsByDateGroup();
  const categoryCounts = getCategoryCounts();
  const dateGroups = Object.keys(emailsByDateGroup);
  const totalEmails = Object.values(emailsByDateGroup).reduce((acc, emails) => acc + emails.length, 0);

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="border-border bg-background flex w-full flex-col overflow-hidden border-r md:w-[380px] lg:w-[420px]">
      <div className="border-border flex h-16 shrink-0 items-center justify-between border-b px-4">
        <h2 className="text-sm font-semibold">{getViewTitle(filters.view)}</h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filters.view === "inbox" && (
        <MailCategoryTabs
          activeCategory={filters.category}
          onCategoryChange={setCategory}
          categoryCounts={categoryCounts}
        />
      )}

      <div className="border-border border-b px-4 py-3">
        <div
          className={cn(
            "border-input bg-background flex items-center gap-2 rounded-lg border px-3 py-2 transition-all",
            searchFocused && "ring-ring ring-2",
          )}
        >
          <Search className="text-muted-foreground h-4 w-4" />
          <Input
            ref={searchInputRef}
            placeholder="Search from mails"
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="h-auto border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {!searchFocused && !filters.searchQuery && (
            <kbd className="border-border bg-muted text-muted-foreground pointer-events-none hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      <div className="border-border flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            1-{Math.min(20, totalEmails)} out of {totalEmails}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          {dateGroups.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">No emails found</p>
                <p className="text-muted-foreground/60 mt-1 text-xs">Try adjusting your filters</p>
              </div>
            </div>
          ) : (
            dateGroups.map((dateGroup) => (
              <div key={dateGroup} className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">{dateGroup}</h3>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {emailsByDateGroup[dateGroup].map((email) => (
                    <MailCard
                      key={email.id}
                      email={email}
                      isSelected={selectedEmailId === email.id}
                      onClick={() => selectEmail(email.id)}
                      onToggleStar={(e) => {
                        e.stopPropagation();
                        toggleEmailStarred(email.id);
                      }}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
