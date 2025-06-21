
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EggProductionReport, FinancialReport, Report, ReportType } from "@/types";
import { ReportSummary } from "./ReportSummary";
import { ReportCharts } from "./ReportCharts";
import { ReportTable } from "./ReportTable";

interface ReportViewerProps {
  report: Report;
}

export const ReportViewer = ({ report }: ReportViewerProps) => {
  const [activeTab, setActiveTab] = useState<string>("summary");

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{report.title}</CardTitle>
        <CardDescription>Generated on {new Date(report.createdAt).toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <ReportSummary report={report} />
          </TabsContent>

          <TabsContent value="charts">
            <ReportCharts report={report} />
          </TabsContent>

          <TabsContent value="data">
            <ReportTable report={report} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
