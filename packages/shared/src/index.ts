export const appName = "BizOs";

export const routes = {
  home: "/",
  dashboard: "/dashboard",
};

export type AppConfig = {
  name: string;
  supportEmail: string;
};

export const appConfig: AppConfig = {
  name: appName,
  supportEmail: "support@bizos.app",
};

export type Metric = {
  label: string;
  value: string;
  change: string;
  positive: boolean;
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

export type DashboardData = {
  metrics: Metric[];
  activities: ActivityItem[];
  revenue: {
    total: string;
    trend: string;
  };
};

export const dashboardData: DashboardData = {
  metrics: [
    { label: "Monthly revenue", value: "$48.2K", change: "+12.4%", positive: true },
    { label: "Active clients", value: "1,284", change: "+8.1%", positive: true },
    { label: "Conversion rate", value: "6.8%", change: "+1.3%", positive: true },
    { label: "Refunds", value: "$1.1K", change: "-0.6%", positive: false },
  ],
  revenue: {
    total: "$132.4K",
    trend: "+18.2% from last month",
  },
  activities: [
    { id: "1", title: "New enterprise lead", detail: "Acme Labs requested a demo", time: "12 min ago" },
    { id: "2", title: "Invoice paid", detail: "Proxima Studio settled Q3 billing", time: "49 min ago" },
    { id: "3", title: "Campaign launched", detail: "Summer retention flow went live", time: "2 hrs ago" },
    { id: "4", title: "Client check-in", detail: "Northstar Health reviewed the dashboard", time: "Today" },
  ],
};
