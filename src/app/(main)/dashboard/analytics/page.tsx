import { InsightCards } from "./_components/insight-cards";
import { OverviewCards } from "./_components/overview-cards";
import { SalesAnalyticsInteractive } from "./_components/sales-analytics-interactive";
import { SalesTable } from "./_components/sales-table";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      {/* Overview KPI Cards with Mini Charts */}
      <OverviewCards />

      {/* Interactive Sales Distribution Chart */}
      <SalesAnalyticsInteractive />

      {/* Platform Performance & Payment Gateways */}
      <InsightCards />

      {/* Sales Performance Table */}
      <SalesTable />
    </div>
  );
}
