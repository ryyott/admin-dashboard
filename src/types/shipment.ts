export type ShipmentStatus = "draft" | "in_progress" | "arrived" | "canceled" | "delayed";

export type Carrier = "FedEx" | "Australia Post" | "DHL" | "UPS" | "Star Track" | "TNT" | "Arameo";

export interface ShipmentEvent {
  id: string;
  status: "pending" | "in_progress" | "completed" | "delayed";
  label: string;
  timestamp?: Date;
  location?: string;
}

export interface Shipment {
  id: string;
  shipmentId: string;
  orderId: string;
  status: ShipmentStatus;
  carrier: Carrier;
  trackingNumber?: string;
  origin: string;
  destination: string;
  expectedArrival: Date;
  actualArrival?: Date;
  createdAt: Date;
  updatedAt: Date;
  events: ShipmentEvent[];
  isDelayed?: boolean;
}
