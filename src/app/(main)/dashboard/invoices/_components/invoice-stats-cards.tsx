import { TrendingUp, TrendingDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

interface InvoiceStatsCardsProps {
  invoices: Invoice[];
}

export function InvoiceStatsCards({ invoices }: InvoiceStatsCardsProps) {
  // Calculate stats
  const totalRevenue = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.totals.total, 0);

  const draftsCount = invoices.filter((inv) => inv.status === "draft").length;
  const sentCount = invoices.filter((inv) => inv.status === "sent").length;
  const paidCount = invoices.filter((inv) => inv.status === "paid").length;
  const overdueCount = invoices.filter((inv) => inv.status === "overdue").length;

  const totalCount = invoices.length;

  // Calculate percentage changes (mock for now)
  const revenueChange = 12.5;
  const paidChange = 8.3;
  const overdueChange = -15.2;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4">
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">
            {formatCurrency(totalRevenue, { currency: "USD" })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              {revenueChange >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {revenueChange >= 0 ? "+" : ""}
              {revenueChange}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 pt-0 text-xs">
          <div className="line-clamp-1 flex gap-1.5 font-medium">
            From paid invoices{" "}
            {revenueChange >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
          </div>
          <div className="text-muted-foreground">
            {paidCount} of {totalCount} invoices paid
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription>Paid Invoices</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">{paidCount}</CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              {paidChange >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {paidChange >= 0 ? "+" : ""}
              {paidChange}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 pt-0 text-xs">
          <div className="line-clamp-1 flex gap-1.5 font-medium">
            Successfully collected{" "}
            {paidChange >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
          </div>
          <div className="text-muted-foreground">Strong payment rate</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription>Pending Payments</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">{sentCount}</CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              <TrendingUp className="size-3" />
              Awaiting
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 pt-0 text-xs">
          <div className="line-clamp-1 flex gap-1.5 font-medium">Sent and waiting</div>
          <div className="text-muted-foreground">{draftsCount} drafts remaining</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription>Overdue Invoices</CardDescription>
          <CardTitle className="text-destructive text-3xl font-semibold tabular-nums">{overdueCount}</CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              {overdueChange >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {overdueChange >= 0 ? "+" : ""}
              {overdueChange}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 pt-0 text-xs">
          <div className="line-clamp-1 flex gap-1.5 font-medium">
            Needs immediate attention{" "}
            {overdueChange >= 0 ? <TrendingDown className="size-3" /> : <TrendingUp className="size-3" />}
          </div>
          <div className="text-muted-foreground">Follow up required</div>
        </CardFooter>
      </Card>
    </div>
  );
}
