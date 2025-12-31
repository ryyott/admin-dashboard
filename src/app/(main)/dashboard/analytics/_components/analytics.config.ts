import { ChartConfig } from "@/components/ui/chart";

// Sales Overview Chart Data - Static data to prevent hydration errors
const generateSalesData = () => {
  const seed = 12345; // Static seed for consistent values
  let current = seed;

  const seededRandom = () => {
    current = (current * 9301 + 49297) % 233280;
    return current / 233280;
  };

  return Array.from({ length: 90 }, (_, i) => {
    const date = new Date(2024, 3, 1);
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split("T")[0],
      website: Math.floor(seededRandom() * 200) + 150,
      mobile: Math.floor(seededRandom() * 150) + 100,
      market: Math.floor(seededRandom() * 100) + 50,
      agent: Math.floor(seededRandom() * 80) + 40,
    };
  });
};

export const salesOverviewData = generateSalesData();

export const salesOverviewConfig = {
  website: {
    label: "Website",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  market: {
    label: "Market",
    color: "var(--chart-3)",
  },
  agent: {
    label: "Agent",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

// Revenue Card Mini Chart
export const revenueChartData = [
  { month: 1, revenue: 18500 },
  { month: 2, revenue: 22000 },
  { month: 3, revenue: 19800 },
  { month: 4, revenue: 25400 },
  { month: 5, revenue: 28900 },
  { month: 6, revenue: 34343 },
];

export const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// Customers Card Mini Chart
export const customersChartData = [
  { date: 1, customers: 320 },
  { date: 2, customers: 380 },
  { date: 3, customers: 420 },
  { date: 4, customers: 390 },
  { date: 5, customers: 450 },
  { date: 6, customers: 510 },
  { date: 7, customers: 543 },
];

export const customersChartConfig = {
  customers: {
    label: "Customers",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Orders Card Mini Chart
export const ordersChartData = [
  { date: 1, orders: 650, cancelled: 30 },
  { date: 2, orders: 720, cancelled: 25 },
  { date: 3, orders: 680, cancelled: 40 },
  { date: 4, orders: 790, cancelled: 35 },
  { date: 5, orders: 850, cancelled: 28 },
  { date: 6, orders: 920, cancelled: 32 },
  { date: 7, orders: 856, cancelled: 44 },
];

export const ordersChartConfig = {
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-1))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

// Conversion Card Mini Chart
export const conversionChartData = [
  { month: 1, rate: 3.2 },
  { month: 2, rate: 3.5 },
  { month: 3, rate: 3.1 },
  { month: 4, rate: 3.8 },
  { month: 5, rate: 4.2 },
  { month: 6, rate: 4.5 },
];

export const conversionChartConfig = {
  rate: {
    label: "Conversion Rate",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

// Platform Performance Data
export const platformData = [
  { platform: "Dribbble", revenue: 227459, percentage: 43 },
  { platform: "Instagram", revenue: 142823, percentage: 27 },
  { platform: "Google", revenue: 37028, percentage: 14.1 },
  { platform: "Behance", revenue: 89935, percentage: 11 },
  { platform: "Other", revenue: 31028, percentage: 7.1 },
];

export const platformChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// Sales Users Data
export interface SalesUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  sales: number;
  revenue: number;
  leads: number;
  kpi: number;
  winRate: number;
}

export const salesUsersData: SalesUser[] = [
  {
    id: "1",
    name: "Armin A.",
    email: "armin@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    sales: 41,
    revenue: 209633,
    leads: 118,
    kpi: 0.84,
    winRate: 31,
  },
  {
    id: "2",
    name: "Mikasa A.",
    email: "mikasa@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    sales: 54,
    revenue: 156841,
    leads: 103,
    kpi: 0.89,
    winRate: 39,
  },
  {
    id: "3",
    name: "Eren Y.",
    email: "eren@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    sales: 22,
    revenue: 117115,
    leads: 84,
    kpi: 0.79,
    winRate: 32,
  },
  {
    id: "4",
    name: "Levi A.",
    email: "levi@example.com",
    avatar: "https://i.pravatar.cc/150?img=12",
    sales: 38,
    revenue: 145386,
    leads: 95,
    kpi: 0.92,
    winRate: 35,
  },
  {
    id: "5",
    name: "Historia R.",
    email: "historia@example.com",
    avatar: "https://i.pravatar.cc/150?img=20",
    sales: 29,
    revenue: 98250,
    leads: 78,
    kpi: 0.76,
    winRate: 28,
  },
];

// Payment Gateway Transactions
export interface Transaction {
  id: string;
  gateway: string;
  category: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
}

export const transactionsData: Transaction[] = [
  {
    id: "1",
    gateway: "PayPal",
    category: "Big Brands",
    amount: 6235,
    status: "completed",
    date: "2024-06-28",
  },
  {
    id: "2",
    gateway: "Wallet",
    category: "Bill Payment",
    amount: -235,
    status: "completed",
    date: "2024-06-27",
  },
  {
    id: "3",
    gateway: "Credit Card",
    category: "Bill Payment",
    amount: 2235,
    status: "completed",
    date: "2024-06-26",
  },
  {
    id: "4",
    gateway: "Bank Transfer",
    category: "Subscription",
    amount: 1450,
    status: "pending",
    date: "2024-06-25",
  },
  {
    id: "5",
    gateway: "Stripe",
    category: "E-commerce",
    amount: 8920,
    status: "completed",
    date: "2024-06-24",
  },
];
