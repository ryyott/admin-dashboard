"use client";

import { useState } from "react";

import { FileText, Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EmailAttachment } from "@/types/email";

interface AttachmentItemProps {
  attachment: EmailAttachment;
  onDownload?: () => void;
}

export function AttachmentItem({ attachment, onDownload }: AttachmentItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getFileIcon = () => {
    switch (attachment.fileType) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-8 w-8 text-blue-500" />;
      default:
        return <FileText className="text-muted-foreground h-8 w-8" />;
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group border-border bg-card hover:border-primary/50 relative flex flex-col items-center gap-2 rounded-lg border p-4 transition-all hover:shadow-md"
    >
      <div className="relative">
        {getFileIcon()}
        {isHovered && (
          <button
            onClick={onDownload}
            className="absolute inset-0 flex items-center justify-center rounded-md bg-black/60 text-white transition-all"
          >
            <Download className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="w-full text-center">
        <p className="truncate text-xs font-medium" title={attachment.fileName}>
          {attachment.fileName.length > 20 ? `${attachment.fileName.slice(0, 17)}...` : attachment.fileName}
        </p>
        <Badge variant="secondary" className="mt-1 text-[10px]">
          {attachment.fileSize}
        </Badge>
      </div>
    </div>
  );
}
