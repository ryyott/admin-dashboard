"use client";

import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

import { salesOverviewData, salesOverviewConfig } from "./analytics.config";

export function SalesAnalyticsInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = salesOverviewData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date(salesOverviewData[salesOverviewData.length - 1].date);
    let daysToSubtract = 30;
    if (timeRange === "90d") {
      daysToSubtract = 90;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  // Calculate totals
  const totals = filteredData.reduce(
    (acc, item) => {
      acc.website += item.website;
      acc.mobile += item.mobile;
      acc.market += item.market;
      acc.agent += item.agent;
      return acc;
    },
    { website: 0, mobile: 0, market: 0, agent: 0 },
  );

  const grandTotal = Object.values(totals).reduce((sum, val) => sum + val, 0);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Sales Distribution</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Platform Sales Generated</span>
          <span className="@[540px]/card:hidden">Platform Sales</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 90 days</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 90 days
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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:px-0">
          <div className="space-y-1">
            <div className="text-2xl font-bold tabular-nums">${((totals.website / 1000) * 10).toFixed(1)}k</div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <div className="bg-chart-1 h-2 w-2 rounded-full" />
              Website ({((totals.website / grandTotal) * 100).toFixed(0)}%)
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold tabular-nums">${((totals.mobile / 1000) * 10).toFixed(1)}k</div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <div className="bg-chart-2 h-2 w-2 rounded-full" />
              Mobile ({((totals.mobile / grandTotal) * 100).toFixed(0)}%)
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold tabular-nums">${((totals.market / 1000) * 10).toFixed(1)}k</div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <div className="bg-chart-3 h-2 w-2 rounded-full" />
              Market ({((totals.market / grandTotal) * 100).toFixed(0)}%)
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold tabular-nums">${((totals.agent / 1000) * 10).toFixed(1)}k</div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <div className="bg-chart-4 h-2 w-2 rounded-full" />
              Agent ({((totals.agent / grandTotal) * 100).toFixed(0)}%)
            </div>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={salesOverviewConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillWebsite" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-website)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-website)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMarket" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-market)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-market)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillAgent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-agent)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-agent)" stopOpacity={0.1} />
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
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="agent"
              type="natural"
              fill="url(#fillAgent)"
              stroke="var(--color-agent)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="market"
              type="natural"
              fill="url(#fillMarket)"
              stroke="var(--color-market)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="website"
              type="natural"
              fill="url(#fillWebsite)"
              stroke="var(--color-website)"
              strokeWidth={2}
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
