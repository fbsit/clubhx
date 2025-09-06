
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AnalyticsFunnel from "@/components/analytics/AnalyticsFunnel";
import AnalyticsKPIGroup from "@/components/analytics/AnalyticsKPIGroup";
import ProductEngagementChart from "@/components/analytics/ProductEngagementChart";
import ExitPagesTable from "@/components/analytics/ExitPagesTable";
import LoyaltySummary from "@/components/analytics/LoyaltySummary";


export default function AdminAnalytics() {
  // Opcional: Período de análisis simulado
  const [dateRange] = React.useState({
    from: "2024-05-01",
    to: "2024-05-16",
  });

  return (
    <div className="container py-6 animate-fade-in">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Analítica del Sitio</CardTitle>
          <p className="text-muted-foreground mt-2 text-sm">
            Datos agregados y comportamiento de usuario para optimización de CLUB HX.<br />
            <span className="text-xs">Período: {dateRange.from} al {dateRange.to}</span>
          </p>
        </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="col-span-1 xl:col-span-2">
          <AnalyticsFunnel />
        </div>
        <div className="col-span-1">
          <AnalyticsKPIGroup />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-8">
        <div className="col-span-1 xl:col-span-2">
          <ProductEngagementChart />
        </div>
        <div className="col-span-1">
          <LoyaltySummary />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2 mt-8">
        <div className="col-span-1 xl:col-span-2">
          <ExitPagesTable />
        </div>
      </div>
    </div>
  );
}
