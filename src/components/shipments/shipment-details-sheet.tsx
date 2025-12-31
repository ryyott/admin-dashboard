"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { Package, MapPin, Calendar, Clock, ExternalLink, Copy, Pencil, Trash2, AlertCircle, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type Shipment } from "@/types/shipment";

import { CarrierBadge } from "./carrier-badge";
import { ShipmentStatusBadge } from "./shipment-status-badge";
import { DetailedShipmentTimeline } from "./shipment-timeline";

interface ShipmentDetailsSheetProps {
  shipment: Shipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (shipment: Shipment) => void;
  onDelete?: (shipment: Shipment) => void;
}

export function ShipmentDetailsSheet({ shipment, open, onOpenChange, onEdit, onDelete }: ShipmentDetailsSheetProps) {
  const [isCopied, setIsCopied] = useState(false);

  if (!shipment) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatShortDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const copyTrackingNumber = () => {
    if (shipment.trackingNumber) {
      navigator.clipboard.writeText(shipment.trackingNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <SheetTitle className="flex items-center gap-2 text-2xl">
                <Package className="size-6" />
                {shipment.shipmentId}
              </SheetTitle>
              <SheetDescription className="text-base">Order: {shipment.orderId}</SheetDescription>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => onEdit?.(shipment)}>
                      <Pencil className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit shipment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => onDelete?.(shipment)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete shipment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status and Carrier Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">Status</p>
              <div className="flex items-center gap-2">
                <ShipmentStatusBadge status={shipment.status} />
                {shipment.isDelayed && (
                  <Badge
                    variant="outline"
                    className="border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800/50 dark:bg-orange-950/50 dark:text-orange-400"
                  >
                    <AlertCircle className="mr-1 size-3" />
                    Delayed
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">Carrier</p>
              <CarrierBadge carrier={shipment.carrier} />
            </div>
          </motion.div>

          {/* Tracking Number */}
          {shipment.trackingNumber && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-muted/50 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">Tracking Number</p>
                  <p className="font-mono text-lg font-semibold">{shipment.trackingNumber}</p>
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={copyTrackingNumber}>
                          {isCopied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isCopied ? "Copied!" : "Copy tracking number"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <ExternalLink className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Track on carrier website</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </motion.div>
          )}

          <Separator />

          {/* Route Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="font-semibold">Route Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 rounded-lg border p-4">
                <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <MapPin className="size-4" />
                  Origin
                </p>
                <p className="text-lg font-medium">{shipment.origin}</p>
              </div>
              <div className="space-y-2 rounded-lg border p-4">
                <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <MapPin className="size-4" />
                  Destination
                </p>
                <p className="text-lg font-medium">{shipment.destination}</p>
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* Dates Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="font-semibold">Timeline</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Created</p>
                    <p className="font-medium">{formatShortDate(shipment.createdAt)}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/30">
                    <Clock className="size-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Expected Arrival</p>
                    <p className="font-medium">{formatDate(shipment.expectedArrival)}</p>
                  </div>
                </div>
              </div>
              {shipment.actualArrival && (
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
                      <Package className="size-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Actual Arrival</p>
                      <p className="font-medium">{formatDate(shipment.actualArrival)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <Separator />

          {/* Shipment Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h3 className="font-semibold">Shipment Progress</h3>
            <div className="rounded-lg border p-4">
              <DetailedShipmentTimeline events={shipment.events} />
            </div>
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
