"use client";

import { CreditCard, Wallet, Building2, Globe } from "lucide-react";
import { siDribbble, siInstagram, siGoogle, siBehance } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { platformData, transactionsData } from "./analytics.config";

const platformIcons = {
  Dribbble: siDribbble,
  Instagram: siInstagram,
  Google: siGoogle,
  Behance: siBehance,
} as const;

const gatewayIcons = {
  PayPal: Wallet,
  Wallet: Wallet,
  "Credit Card": CreditCard,
  "Bank Transfer": Building2,
  Stripe: CreditCard,
} as const;

export function InsightCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Platform Performance */}
      <Card data-slot="card">
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {platformData.map((platform) => {
              const Icon = platformIcons[platform.platform as keyof typeof platformIcons];

              return (
                <div key={platform.platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {Icon ? (
                        <div className="bg-muted/50 flex size-10 items-center justify-center rounded-lg">
                          <SimpleIcon icon={Icon} className="size-5" />
                        </div>
                      ) : (
                        <div className="bg-muted/50 flex size-10 items-center justify-center rounded-lg">
                          <Globe className="size-5" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium">{platform.platform}</div>
                        <div className="text-muted-foreground text-xs">{platform.percentage}% of total</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold tabular-nums">${(platform.revenue / 1000).toFixed(1)}k</div>
                    </div>
                  </div>
                  <Progress value={platform.percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">Total revenue across all platforms</p>
        </CardFooter>
      </Card>

      {/* Payment Gateways */}
      <Card data-slot="card">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactionsData.map((transaction) => {
              const Icon = gatewayIcons[transaction.gateway as keyof typeof gatewayIcons] || Wallet;
              const isPositive = transaction.amount > 0;

              return (
                <div
                  key={transaction.id}
                  className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg ${
                        isPositive ? "bg-green-500/10" : "bg-orange-500/10"
                      }`}
                    >
                      <Icon className={`size-5 ${isPositive ? "text-green-500" : "text-orange-500"}`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{transaction.gateway}</div>
                      <div className="text-muted-foreground text-xs">{transaction.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={transaction.status === "completed" ? "default" : "secondary"}
                      className="hidden sm:flex"
                    >
                      {transaction.status}
                    </Badge>
                    <div
                      className={`text-sm font-semibold tabular-nums ${
                        isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                      }`}
                    >
                      {isPositive ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View all transactions
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
