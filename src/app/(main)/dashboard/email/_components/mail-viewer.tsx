"use client";

import { useState } from "react";

import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Archive,
  Trash,
  Reply,
  MoreHorizontal,
  Bold,
  Italic,
  Underline,
  List,
  Link as LinkIcon,
  Code,
  Smile,
  Paperclip,
  Mail,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { EmailMessage } from "@/types/email";

import { AIComposeAssistant } from "./ai-compose-assistant";
import { AttachmentItem } from "./attachment-item";

interface MailViewerProps {
  email: EmailMessage | null;
}

export function MailViewer({ email }: MailViewerProps) {
  const [replyContent, setReplyContent] = useState("");

  if (!email) {
    return (
      <main className="bg-background flex flex-1 flex-col items-center justify-center">
        <div className="text-center">
          <Mail className="text-muted-foreground/20 mx-auto h-24 w-24" />
          <p className="text-muted-foreground mt-4">Click on an item to see more</p>
          <p className="text-muted-foreground/60 text-sm">Nothing to select here.</p>
        </div>
      </main>
    );
  }

  const formattedDate = format(new Date(email.timestamp), "EEEE, MMMM d, yyyy 'at' h:mm a");
  const toRecipients = email.recipients.filter((r) => r.type === "to");
  const ccRecipients = email.recipients.filter((r) => r.type === "cc");

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={email.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="bg-background flex flex-1 flex-col"
      >
        <div className="border-border bg-background/95 sticky top-0 z-10 flex h-14 items-center gap-2 border-b px-6 backdrop-blur">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Archive className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-2 h-6" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Reply className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="mb-4 text-xl font-semibold">{email.subject}</h1>

              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 shrink-0">
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
                  <div className="mb-1 flex items-start justify-between">
                    <div>
                      <p className="font-medium">{email.sender.name}</p>
                      <p className="text-muted-foreground text-sm">{email.sender.email}</p>
                    </div>
                    <p className="text-muted-foreground text-xs">{formattedDate}</p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-muted-foreground">To:</span>
                    {toRecipients.map((recipient, idx) => (
                      <Badge key={idx} variant="secondary" className="rounded-md font-normal">
                        {recipient.email}
                      </Badge>
                    ))}
                  </div>

                  {ccRecipients.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Cc:</span>
                      {ccRecipients.map((recipient, idx) => (
                        <Badge key={idx} variant="secondary" className="rounded-md font-normal">
                          {recipient.email}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="mb-2 text-sm font-medium">
                    Add AI to your paid plan for just $4
                    <Badge className="ml-2 bg-blue-600 text-xs">NEW</Badge>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Get instant answers to your questions, pull insights from hundreds of marketplaces and applications
                    at once.
                  </p>
                </div>
                <Button size="sm" className="shrink-0">
                  +$4 / month
                  <span className="ml-2 rounded bg-white/20 px-2 py-0.5 text-xs">Add to plan</span>
                </Button>
              </div>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none">
              {email.body.split("\n").map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-sm leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {email.attachments && email.attachments.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-sm font-semibold">Attachments ({email.attachments.length})</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {email.attachments.map((attachment) => (
                    <AttachmentItem key={attachment.id} attachment={attachment} />
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-8" />

            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-600 text-sm font-semibold text-white">
                  LK
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="border-input bg-background rounded-lg border">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Reply to you..."
                    className="w-full resize-none border-0 bg-transparent p-4 text-sm outline-none focus:ring-0"
                    rows={4}
                  />

                  <div className="border-border bg-muted/30 flex items-center justify-between border-t p-3">
                    <div className="flex items-center gap-2">
                      <AIComposeAssistant
                        onGenerateDraft={(content) => setReplyContent(content)}
                        onRewrite={(content) => setReplyContent(content)}
                        onChangeTone={(tone) => {
                          // In a real implementation, this would call an API
                          console.log("Changing tone to:", tone);
                        }}
                      />
                      <Separator orientation="vertical" className="h-6" />
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Underline className="h-4 w-4" />
                        </Button>
                        <Separator orientation="vertical" className="mx-1 h-6" />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <List className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Code className="h-4 w-4" />
                        </Button>
                        <Separator orientation="vertical" className="mx-1 h-6" />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Smile className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Button size="sm">Reply</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.main>
    </AnimatePresence>
  );
}
