"use client";

import { Download, ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ZOOM_LEVELS = [50, 75, 100, 125, 150];

interface InvoicePreviewControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onDownload?: () => void;
}

export function InvoicePreviewControls({ zoom, onZoomChange, onDownload }: InvoicePreviewControlsProps) {
  const currentIndex = ZOOM_LEVELS.indexOf(zoom);
  const canZoomOut = currentIndex > 0;
  const canZoomIn = currentIndex < ZOOM_LEVELS.length - 1;

  const handleZoomOut = () => {
    if (canZoomOut) {
      onZoomChange(ZOOM_LEVELS[currentIndex - 1]);
    }
  };

  const handleZoomIn = () => {
    if (canZoomIn) {
      onZoomChange(ZOOM_LEVELS[currentIndex + 1]);
    }
  };

  return (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Preview</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="size-8" onClick={handleZoomOut} disabled={!canZoomOut}>
            <ZoomOut className="size-4" />
          </Button>
          <Select value={zoom.toString()} onValueChange={(val) => onZoomChange(Number(val))}>
            <SelectTrigger className="h-8 w-24">
              <SelectValue>{zoom}%</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ZOOM_LEVELS.map((level) => (
                <SelectItem key={level} value={level.toString()}>
                  {level}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="size-8" onClick={handleZoomIn} disabled={!canZoomIn}>
            <ZoomIn className="size-4" />
          </Button>
          {onDownload && (
            <Button variant="outline" size="icon" className="size-8" onClick={onDownload}>
              <Download className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
