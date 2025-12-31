"use client";

import { Plus } from "lucide-react";
import { siPaypal, siOpenai, siVercel, siFigma } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, cn } from "@/lib/utils";

import { AppleCard, VisaCard, AmexCard } from "./credit-cards";

const recentPayments = [
  {
    id: 1,
    icon: siPaypal,
    title: "Advance Payment",
    subtitle: "Received via PayPal for Website Project",
    type: "credit",
    amount: 1200,
    date: "Jul 8",
  },
  {
    id: 2,
    icon: siOpenai,
    title: "ChatGPT Subscription",
    subtitle: "OpenAI monthly subscription",
    type: "debit",
    amount: 20,
    date: "Jul 7",
  },
  {
    id: 3,
    icon: siVercel,
    title: "Vercel Team Subscription",
    subtitle: "Vercel cloud hosting charges",
    type: "debit",
    amount: 160,
    date: "Jul 4",
  },
  {
    id: 4,
    icon: siFigma,
    title: "Figma Pro",
    subtitle: "Figma professional plan",
    type: "debit",
    amount: 35,
    date: "Jul 2",
  },
];

export function AccountOverview() {
  return (
    <Card className="shadow-xs">
      <CardHeader className="items-center">
        <CardTitle>My Cards</CardTitle>
        <CardDescription>Your card summary, balance, and recent transactions in one view.</CardDescription>
        <CardAction>
          <Button size="icon" variant="outline">
            <Plus className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Tabs className="gap-4" defaultValue="apple">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="apple">Apple Card</TabsTrigger>
            <TabsTrigger value="visa">Visa</TabsTrigger>
            <TabsTrigger value="amex">Amex</TabsTrigger>
          </TabsList>
          <TabsContent value="apple">
            <div className="space-y-4">
              <div className="w-full max-w-96">
                <AppleCard />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Card Number</span>
                  <span className="font-medium tabular-nums">•••• •••• 5416</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expiry Date</span>
                  <span className="font-medium tabular-nums">06/09</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">CVC</span>
                  <span className="font-medium">•••</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Spending Limit</span>
                  <span className="font-medium tabular-nums">$62,000.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Available Balance</span>
                  <span className="font-medium tabular-nums">$13,100.06</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" size="sm">
                  Freeze Card
                </Button>
                <Button className="flex-1" variant="outline" size="sm">
                  Set Limit
                </Button>
                <Button className="flex-1" variant="outline" size="sm">
                  More
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h6 className="text-muted-foreground text-sm uppercase">Recent Payments</h6>

                <div className="space-y-4">
                  {recentPayments.map((transaction) => (
                    <div key={transaction.id} className="flex items-center gap-2">
                      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
                        <SimpleIcon icon={transaction.icon} className="size-5" />
                      </div>
                      <div className="flex w-full items-end justify-between">
                        <div>
                          <p className="text-sm font-medium">{transaction.title}</p>
                          <p className="text-muted-foreground line-clamp-1 text-xs">{transaction.subtitle}</p>
                        </div>
                        <div>
                          <span
                            className={cn(
                              "text-sm leading-none font-medium tabular-nums",
                              transaction.type === "debit" ? "text-destructive" : "text-green-500",
                            )}
                          >
                            {formatCurrency(transaction.amount, { noDecimals: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full" size="sm" variant="outline">
                  View All Payments
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="visa">
            <div className="space-y-4">
              <div className="w-full max-w-96">
                <VisaCard />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Card Number</span>
                  <span className="font-medium tabular-nums">•••• •••• 5416</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expiry Date</span>
                  <span className="font-medium tabular-nums">06/09</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">CVC</span>
                  <span className="font-medium">•••</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Spending Limit</span>
                  <span className="font-medium tabular-nums">$50,000.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Available Balance</span>
                  <span className="font-medium tabular-nums">$28,450.82</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" size="sm">
                  Freeze Card
                </Button>
                <Button className="flex-1" variant="outline" size="sm">
                  Set Limit
                </Button>
                <Button className="flex-1" variant="outline" size="sm">
                  More
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h6 className="text-muted-foreground text-sm uppercase">Recent Payments</h6>

                <div className="space-y-4">
                  {recentPayments.map((transaction) => (
                    <div key={transaction.id} className="flex items-center gap-2">
                      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
                        <SimpleIcon icon={transaction.icon} className="size-5" />
                      </div>
                      <div className="flex w-full items-end justify-between">
                        <div>
                          <p className="text-sm font-medium">{transaction.title}</p>
                          <p className="text-muted-foreground line-clamp-1 text-xs">{transaction.subtitle}</p>
                        </div>
                        <div>
                          <span
                            className={cn(
                              "text-sm leading-none font-medium tabular-nums",
                              transaction.type === "debit" ? "text-destructive" : "text-green-500",
                            )}
                          >
                            {formatCurrency(transaction.amount, { noDecimals: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full" size="sm" variant="outline">
                  View All Payments
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="amex">
            <div className="space-y-4">
              <div className="w-full max-w-96">
                <AmexCard />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Card Number</span>
                  <span className="font-medium tabular-nums">•••• •••••• •5416</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expiry Date</span>
                  <span className="font-medium tabular-nums">06/09</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">CVC</span>
                  <span className="font-medium">•••</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Spending Limit</span>
                  <span className="font-medium tabular-nums">$75,000.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Available Balance</span>
                  <span className="font-medium tabular-nums">$42,890.15</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" size="sm">
                  Freeze Card
                </Button>
                <Button className="flex-1" variant="outline" size="sm">
                  Set Limit
                </Button>
                <Button className="flex-1" variant="outline" size="sm">
                  More
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h6 className="text-muted-foreground text-sm uppercase">Recent Payments</h6>

                <div className="space-y-4">
                  {recentPayments.map((transaction) => (
                    <div key={transaction.id} className="flex items-center gap-2">
                      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
                        <SimpleIcon icon={transaction.icon} className="size-5" />
                      </div>
                      <div className="flex w-full items-end justify-between">
                        <div>
                          <p className="text-sm font-medium">{transaction.title}</p>
                          <p className="text-muted-foreground line-clamp-1 text-xs">{transaction.subtitle}</p>
                        </div>
                        <div>
                          <span
                            className={cn(
                              "text-sm leading-none font-medium tabular-nums",
                              transaction.type === "debit" ? "text-destructive" : "text-green-500",
                            )}
                          >
                            {formatCurrency(transaction.amount, { noDecimals: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full" size="sm" variant="outline">
                  View All Payments
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
