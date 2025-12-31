"use client";

import { useState } from "react";

import { FileText, ExternalLink, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Attachment } from "@/types/chat";

interface SharedMediaProps {
  media: {
    images: Attachment[];
    documents: Attachment[];
    links: string[];
  };
}

export function SharedMedia({ media }: SharedMediaProps) {
  const [activeTab, setActiveTab] = useState<"media" | "link" | "docs">("media");

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Media</h3>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="media" className="text-xs">
            Media
          </TabsTrigger>
          <TabsTrigger value="link" className="text-xs">
            Link
          </TabsTrigger>
          <TabsTrigger value="docs" className="text-xs">
            Docs
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Media Tab */}
      {activeTab === "media" && (
        <div className="grid grid-cols-3 gap-2">
          {media.images.slice(0, 9).map((image) => (
            <div
              key={image.id}
              className="group border-border bg-muted relative aspect-square overflow-hidden rounded-lg border"
            >
              <img
                src={image.url}
                alt={image.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </div>
          ))}
          {media.images.length > 9 && (
            <div className="border-border bg-muted flex aspect-square items-center justify-center rounded-lg border border-dashed">
              <span className="text-muted-foreground text-sm font-semibold">+{media.images.length - 9}</span>
            </div>
          )}
        </div>
      )}

      {/* Link Tab */}
      {activeTab === "link" && (
        <div className="space-y-2">
          {media.links.length === 0 ? (
            <div className="border-border flex h-32 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground text-sm">No shared links</p>
            </div>
          ) : (
            media.links.slice(0, 5).map((link, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto w-full justify-start rounded-lg p-3 text-left"
                asChild
              >
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="text-muted-foreground mr-3 h-4 w-4 shrink-0" />
                  <span className="truncate text-sm">{link}</span>
                </a>
              </Button>
            ))
          )}
        </div>
      )}

      {/* Docs Tab */}
      {activeTab === "docs" && (
        <div className="space-y-2">
          {media.documents.length === 0 ? (
            <div className="border-border flex h-32 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground text-sm">No shared documents</p>
            </div>
          ) : (
            media.documents.slice(0, 5).map((doc) => (
              <Button key={doc.id} variant="outline" className="h-auto w-full justify-start rounded-lg p-3 text-left">
                <FileText className="text-muted-foreground mr-3 h-4 w-4 shrink-0" />
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium">{doc.name}</p>
                  {doc.size && <p className="text-muted-foreground text-xs">{(doc.size / 1024).toFixed(1)} KB</p>}
                </div>
              </Button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
