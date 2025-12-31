import Image from "next/image";

import { cn } from "@/lib/utils";
import { type Carrier } from "@/types/shipment";

interface CarrierBadgeProps {
  carrier: Carrier;
  className?: string;
  showLabel?: boolean;
}

const carrierConfig: Record<Carrier, { logo?: string; bgColor: string; textColor: string; name: string }> = {
  FedEx: {
    logo: "/carriers/fedex.svg",
    bgColor: "bg-purple-100 dark:bg-purple-950/30",
    textColor: "text-purple-700 dark:text-purple-400",
    name: "FedEx",
  },
  "Australia Post": {
    logo: "/carriers/australia-post.svg",
    bgColor: "bg-red-100 dark:bg-red-950/30",
    textColor: "text-red-700 dark:text-red-400",
    name: "Australia Post",
  },
  DHL: {
    logo: "/carriers/dhl.svg",
    bgColor: "bg-yellow-100 dark:bg-yellow-950/30",
    textColor: "text-yellow-700 dark:text-yellow-400",
    name: "DHL",
  },
  UPS: {
    logo: "/carriers/ups.svg",
    bgColor: "bg-amber-100 dark:bg-amber-950/30",
    textColor: "text-amber-700 dark:text-amber-400",
    name: "UPS",
  },
  "Star Track": {
    logo: "/carriers/star-track.svg",
    bgColor: "bg-blue-100 dark:bg-blue-950/30",
    textColor: "text-blue-700 dark:text-blue-400",
    name: "Star Track",
  },
  TNT: {
    bgColor: "bg-orange-100 dark:bg-orange-950/30",
    textColor: "text-orange-700 dark:text-orange-400",
    name: "TNT",
  },
  Arameo: {
    bgColor: "bg-red-100 dark:bg-red-950/30",
    textColor: "text-red-700 dark:text-red-400",
    name: "Arameo",
  },
};

export function CarrierBadge({ carrier, className, showLabel = true }: CarrierBadgeProps) {
  const config = carrierConfig[carrier];

  return (
    <div className={cn("inline-flex items-center gap-2 rounded-md px-2 py-1", config.bgColor, className)}>
      {config.logo ? (
        <div className="relative h-5 w-12">
          <Image src={config.logo} alt={carrier} fill className="object-contain" />
        </div>
      ) : (
        showLabel && <span className={cn("text-xs font-bold", config.textColor)}>{config.name}</span>
      )}
      {showLabel && config.logo && <span className={cn("text-sm font-medium", config.textColor)}>{carrier}</span>}
    </div>
  );
}
