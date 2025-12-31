"use client";

import { useEmailStore } from "@/stores/email-store";

import { EmailSettings } from "./_components/email-settings";
import { EmailSidebar } from "./_components/email-sidebar";
import { MailListPane } from "./_components/mail-list-pane";
import { MailViewer } from "./_components/mail-viewer";

export default function EmailPage() {
  const selectedEmail = useEmailStore((state) => state.getSelectedEmail());
  const filters = useEmailStore((state) => state.filters);

  return (
    <div className="-m-4 md:-m-6">
      <div className="border-border bg-background flex h-[calc(100vh-3rem)] overflow-hidden border md:h-[calc(100vh-4.5rem)]">
        <EmailSidebar />
        {filters.view === "settings" ? (
          <EmailSettings />
        ) : (
          <>
            <MailListPane />
            <MailViewer email={selectedEmail} />
          </>
        )}
      </div>
    </div>
  );
}
