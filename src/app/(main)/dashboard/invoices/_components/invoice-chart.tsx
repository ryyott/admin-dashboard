"use client";

import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Invoice } from "@/types/invoice";

const chartConfig = {
  revenue: {
    label: "Revenue",
  },
  paid: {
    label: "Paid",
    color: "var(--chart-1)",
  },
  sent: {
    label: "Sent",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface InvoiceChartProps {
  invoices: Invoice[];
}

export function InvoiceChart({ invoices }: InvoiceChartProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Generate mock chart data (in production, this would be real data)
  const chartData = React.useMemo(() => {
    const data = [];
    const referenceDate = new Date("2025-01-15");
    let daysToGenerate = 90;

    if (timeRange === "30d") {
      daysToGenerate = 30;
    } else if (timeRange === "7d") {
      daysToGenerate = 7;
    }

    // Use deterministic values based on day index to avoid hydration issues
    for (let i = daysToGenerate; i >= 0; i--) {
      const date = new Date(referenceDate);
      date.setDate(date.getDate() - i);

      // Generate deterministic values using sine waves for smooth variation
      const paidBase = 3500;
      const paidVariation = Math.sin(i / 5) * 1500;
      const sentBase = 2000;
      const sentVariation = Math.cos(i / 4) * 1000;

      data.push({
        date: date.toISOString().split("T")[0],
        paid: Math.floor(paidBase + paidVariation),
        sent: Math.floor(sentBase + sentVariation),
      });
    }

    return data;
  }, [timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Invoice Revenue</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Revenue trends for the last 3 months</span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4 px-2 pt-4 sm:px-6 sm:pt-6">
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[var(--chart-1)]" />
            <span className="text-muted-foreground">Paid Invoices</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[var(--chart-2)]" />
            <span className="text-muted-foreground">Sent (Pending)</span>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillPaid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-paid)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-paid)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillSent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-sent)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-sent)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                  formatter={(value, name) => (
                    <>
                      <div
                        className="size-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                        style={
                          {
                            "--color-bg": `var(--color-${name})`,
                          } as React.CSSProperties
                        }
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label || name}
                      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                        ${value.toLocaleString()}
                      </div>
                    </>
                  )}
                />
              }
            />
            <Area dataKey="sent" type="natural" fill="url(#fillSent)" stroke="var(--color-sent)" stackId="a" />
            <Area dataKey="paid" type="natural" fill="url(#fillPaid)" stroke="var(--color-paid)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
