"use client";

import { Settings, Bell, Shield, Palette, Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function EmailSettings() {
  return (
    <div className="bg-background flex flex-1 flex-col">
      <div className="border-border bg-background/95 sticky top-0 z-10 border-b px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5" />
          <h1 className="text-xl font-semibold">Email Settings</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-8 p-6">
          {/* Notifications Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Bell className="text-muted-foreground h-5 w-5" />
              <div>
                <h2 className="text-lg font-semibold">Notifications</h2>
                <p className="text-muted-foreground text-sm">Manage how you receive email notifications</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="desktop-notifications" className="text-base">
                    Desktop Notifications
                  </Label>
                  <p className="text-muted-foreground text-sm">Receive desktop notifications for new emails</p>
                </div>
                <Switch id="desktop-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="text-base">
                    Email Notifications
                  </Label>
                  <p className="text-muted-foreground text-sm">Get notified about important emails via email</p>
                </div>
                <Switch id="email-notifications" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sound-notifications" className="text-base">
                    Sound Notifications
                  </Label>
                  <p className="text-muted-foreground text-sm">Play a sound when receiving new emails</p>
                </div>
                <Switch id="sound-notifications" defaultChecked />
              </div>
            </div>
          </div>

          {/* Privacy & Security Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="text-muted-foreground h-5 w-5" />
              <div>
                <h2 className="text-lg font-semibold">Privacy & Security</h2>
                <p className="text-muted-foreground text-sm">Control your privacy and security settings</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="read-receipts" className="text-base">
                    Read Receipts
                  </Label>
                  <p className="text-muted-foreground text-sm">Let senders know when you've read their emails</p>
                </div>
                <Switch id="read-receipts" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="block-images" className="text-base">
                    Block External Images
                  </Label>
                  <p className="text-muted-foreground text-sm">Prevent automatic loading of external images</p>
                </div>
                <Switch id="block-images" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="spam-filter" className="text-base">
                    Enhanced Spam Filter
                  </Label>
                  <p className="text-muted-foreground text-sm">Use AI to detect and filter spam emails</p>
                </div>
                <Switch id="spam-filter" defaultChecked />
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Palette className="text-muted-foreground h-5 w-5" />
              <div>
                <h2 className="text-lg font-semibold">Appearance</h2>
                <p className="text-muted-foreground text-sm">Customize how your inbox looks</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compact-view" className="text-base">
                    Compact View
                  </Label>
                  <p className="text-muted-foreground text-sm">Show more emails per screen with compact layout</p>
                </div>
                <Switch id="compact-view" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-avatars" className="text-base">
                    Show Avatars
                  </Label>
                  <p className="text-muted-foreground text-sm">Display sender avatars in email list</p>
                </div>
                <Switch id="show-avatars" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="preview-pane" className="text-base">
                    Preview Pane
                  </Label>
                  <p className="text-muted-foreground text-sm">Show email preview on the right side</p>
                </div>
                <Switch id="preview-pane" defaultChecked />
              </div>
            </div>
          </div>

          {/* Inbox Organization Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Inbox className="text-muted-foreground h-5 w-5" />
              <div>
                <h2 className="text-lg font-semibold">Inbox Organization</h2>
                <p className="text-muted-foreground text-sm">Manage how your emails are organized</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-categorize" className="text-base">
                    Auto-Categorize
                  </Label>
                  <p className="text-muted-foreground text-sm">Automatically sort emails into categories</p>
                </div>
                <Switch id="auto-categorize" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="important-first" className="text-base">
                    Important First
                  </Label>
                  <p className="text-muted-foreground text-sm">Show important emails at the top</p>
                </div>
                <Switch id="important-first" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="threaded-view" className="text-base">
                    Threaded Conversations
                  </Label>
                  <p className="text-muted-foreground text-sm">Group related emails together</p>
                </div>
                <Switch id="threaded-view" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
