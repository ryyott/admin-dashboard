"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { Plus, FileDown, Check } from "lucide-react";
import { MapPin, Package, Calendar, Clock, Copy, ExternalLink, AlertCircle } from "lucide-react";

import { AddShipmentForm } from "@/components/shipments/add-shipment-form";
import type { Shipment } from "@/types/shipment";

import { DetailedShipmentTimeline } from "@/components/shipments/shipment-timeline";
import { ShipmentStatusBadge } from "@/components/shipments/shipment-status-badge";
import { CarrierBadge } from "@/components/shipments/carrier-badge";
import { ShipmentsTable } from "@/components/shipments/shipments-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { mockShipments } from "@/lib/mock/shipments";

import { ShipmentStatsCards } from "./_components/shipment-stats-cards";

export default function ShipmentsPage() {
  const [shipments] = useState<Shipment[]>(mockShipments);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleView = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsDialogOpen(true);
  };

  const handleEdit = (shipment: Shipment) => {
    console.log("Edit shipment:", shipment.shipmentId);
    // TODO: Implement edit functionality
  };

  const handleDuplicate = (shipment: Shipment) => {
    console.log("Duplicate shipment:", shipment.shipmentId);
    // TODO: Implement duplicate functionality
  };

  const handleDelete = (shipment: Shipment) => {
    console.log("Delete shipment:", shipment.shipmentId);
    // TODO: Implement delete functionality
  };

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
    if (selectedShipment?.trackingNumber) {
      navigator.clipboard.writeText(selectedShipment.trackingNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipment</h1>
          <p className="text-muted-foreground">Track and manage all your shipments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileDown className="size-4" />
            Export
          </Button>
          <Button className="gap-2" onClick={() => setIsAddFormOpen(true)}>
            <Plus className="size-4" />
            Add Shipment
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <ShipmentStatsCards shipments={shipments} />

      {/* Shipments Table */}
      <ShipmentsTable
        shipments={shipments}
        onView={handleView}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />

      {/* Shipment Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          {selectedShipment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <Package className="size-6" />
                  {selectedShipment.shipmentId}
                </DialogTitle>
                <DialogDescription className="text-base">Order: {selectedShipment.orderId}</DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 pt-4 lg:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Status and Carrier */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">Status</p>
                      <div className="flex items-center gap-2">
                        <ShipmentStatusBadge status={selectedShipment.status} />
                        {selectedShipment.isDelayed && (
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
                      <CarrierBadge carrier={selectedShipment.carrier} />
                    </div>
                  </motion.div>

                  {/* Tracking Number */}
                  {selectedShipment.trackingNumber && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-muted/50 rounded-lg border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-sm font-medium">Tracking Number</p>
                          <p className="font-mono text-base font-semibold">{selectedShipment.trackingNumber}</p>
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

                  {/* Route Information */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                  >
                    <h3 className="font-semibold">Route Information</h3>
                    <div className="space-y-3">
                      <div className="space-y-1.5 rounded-lg border p-3">
                        <p className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                          <MapPin className="size-3.5" />
                          Origin
                        </p>
                        <p className="font-medium">{selectedShipment.origin}</p>
                      </div>
                      <div className="space-y-1.5 rounded-lg border p-3">
                        <p className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                          <MapPin className="size-3.5" />
                          Destination
                        </p>
                        <p className="font-medium">{selectedShipment.destination}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Timeline Dates */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                  >
                    <h3 className="font-semibold">Timeline</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 rounded-lg border p-3">
                        <div className="bg-muted flex size-9 items-center justify-center rounded-full">
                          <Calendar className="size-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-muted-foreground text-xs">Created</p>
                          <p className="text-sm font-medium">{formatShortDate(selectedShipment.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg border p-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/30">
                          <Clock className="size-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-muted-foreground text-xs">Expected Arrival</p>
                          <p className="text-sm font-medium">{formatDate(selectedShipment.expectedArrival)}</p>
                        </div>
                      </div>
                      {selectedShipment.actualArrival && (
                        <div className="flex items-center gap-3 rounded-lg border p-3">
                          <div className="flex size-9 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
                            <Package className="size-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-muted-foreground text-xs">Actual Arrival</p>
                            <p className="text-sm font-medium">{formatDate(selectedShipment.actualArrival)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Right Column - Shipment Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <h3 className="font-semibold">Shipment Progress</h3>
                  <div className="rounded-lg border p-4">
                    <DetailedShipmentTimeline events={selectedShipment.events} />
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Shipment Form */}
      <AddShipmentForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onSubmit={(data) => {
          console.log("New shipment data:", data);
          // TODO: Add shipment to the list
        }}
      />
    </div>
  );
}
