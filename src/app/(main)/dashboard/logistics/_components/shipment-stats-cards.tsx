"use client";

import { Package, Truck, CheckCircle2, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Shipment } from "@/types/shipment";

interface ShipmentStatsCardsProps {
  shipments: Shipment[];
}

export function ShipmentStatsCards({ shipments }: ShipmentStatsCardsProps) {
  // Calculate stats
  const totalShipments = shipments.length;
  const inProgressShipments = shipments.filter((s) => s.status === "in_progress").length;
  const arrivedShipments = shipments.filter((s) => s.status === "arrived").length;
  const delayedShipments = shipments.filter((s) => s.status === "delayed" || s.isDelayed).length;

  // Calculate percentages (mock trending data)
  const inProgressTrend = 12;
  const arrivedTrend = 8;
  const delayedTrend = -5;

  const stats = [
    {
      title: "Total Shipments",
      value: totalShipments,
      icon: Package,
      iconBgColor: "bg-purple-100 dark:bg-purple-950/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      trend: null,
    },
    {
      title: "In Transit",
      value: inProgressShipments,
      icon: Truck,
      iconBgColor: "bg-blue-100 dark:bg-blue-950/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      trend: {
        value: inProgressTrend,
        isPositive: true,
      },
    },
    {
      title: "Delivered",
      value: arrivedShipments,
      icon: CheckCircle2,
      iconBgColor: "bg-green-100 dark:bg-green-950/30",
      iconColor: "text-green-600 dark:text-green-400",
      trend: {
        value: arrivedTrend,
        isPositive: true,
      },
    },
    {
      title: "Delayed",
      value: delayedShipments,
      icon: AlertCircle,
      iconBgColor: "bg-orange-100 dark:bg-orange-950/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      trend: {
        value: Math.abs(delayedTrend),
        isPositive: false,
      },
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="from-primary/5 bg-gradient-to-t p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
                {stat.trend && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "gap-1",
                      stat.trend.isPositive
                        ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
                    )}
                  >
                    {stat.trend.isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {stat.trend.value}%
                  </Badge>
                )}
              </div>
            </div>
            <div className={cn("flex size-12 items-center justify-center rounded-lg", stat.iconBgColor)}>
              <stat.icon className={cn("size-6", stat.iconColor)} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
